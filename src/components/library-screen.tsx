import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Download, Search, Shuffle, Sparkles, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import {
  catalogue,
  collections,
  excerpt,
  genreFor,
  getWork,
  matchesSearch,
  openingLine,
  periodFor,
  readingMinutes,
  shelfLabel,
  shelfOrder,
  shelfSequence,
} from "@/lib/library";
import {
  formatMinutes,
  getReadingSnapshot,
  totalSeconds,
  useReadingStore,
  type ReadingSnapshot,
} from "@/lib/reading-store";
import { type Shelf } from "@/lib/works";
import { StoryArtwork } from "@/components/story-artwork";

function isSnapshot(value: unknown): value is ReadingSnapshot {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<ReadingSnapshot>;
  return (
    !!data.places &&
    typeof data.places === "object" &&
    Array.isArray(data.notes) &&
    Array.isArray(data.bookmarks) &&
    Array.isArray(data.highlights) &&
    !!data.seconds &&
    typeof data.seconds === "object" &&
    !!data.dailySeconds &&
    typeof data.dailySeconds === "object" &&
    typeof data.goalMinutes === "number"
  );
}

export function LibraryScreen() {
  const [query, setQuery] = useState("");
  const [shelf, setShelf] = useState<Shelf | "all">("all");
  const [genre, setGenre] = useState("all");
  const [period, setPeriod] = useState("all");
  const [author, setAuthor] = useState("all");
  const [time, setTime] = useState("all");
  const [sort, setSort] = useState("title");
  const [collectionId, setCollectionId] = useState("");
  const [genreMood, setGenreMood] = useState("");
  const [message, setMessage] = useState("");
  const importRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const workOfDay = useMemo(() => {
    if (!catalogue.length) return undefined;
    const day = Math.floor(Date.now() / 86_400_000);
    return catalogue[day % catalogue.length];
  }, []);

  function surpriseMe() {
    if (!catalogue.length) return;
    const pick = catalogue[Math.floor(Math.random() * catalogue.length)];
    void navigate({ to: "/read/$slug", params: { slug: pick.slug } });
  }
  const hydrated = useReadingStore((state) => state.hydrated);
  const places = useReadingStore((state) => state.places);
  const notes = useReadingStore((state) => state.notes);
  const seconds = useReadingStore((state) => state.seconds);
  const dailySeconds = useReadingStore((state) => state.dailySeconds);
  const bookmarks = useReadingStore((state) => state.bookmarks);
  const highlights = useReadingStore((state) => state.highlights);
  const goalMinutes = useReadingStore((state) => state.goalMinutes);
  const setGoalMinutes = useReadingStore((state) => state.setGoalMinutes);

  const minuteCount = hydrated ? Math.round(totalSeconds(seconds) / 60) : 0;
  const finishedCount = Object.values(places).filter((place) => place.finished).length;
  const todaySeconds = hydrated ? (dailySeconds[new Date().toISOString().slice(0, 10)] ?? 0) : 0;
  const todayMinutes = Math.floor(todaySeconds / 60);
  const genres = useMemo(() => [...new Set(catalogue.map(genreFor))].sort(), []);
  const authors = useMemo(() => [...new Set(catalogue.map((work) => work.author))].sort(), []);

  const filtered = useMemo(() => {
    let result = catalogue.filter((work) => {
      if (genreMood) {
        const searchable = `${work.title} ${work.author} ${(work.genres ?? []).join(" ")}`.toLocaleLowerCase();
        const matchesMood =
          (genreMood === "mystery" && /horror|thriller|gothic|mystery|ghost|haunt|secret|shadow/.test(searchable)) ||
          (genreMood === "myth" && /mythology|myth|persephone|orpheus|prometheus|odin|isis|rama|osiris|gods|goddess|adventure/.test(searchable)) ||
          (genreMood === "romance" && /love story|romance|heart|love|magi|marriage|belong/.test(searchable)) ||
          (genreMood === "quiet" && (work.shelf === "poem" || work.shelf === "essay" || work.shelf === "letter" || /psychological|health|drama/.test(searchable))) ||
          (genreMood === "wonder" && /adventure|comics|mythology|fantasy|science|journey/.test(searchable));
        if (!matchesMood) return false;
      }
      if (shelf !== "all" && work.shelf !== shelf) return false;
      if (genre !== "all" && genreFor(work) !== genre) return false;
      if (period !== "all" && periodFor(work.year) !== period) return false;
      if (author !== "all" && work.author !== author) return false;
      if (time === "short" && readingMinutes(work) > 5) return false;
      if (time === "medium" && (readingMinutes(work) < 6 || readingMinutes(work) > 15))
        return false;
      if (time === "long" && readingMinutes(work) < 16) return false;
      if (collectionId && !collections.find((item) => item.id === collectionId)?.select(work))
        return false;
      return matchesSearch(work, query);
    });
    result = [...result].sort((a, b) =>
      sort === "short"
        ? readingMinutes(a) - readingMinutes(b)
        : sort === "author"
          ? a.author.localeCompare(b.author) || a.title.localeCompare(b.title)
          : sort === "oldest"
            ? a.year - b.year
            : a.title.localeCompare(b.title),
    );
    return result;
  }, [author, collectionId, genre, genreMood, period, query, shelf, sort, time]);

  const resume = useMemo(() => {
    if (!hydrated) return undefined;
    const latest = Object.entries(places)
      .map(([slug, place]) => ({ slug, place, work: getWork(slug) }))
      .filter((entry) => entry.work)
      .sort((a, b) => b.place.updatedAt - a.place.updatedAt)[0];
    return latest?.work ? latest : undefined;
  }, [hydrated, places]);
  const showResume = Boolean(
    resume &&
      shelf === "all" &&
      !query.trim() &&
      genre === "all" &&
      period === "all" &&
      author === "all" &&
      time === "all" &&
      !collectionId &&
      !genreMood,
  );

  function exportShelf() {
    const payload = {
      app: "reading-room",
      version: 1,
      exportedAt: new Date().toISOString(),
      snapshot: getReadingSnapshot(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reading-room-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Your shelf backup is ready.");
  }

  async function importShelf(file?: File) {
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      const payload = parsed as { app?: string; snapshot?: unknown };
      if (payload.app !== "reading-room" || !isSnapshot(payload.snapshot))
        throw new Error("That file is not a Reading Room backup.");
      useReadingStore.getState().importSnapshot(payload.snapshot);
      setMessage("Shelf restored. Existing reading data was kept where it was newer.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not read that backup file.");
    } finally {
      if (importRef.current) importRef.current.value = "";
    }
  }

  return (
    <div className="shell" data-light="lamp">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-8 md:grid-cols-[17rem_minmax(0,1fr)] md:gap-16 md:px-8 md:py-12">
        <aside className="md:sticky md:top-10 md:self-start">
          <p className="kicker">Private shelf</p>
          <h1 className="mt-3 font-reading text-4xl leading-none tracking-tight">Reading Room</h1>
          <p className="mt-4 max-w-sm font-reading text-lg leading-snug">
            A quiet place for good writing. Keep your place on this device, or sign in to carry your
            shelf with you.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Link to="/login" className="btn btn-quiet">
                Sign in to sync
              </Link>
            </SignedOut>
            <span className="text-xs muted">Optional account</span>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-3 border-t hairline pt-5">
            <div>
              <dt className="kicker">Minutes</dt>
              <dd className="mt-2 font-reading text-2xl tabular-nums leading-none">
                {minuteCount}
              </dd>
            </div>
            <div>
              <dt className="kicker">Finished</dt>
              <dd className="mt-2 font-reading text-2xl tabular-nums leading-none">
                {hydrated ? finishedCount : 0}
              </dd>
            </div>
            <div>
              <dt className="kicker">Saved</dt>
              <dd className="mt-2 font-reading text-2xl tabular-nums leading-none">
                {hydrated ? bookmarks.length + highlights.length : 0}
              </dd>
            </div>
          </dl>
          <div className="mt-7 border-t hairline pt-5">
            <div className="flex items-center justify-between">
              <p className="kicker">Today’s reading goal</p>
              <label className="sr-only" htmlFor="goal-minutes">
                Daily goal in minutes
              </label>
              <select
                id="goal-minutes"
                className="select-field compact"
                value={goalMinutes}
                onChange={(event) => setGoalMinutes(Number(event.target.value))}
              >
                <option value={10}>10 min</option>
                <option value={20}>20 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
            </div>
            <div className="mt-4 flex items-baseline justify-between font-reading">
              <span className="text-2xl tabular-nums">
                {todayMinutes}
                <span className="text-base muted"> / {goalMinutes} min</span>
              </span>
              <span className="text-sm muted">
                {Math.min(100, Math.round((todayMinutes / goalMinutes) * 100))}%
              </span>
            </div>
            <div className="track mt-3">
              <span style={{ width: `${Math.min(100, (todayMinutes / goalMinutes) * 100)}%` }} />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" className="btn btn-quiet px-3" onClick={exportShelf}>
              <Download className="size-4" aria-hidden /> Backup
            </button>
            <button
              type="button"
              className="btn btn-quiet px-3"
              onClick={() => importRef.current?.click()}
            >
              <Upload className="size-4" aria-hidden /> Restore
            </button>
            <input
              ref={importRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(event) => void importShelf(event.currentTarget.files?.[0])}
            />
          </div>
          {message ? (
            <p role="status" className="mt-3 text-sm muted">
              {message}
            </p>
          ) : null}
          <p className="mt-5 text-sm muted">
            {catalogue.length} volumes · {notes.length} margin notes ·{" "}
            {formatMinutes(totalSeconds(seconds))} together
          </p>
          {bookmarks.length ? (
            <section className="mt-8 border-t hairline pt-5">
              <h2 className="kicker">Your bookmarks</h2>
              <ul className="mt-3 space-y-2">
                {bookmarks.slice(0, 5).map((bookmark) => {
                  const work = getWork(bookmark.slug);
                  return work ? (
                    <li key={bookmark.id}>
                      <Link
                        to="/read/$slug"
                        params={{ slug: work.slug }}
                        className="text-sm underline underline-offset-4"
                      >
                        {work.title} · page {bookmark.index + 1}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </section>
          ) : null}
        </aside>

        <main>
          <div className="relative">
            <label className="relative block">
              <span className="sr-only">Search titles, authors, and text</span>
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 faint"
                aria-hidden
              />
              <input
                className="field"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search titles, authors, first lines — typos are okay"
                type="search"
              />
            </label>
          </div>

          <section className="mt-8" aria-labelledby="moods-heading">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className="kicker">Find your next world</p>
                <h2 id="moods-heading" className="mt-1 font-reading text-2xl">Browse by feeling</h2>
              </div>
              {genreMood ? (
                <button type="button" className="text-sm underline underline-offset-4" onClick={() => setGenreMood("")}>
                  Clear mood
                </button>
              ) : null}
            </div>
            <div className="mood-grid mt-4">
              {[
                { id: "mystery", title: "Mystery & suspense", note: "Shadows, secrets, and uneasy endings.", art: "mystery" },
                { id: "myth", title: "Myths & wonder", note: "Old worlds, impossible journeys, and brave choices.", art: "myth" },
                { id: "romance", title: "Matters of the heart", note: "Love, longing, and unexpected kindness.", art: "romance" },
                { id: "quiet", title: "Quiet moments", note: "Reflective essays, poems, and gentler pages.", art: "quiet" },
                { id: "wonder", title: "Adventure & imagination", note: "A door into another place.", art: "nature" },
              ].map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  className={`mood-card ${genreMood === mood.id ? "is-selected" : ""}`}
                  aria-pressed={genreMood === mood.id}
                  onClick={() => {
                    setGenreMood(genreMood === mood.id ? "" : mood.id);
                    setCollectionId("");
                    setShelf("all");
                    setGenre("all");
                  }}
                >
                  <span className={`mood-art mood-art-${mood.art}`} aria-hidden="true">
                    <span className="mood-art-orbit" />
                    <span className="mood-art-core" />
                    <span className="mood-art-line" />
                  </span>
                  <span className="mood-card-copy">
                    <span className="font-reading text-lg">{mood.title}</span>
                    <span className="mt-1 block text-sm leading-snug muted">{mood.note}</span>
                  </span>
                  <span className="mood-card-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </section>

          {workOfDay ? (
            <section className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]" aria-label="Highlights">
              <Link
                to="/read/$slug"
                params={{ slug: workOfDay.slug }}
                className="feature-card daily-escape no-underline"
              >
                <div className="daily-escape-art"><StoryArtwork work={workOfDay} /></div>
                <div className="daily-escape-copy">
                  <p className="kicker flex items-center gap-2">
                    <Sparkles className="size-3.5" aria-hidden /> Daily Escape
                  </p>
                  <h2 className="mt-2 font-reading text-2xl leading-tight">{workOfDay.title}</h2>
                  <p className="mt-1 text-sm muted">
                    {workOfDay.author} · {genreFor(workOfDay)} · {readingMinutes(workOfDay)} min read
                  </p>
                  <p className="mt-3 line-clamp-3 font-reading text-lg leading-snug italic muted">
                    {excerpt(openingLine(workOfDay), 180)}
                  </p>
                  <span className="daily-escape-cta">Read today’s story <span aria-hidden="true">→</span></span>
                </div>
              </Link>
              <button
                type="button"
                className="btn btn-ghost surprise-btn h-auto min-h-[5.5rem] flex-col gap-2 px-5 py-4 sm:min-w-[9.5rem]"
                onClick={surpriseMe}
              >
                <Shuffle className="size-5" aria-hidden />
                <span className="text-sm font-medium">Surprise me</span>
              </button>
            </section>
          ) : null}

          <section className="mt-7" aria-labelledby="collections-heading">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="collections-heading" className="kicker">
                Reading paths
              </h2>
              {collectionId ? (
                <button
                  type="button"
                  className="text-sm underline underline-offset-4"
                  onClick={() => setCollectionId("")}
                >
                  Clear collection
                </button>
              ) : null}
            </div>
            <div className="path-grid mt-3 grid gap-3 sm:grid-cols-2">
              {collections.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`collection-card ${collectionId === item.id ? "selected" : ""}`}
                  aria-pressed={collectionId === item.id}
                  onClick={() => setCollectionId(collectionId === item.id ? "" : item.id)}
                >
                  <BookOpen className="size-4" aria-hidden />
                  <span className="mt-3 block font-reading text-lg">{item.title}</span>
                  <span className="mt-1 block text-sm leading-snug muted">{item.note}</span>
                </button>
              ))}
            </div>
          </section>
          <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Shelves">
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
          <section
            className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Filter and sort works"
          >
            <Filter label="Genre" value={genre} onChange={setGenre} options={["all", ...genres]} />
            <Filter
              label="Period"
              value={period}
              onChange={setPeriod}
              options={["all", "Before 1800", "1800s", "1900s", "2000s"]}
            />
            <Filter
              label="Author"
              value={author}
              onChange={setAuthor}
              options={["all", ...authors]}
            />
            <Filter
              label="Reading time"
              value={time}
              onChange={setTime}
              options={["all", "short", "medium", "long"]}
              labels={{
                all: "Any length",
                short: "Up to 5 min",
                medium: "6–15 min",
                long: "16+ min",
              }}
            />
            <Filter
              label="Sort by"
              value={sort}
              onChange={setSort}
              options={["title", "author", "oldest", "short"]}
              labels={{
                title: "Title A–Z",
                author: "Author",
                oldest: "Oldest first",
                short: "Shortest first",
              }}
            />
          </section>

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
                {excerpt(
                  resume.work.paragraphs[resume.place.index] ?? openingLine(resume.work),
                  180,
                )}
              </p>
              <p className="mt-4 text-sm font-medium underline decoration-1 underline-offset-4">
                {resume.place.finished ? "Open the volume" : "Return to your place"}
              </p>
            </Link>
          ) : null}

          <p className="mt-8 text-sm muted" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "volume" : "volumes"}
            {query ? ` matching “${query}”` : " on the shelf"}
          </p>
          {filtered.length === 0 ? (
            <p className="mt-8 font-reading text-xl">
              Nothing on the shelf matches. Try another spelling or loosen a filter.
            </p>
          ) : (
            shelfSequence.map((id) => {
              const group = filtered.filter((work) => work.shelf === id);
              if (!group.length) return null;
              return (
                <section key={id} className="mt-8">
                  <h2 className="kicker">{shelfLabel[id]}</h2>
                  <ul className="story-grid mt-4">
                    {group.map((work) => {
                      const place = hydrated ? places[work.slug] : undefined;
                      const status = place?.finished
                        ? "Finished"
                        : place && place.ratio > 0.02
                          ? `${Math.round(place.ratio * 100)}%`
                          : "Unread";
                      return (
                        <li key={work.slug}>
                          <Link
                            to="/read/$slug"
                            params={{ slug: work.slug }}
                            className="story-card no-underline"
                          >
                            <div className="story-card-cover">
                              <StoryArtwork work={work} />
                              <span className="story-card-status">{status}</span>
                            </div>
                            <div className="story-card-body">
                              <p className="kicker">{genreFor(work)} · {work.year}</p>
                              <h3 className="mt-2 font-reading text-xl leading-snug">{work.title}</h3>
                              <p className="mt-1 text-sm muted">{work.author}</p>
                              <p className="mt-3 line-clamp-3 font-reading leading-snug italic muted">
                                {excerpt(openingLine(work), 130)}
                              </p>
                              <p className="mt-4 text-xs muted">{readingMinutes(work)} min read</p>
                              {place && !place.finished && place.ratio > 0.02 ? (
                                <div className="track mt-3" aria-hidden>
                                  <span style={{ width: `${Math.round(place.ratio * 100)}%` }} />
                                </div>
                              ) : null}
                            </div>
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

function Filter({
  label,
  value,
  onChange,
  options,
  labels,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labels?: Record<string, string>;
}) {
  return (
    <label className="block">
      <span className="kicker">{label}</span>
      <select
        className="select-field mt-1 w-full"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels?.[option] ?? (option === "all" ? "All" : option)}
          </option>
        ))}
      </select>
    </label>
  );
}
