import { createServerFn } from "@tanstack/react-start";
import nodemailer from "nodemailer";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { dbSource, getSql } from "@/lib/db";

const emailSchema = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
const urlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => value === "" || /^https?:\/\//i.test(value), "Use an http or https URL.")
  .refine((value) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, "Enter a valid URL.");

const applicationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: emailSchema,
  languages: z.array(z.string().trim().min(1).max(60)).min(1).max(10),
  genres: z.array(z.string().trim().min(1).max(80)).min(1).max(12),
  introduction: z.string().trim().min(20).max(1200),
  experience: z.string().trim().max(1200),
  motivation: z.string().trim().min(20).max(1600),
  portfolioUrl: urlSchema,
  message: z.string().trim().max(1600),
  consent: z.literal(true),
  website: z.string().max(0),
});

type Application = z.infer<typeof applicationSchema>;
type NotificationStatus = "not_configured" | "pending" | "sent" | "failed";
type WriterApplicationRow = {
  id: string;
  full_name: string;
  contact_email: string;
  languages: string[] | string;
  genres: string[] | string;
  introduction: string;
  experience: string;
  motivation: string;
  portfolio_url: string | null;
  message: string;
  status: "pending_review" | "in_review" | "accepted" | "rejected" | "withdrawn";
  review_notes: string;
  notification_status: NotificationStatus;
  notification_error: string | null;
  submitted_at: string | Date;
};

type EmailConfig =
  | { provider: "gmail"; to: string; from: string; user: string; appPassword: string }
  | { provider: "resend"; to: string; from: string; apiKey: string };

function configuredEmail(): EmailConfig | null {
  const to = process.env.WRITER_APPLICATION_EMAIL?.trim();
  const smtpUser = process.env.GMAIL_SMTP_USER?.trim();
  const appPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (to && smtpUser && appPassword) {
    return {
      provider: "gmail",
      to,
      user: smtpUser,
      appPassword,
      from: process.env.WRITER_APPLICATION_FROM?.trim() || `Reading Room <${smtpUser}>`,
    };
  }

  const from = process.env.WRITER_APPLICATION_FROM?.trim();
  const apiKey = process.env.RESEND_API_KEY?.trim();
  return to && from && apiKey ? { provider: "resend", to, from, apiKey } : null;
}

function textList(value: string[] | string): string[] {
  if (Array.isArray(value)) return value;
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

async function notifyOwner(application: WriterApplicationRow): Promise<NotificationStatus> {
  const config = configuredEmail();
  if (!config) return "not_configured";

  const submittedAt = new Date(application.submitted_at).toISOString();
  const safeName = application.full_name.replace(/[\r\n]+/g, " ").slice(0, 120);
  const lines = [
    "A writer application has been received for Reading Room.",
    "",
    `Applicant: ${application.full_name}`,
    `Email: ${application.contact_email}`,
    `Languages: ${textList(application.languages).join(", ")}`,
    `Genres and content types: ${textList(application.genres).join(", ")}`,
    "",
    "Introduction:",
    application.introduction,
    "",
    "Writing experience:",
    application.experience || "Not provided",
    "",
    "Why they want to contribute:",
    application.motivation,
    "",
    `Portfolio: ${application.portfolio_url || "Not provided"}`,
    `Additional message: ${application.message || "Not provided"}`,
    "",
    `Application ID: ${application.id}`,
    `Submitted: ${submittedAt}`,
    `Review: ${process.env.APP_BASE_URL?.trim() || "https://pramanix-shelf-app.vercel.app"}/admin/writers`,
  ];

  try {
    const subject = `New Reading Room Writer Application — ${safeName}`;
    if (config.provider === "gmail") {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: config.user, pass: config.appPassword },
      });
      await transporter.sendMail({
        from: config.from,
        to: config.to,
        replyTo: application.contact_email,
        subject,
        text: lines.join("\n"),
      });
      return "sent";
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        subject,
        text: lines.join("\n"),
      }),
    });
    if (!response.ok) return "failed";
    return "sent";
  } catch {
    return "failed";
  }
}

