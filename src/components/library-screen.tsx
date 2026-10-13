import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  excerpt,
  getWork,
  openingLine,
  readingMinutes,
  shelfLabel,
  shelfOrder,
  shelfSequence,
} from "@/lib/library";
import { formatMinutes, totalSeconds, useReadingStore } from "@/lib/reading-store";
import { works, type Shelf } from "@/lib/works";

export function LibraryScreen() {
  const [query, setQuery] = useState("");
  const [shelf, setShelf] = useState<Shelf | "all">("all");
  const hydrated = useReadingStore((state) => state.hydrated);
  const places = useReadingStore((state) => state.places);
  const notes = useReadingStore((state) => state.notes);
  const seconds = useReadingStore((state) => state.seconds);

  const minuteCount = hydrated ? Math.round(totalSeconds(seconds) / 60) : 0;
  const finishedCount = Object.values(places).filter((place) => place.finished).length;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return works.filter((work) => {
      if (shelf !== "all" && work.shelf !== shelf) return false;
      if (!needle) return true;
      const blob = `${work.title} ${work.author} ${work.year} ${openingLine(work)}`.toLowerCase();
      return blob.includes(needle);
    });
  }, [query, shelf]);

  const resume = useMemo(() => {
    if (!hydrated) return undefined;
    const latest = Object.entries(places)
      .map(([slug, place]) => ({ slug, place, work: getWork(slug) }))
      .filter((entry) => entry.work)
      .sort((a, b) => b.place.updatedAt - a.place.updatedAt)[0];
    return latest?.work ? latest : undefined;
  }, [hydrated, places]);

  const showResume = Boolean(resume && shelf === "all" && query.trim() === "");

  return (
    <div className="shell" data-light="lamp">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-8 md:grid-cols-[17rem_minmax(0,1fr)] md:gap-16 md:px-8 md:py-12">
        <aside className="md:sticky md:top-10 md:self-start">
          <p className="kicker">Private shelf</p>
          <h1 className="mt-3 font-reading text-4xl leading-none tracking-tight">Reading Room</h1>
          <p className="mt-4 max-w-sm font-reading text-lg leading-snug">
            Sit down with a finished text. Your place in it stays on this device.
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-3 border-t hairline pt-5">
            <div>
              <dt className="kicker">Minutes</dt>
              <dd className="mt-2 font-reading text-2xl tabular-nums leading-none">{minuteCount}</dd>
            </div>
            <div>
              <dt className="kicker">Finished</dt>
              <dd className="mt-2 font-reading text-2xl tabular-nums leading-none">{hydrated ? finishedCount : 0}</dd>
            </div>
            <div>
              <dt className="kicker">Notes</dt>
              <dd className="mt-2 font-reading text-2xl tabular-nums leading-none">{hydrated ? notes.length : 0}</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm muted">
            {works.length} volumes. Nothing you read here is sent anywhere.
          </p>
        </aside>

        <main>
          <label className="relative block">
            <span className="sr-only">Search the shelf</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 faint" aria-hidden />
            <input
              className="field"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles, authors, first lines"
              type="search"
              suppressHydrationWarning
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Shelves">
            {shelfOrder.map((item) => (
              <button
                key={item.id}
                type="button"
                className="chip"
                aria-pressed={shelf === item.id}
                onClick={() => setShelf(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {showResume && resume?.work ? (
            <Link
              to="/read/$slug"
              params={{ slug: resume.work.slug }}
              className="elev mt-8 block rounded-xl border hairline p-5 no-underline md:p-6"
            >
              <p className="kicker">{resume.place.finished ? "Read again" : "Continue"}</p>
              <h2 className="mt-2 font-reading text-2xl leading-tight">{resume.work.title}</h2>
              <p className="mt-1 text-sm muted">
                {resume.work.author}
                {resume.place.finished ? "" : ` · ${Math.round(resume.place.ratio * 100)}%`}
              </p>
              <p className="mt-3 line-clamp-3 font-reading text-lg leading-snug italic muted">
                {excerpt(resume.work.paragraphs[resume.place.index] ?? openingLine(resume.work), 180)}
              </p>
              <p className="mt-4 text-sm font-medium underline decoration-1 underline-offset-4">
                {resume.place.finished ? "Open the volume" : "Return to your place"}
              </p>
            </Link>
          ) : null}

          {filtered.length === 0 ? (
            <p className="mt-12 font-reading text-xl">Nothing on the shelf matches.</p>
          ) : (
            shelfSequence.map((id) => {
              const group = filtered.filter((work) => work.shelf === id);
              if (group.length === 0) return null;
              return (
                <section key={id} className="mt-10">
                  <h2 className="kicker">{shelfLabel[id]}</h2>
                  <ul className="mt-2">
                    {group.map((work) => {
                      const place = hydrated ? places[work.slug] : undefined;
                      const spent = hydrated ? (seconds[work.slug] ?? 0) : 0;
                      const status = place?.finished
                        ? "Finished"
                        : place && place.ratio > 0.02
                          ? `${Math.round(place.ratio * 100)}%`
                          : "Unread";
                      return (
                        <li key={work.slug}>
                          <Link to="/read/$slug" params={{ slug: work.slug }} className="row rounded-sm">
                            <div className="flex items-baseline justify-between gap-4">
                              <h3 className="font-reading text-xl leading-snug">{work.title}</h3>
                              <span className="shrink-0 text-sm tabular-nums muted">{status}</span>
                            </div>
                            <p className="mt-1 text-sm muted">
                              {work.author} · {work.year} · {readingMinutes(work)} min
                              {spent >= 60 ? ` · ${formatMinutes(spent)} with you` : ""}
                            </p>
                            <p className="mt-2 line-clamp-2 font-reading leading-snug italic muted">
                              {excerpt(openingLine(work))}
                            </p>
                            {place && !place.finished && place.ratio > 0.02 ? (
                              <div className="track mt-3" aria-hidden>
                                <span style={{ width: `${Math.round(place.ratio * 100)}%` }} />
                              </div>
                            ) : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })
          )}
        </main>
      </div>
    </div>
  );
}
