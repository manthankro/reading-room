import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

const snapshotSchema = z.object({
  places: z.record(
    z.string(),
    z.object({
      index: z.number().int().nonnegative(),
      ratio: z.number().min(0).max(1),
      updatedAt: z.number(),
      finished: z.boolean(),
    }),
  ),
  notes: z
    .array(
      z.object({
        id: z.string(),
        slug: z.string(),
        quote: z.string().max(320),
        body: z.string().max(4000),
        createdAt: z.number(),
      }),
    )
    .max(2000),
  bookmarks: z
    .array(
      z.object({
        id: z.string(),
        slug: z.string(),
        index: z.number().int().nonnegative(),
        createdAt: z.number(),
      }),
    )
    .max(5000),
  highlights: z
    .array(
      z.object({
        id: z.string(),
        slug: z.string(),
        quote: z.string().max(320),
        createdAt: z.number(),
      }),
    )
    .max(5000),
  seconds: z.record(z.string(), z.number().nonnegative()),
  dailySeconds: z.record(z.string(), z.number().nonnegative()),
  goalMinutes: z.number().int().min(5).max(240),
  light: z.enum(["lamp", "day", "night"]),
  size: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  measure: z.enum(["narrow", "comfort", "wide"]),
  leading: z.enum(["snug", "open"]),
});

export const loadReadingSnapshot = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      snapshot: unknown;
    }>`select snapshot from reading_sync where user_id = ${context.userId}`;
    if (!rows[0]) return null;
    const parsed = snapshotSchema.safeParse(rows[0].snapshot);
    return parsed.success ? parsed.data : null;
  });

export const saveReadingSnapshot = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const snapshot = snapshotSchema.parse(input);
    if (JSON.stringify(snapshot).length > 250_000)
      throw new Error("Your reading shelf is too large to sync.");
    return snapshot;
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`insert into reading_sync (user_id, snapshot, updated_at) values (${context.userId}, ${JSON.stringify(data)}::jsonb, now()) on conflict (user_id) do update set snapshot = excluded.snapshot, updated_at = now()`;
    return { saved: true as const };
  });
