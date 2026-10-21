import { useEffect, useState } from "react";
import {
  listWriterApplications,
  retryWriterApplicationEmail,
  updateWriterApplication,
} from "@/lib/writer-applications";

type Application = Awaited<ReturnType<typeof listWriterApplications>>[number];
type AppStatus = Application["status"];
type Draft = { status: AppStatus; reviewNotes: string };
const statuses: AppStatus[] = ["pending_review", "in_review", "accepted", "rejected", "withdrawn"];
const labels: Record<AppStatus, string> = {
  pending_review: "Pending review",
  in_review: "In review",
  accepted: "Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export function WriterAdminScreen() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const result = await listWriterApplications();
      setApplications(result);
      setDrafts(Object.fromEntries(result.map((item) => [item.id, {
        status: item.status,
        reviewNotes: item.review_notes,
      }])));
    } catch {
      setError("This area is restricted to approved Reading Room administrators. Check your sign-in and WRITER_ADMIN_EMAILS configuration.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  function draftFor(item: Application): Draft {
    return drafts[item.id] ?? { status: item.status, reviewNotes: item.review_notes };
  }

  async function save(item: Application) {
    const draft = draftFor(item);
    setBusyId(item.id);
    setNotice("");
    try {
      await updateWriterApplication({ data: { id: item.id, ...draft } });
      setNotice("Review details saved.");
      await refresh();
    } catch {
      setNotice("Could not save this review. Please retry.");
    } finally {
      setBusyId("");
    }
  }

  async function retryEmail(item: Application) {
    setBusyId(item.id);
    setNotice("");
    try {
      const result = await retryWriterApplicationEmail({ data: { id: item.id } });
      setNotice(result.notificationStatus === "sent" ? "Email notification sent." : "Notification is still not configured or delivery failed.");
      await refresh();
    } catch {
      setNotice("Could not retry this notification. Check the server email configuration.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <main className="shell min-h-screen" data-light="lamp">
      <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <p className="kicker">Private administration</p>
        <h1 className="mt-3 font-reading text-4xl">Writer applications</h1>
        <p className="muted mt-3 max-w-2xl">
          Candidate details are private. Review them here and keep notes visible only to authorized administrators.
        </p>
        {notice ? <p role="status" className="mt-5 rounded-xl border hairline elev p-4 text-sm">{notice}</p> : null}
        {loading ? <p role="status" className="mt-8 muted">Loading applications…</p> : null}
        {error ? <p role="alert" className="mt-8 rounded-xl border hairline elev p-5 text-sm">{error}</p> : null}
        {!loading && !error && applications.length === 0 ? (
          <p className="mt-8 rounded-xl border hairline elev p-5 font-reading text-xl">No applications yet.</p>
        ) : null}

        <div className="mt-8 grid gap-6">
          {applications.map((item) => {
            const draft = draftFor(item);
            return (
              <article key={item.id} className="rounded-2xl border hairline elev p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="kicker">Submitted {new Date(item.submittedAt).toLocaleString()}</p>
                    <h2 className="mt-2 font-reading text-2xl">{item.full_name}</h2>
                    <a className="mt-1 inline-block text-sm underline underline-offset-4" href={`mailto:${item.contact_email}`}>
                      {item.contact_email}
                    </a>
                    <p className="mt-3 text-sm muted">Languages: {item.languages.join(", ")}</p>
                    <p className="mt-1 text-sm muted">Genres: {item.genres.join(", ")}</p>
                  </div>
                  <span className="rounded-full border hairline px-3 py-1 text-xs">
                    {labels[item.status]}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 border-t hairline pt-5">
                  <section>
                    <h3 className="kicker">Introduction</h3>
                    <p className="mt-2 whitespace-pre-wrap leading-relaxed">{item.introduction}</p>
                  </section>
                  <section>
                    <h3 className="kicker">Writing experience</h3>
                    <p className="mt-2 whitespace-pre-wrap leading-relaxed">{item.experience || "Not provided"}</p>
                  </section>
                  <section>
                    <h3 className="kicker">Motivation</h3>
                    <p className="mt-2 whitespace-pre-wrap leading-relaxed">{item.motivation}</p>
                  </section>
                  {item.portfolio_url ? (
                    <section>
                      <h3 className="kicker">Portfolio</h3>
                      <a className="mt-2 inline-block break-all underline underline-offset-4" href={item.portfolio_url} target="_blank" rel="noreferrer">
                        {item.portfolio_url}
                      </a>
                    </section>
                  ) : null}
                  {item.message ? (
                    <section>
                      <h3 className="kicker">Message</h3>
                      <p className="mt-2 whitespace-pre-wrap leading-relaxed">{item.message}</p>
                    </section>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-4 border-t hairline pt-5 sm:grid-cols-[12rem_minmax(0,1fr)]">
                  <label>
                    <span className="kicker">Review status</span>
                    <select
                      className="select-field mt-2"
                      value={draft.status}
                      onChange={(event) => setDrafts((current) => ({
                        ...current,
                        [item.id]: { ...draft, status: event.target.value as AppStatus },
                      }))}
                    >
                      {statuses.map((status) => <option key={status} value={status}>{labels[status]}</option>)}
                    </select>
                  </label>
                  <label>
                    <span className="kicker">Private review notes</span>
                    <textarea
                      className="writer-textarea mt-2 min-h-28"
                      value={draft.reviewNotes}
                      maxLength={4000}
                      onChange={(event) => setDrafts((current) => ({
                        ...current,
                        [item.id]: { ...draft, reviewNotes: event.target.value },
                      }))}
                    />
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button type="button" className="btn btn-solid" disabled={busyId === item.id} onClick={() => void save(item)}>
                    {busyId === item.id ? "Saving…" : "Save review"}
                  </button>
                  <p className="text-sm muted">Email: {item.notification_status.replaceAll("_", " ")}</p>
                  {item.notification_status !== "sent" ? (
                    <button type="button" className="btn btn-ghost" disabled={busyId === item.id} onClick={() => void retryEmail(item)}>
                      Retry notification
                    </button>
                  ) : null}
                  <p className="w-full text-xs faint">Application {item.id}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