async function requireWriterAdmin(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const rows = await sql<{ email: string }>`select "email" from "user" where "id" = ${userId} limit 1`;
  const email = rows[0]?.email?.trim().toLowerCase();
  const allowed = (process.env.WRITER_ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (!email || !allowed.includes(email)) {
    throw new Error("Writer administration is not enabled for this account.");
  }
}

export const submitWriterApplication = createServerFn({ method: "POST" })
  .validator((input: unknown) => applicationSchema.parse(input))
  .handler(async ({ data }) => {
    const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
    assertSameSiteRequest();

    // PGLite is useful for local development, but its production fallback is
    // process memory. Refuse to promise durable receipt without Postgres.
    if (process.env.NODE_ENV === "production" && dbSource !== "neon") {
      throw new Error("Writer applications are temporarily unavailable. Please try again later.");
    }

    const sql = await getSql();
    const recent = await sql<{ count: number }>`select count(*)::int as count from writer_applications where lower(contact_email) = ${data.email} and submitted_at > now() - interval '1 hour'`;
    if (Number(recent[0]?.count ?? 0) >= 3) {
      throw new Error("We’ve received several recent applications from this email. Please try again later.");
    }

    const id = globalThis.crypto.randomUUID();
    const rows = await sql<WriterApplicationRow>`insert into writer_applications
      (id, full_name, contact_email, languages, genres, introduction, experience, motivation, portfolio_url, message, consent_to_contact, status, notification_status)
      values (${id}, ${data.fullName}, ${data.email}, ${JSON.stringify(data.languages)}::jsonb, ${JSON.stringify(data.genres)}::jsonb, ${data.introduction}, ${data.experience}, ${data.motivation}, ${data.portfolioUrl || null}, ${data.message}, true, 'pending_review', 'pending')
      returning id, full_name, contact_email, languages, genres, introduction, experience, motivation, portfolio_url, message, status, review_notes, notification_status, notification_error, submitted_at`;

    const application = rows[0];
    const notificationStatus = await notifyOwner(application);
    await sql`update writer_applications set notification_status = ${notificationStatus}, notification_error = ${notificationStatus === "failed" ? "Email delivery failed; an administrator can retry." : null}, updated_at = now() where id = ${id}`;

    return { received: true as const, id, notificationStatus };
  });

export const listWriterApplications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireWriterAdmin(sql, context.userId);
    const rows = await sql<WriterApplicationRow>`select id, full_name, contact_email, languages, genres, introduction, experience, motivation, portfolio_url, message, status, review_notes, notification_status, notification_error, submitted_at from writer_applications order by submitted_at desc limit 100`;
    return rows.map((row) => ({
      ...row,
      languages: textList(row.languages),
      genres: textList(row.genres),
      submittedAt: new Date(row.submitted_at).toISOString(),
    }));
  });

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending_review", "in_review", "accepted", "rejected", "withdrawn"]),
  reviewNotes: z.string().trim().max(4000),
});

export const updateWriterApplication = createServerFn({ method: "POST" })
  .validator((input: unknown) => updateSchema.parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireWriterAdmin(sql, context.userId);
    await sql`update writer_applications set status = ${data.status}, review_notes = ${data.reviewNotes}, updated_at = now() where id = ${data.id}`;
    return { saved: true as const };
  });

export const retryWriterApplicationEmail = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireWriterAdmin(sql, context.userId);
    const rows = await sql<WriterApplicationRow>`select id, full_name, contact_email, languages, genres, introduction, experience, motivation, portfolio_url, message, status, review_notes, notification_status, notification_error, submitted_at from writer_applications where id = ${data.id} limit 1`;
    const application = rows[0];
    if (!application) throw new Error("Application not found.");
    const notificationStatus = await notifyOwner(application);
    await sql`update writer_applications set notification_status = ${notificationStatus}, notification_error = ${notificationStatus === "failed" ? "Email delivery failed; an administrator can retry." : null}, updated_at = now() where id = ${data.id}`;
    return { notificationStatus };
  });
