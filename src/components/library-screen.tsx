import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowDown, BookOpen, LayoutGrid, List, Search, Shuffle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { UserButton } from "@/lib/auth/gates";
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
import { formatMinutes, totalSeconds, useReadingStore } from "@/lib/reading-store";
import { type Shelf } from "@/lib/works";
import { StoryArtwork } from "@/components/story-artwork";
import { languageTagFor } from "@/lib/language";
import { feedbackHref } from "@/lib/feedback";

export function LibraryScreen() {
  const [query, setQuery] = useState("");
  const [shelf, setShelf] = useState<Shelf | "all">("all");
  const [genre, setGenre] = useState("all");
  const [period, setPeriod] = useState("all");
  const [author, setAuthor] = useState("all");
  const [time, setTime] = useState("all");
  const [language, setLanguage] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(24);
  const [sort, setSort] = useState("title");
  const [collectionId, setCollectionId] = useState("");
  const [genreMood, setGenreMood] = useState("");
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
  const languages = useMemo(
    () => [...new Set(catalogue.map((work) => work.language ?? "English"))].sort(),
    [],
  );

  const filtered = useMemo(() => {
    let result = catalogue.filter((work) => {
      if (genreMood) {
        const searchable =
          `${work.title} ${work.author} ${(work.genres ?? []).join(" ")}`.toLocaleLowerCase();
        const matchesMood =
          (genreMood === "mystery" &&
            /horror|thriller|gothic|mystery|ghost|haunt|secret|shadow/.test(searchable)) ||
          (genreMood === "myth" &&
            /mythology|myth|persephone|orpheus|prometheus|odin|isis|rama|osiris|gods|goddess|adventure/.test(
              searchable,
            )) ||
          (genreMood === "romance" &&
            /love story|romance|heart|love|magi|marriage|belong/.test(searchable)) ||
          (genreMood === "quiet" &&
            (work.shelf === "poem" ||
              work.shelf === "essay" ||
              work.shelf === "letter" ||
              /psychological|health|drama/.test(searchable))) ||
          (genreMood === "wonder" &&
            /adventure|comics|mythology|fantasy|science|journey/.test(searchable));
        if (!matchesMood) return false;
      }
      if (shelf !== "all" && work.shelf !== shelf) return false;
      if (language !== "all" && (work.language ?? "English") !== language) return false;
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
  }, [author, collectionId, genre, genreMood, language, period, query, shelf, sort, time]);

  useEffect(() => {
    setVisibleCount(24);
  }, [query, shelf, genre, period, author, time, language, sort, collectionId, genreMood]);

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
    language === "all" &&
    !collectionId &&
    !genreMood,
  );

  return (
    <div className="shell" data-light="lamp">
      <div className="site-masthead-wrap px-4 sm:px-6 md:px-8">
        <header className="site-masthead mx-auto flex w-full max-w-[100rem] items-center justify-between gap-4 py-4 sm:py-5">
          <Link
            to="/"
            className="brand-lockup no-underline"
            aria-label="Pramanix Shelf, Reading Room home"
          >
            <span className="brand-mark" aria-hidden="true">
              <BookOpen className="size-5" />
            </span>
            <span className="brand-copy">
              <span className="brand-name">Pramanix Shelf</span>
              <span className="brand-caption">A reading room for everyone</span>
            </span>
          </Link>
          <nav
            className="masthead-nav hidden items-center gap-6 lg:flex"
            aria-label="Main navigation"
          >
            <a href="#collection">Explore the library</a>
            <Link to="/writers">For writers</Link>
            <a href="/mahabharata">Mahabharata</a>
          </nav>
          <div className="masthead-account">
            <Link
              to="/login"
              className="btn btn-ghost masthead-account-link"
              title="Sign in to sync your shelf"
            >
              Sign in <span className="hidden sm:inline">to sync</span>
            </Link>
            <UserButton />
          </div>
        </header>
      </div>
      <div className="mx-auto grid w-full max-w-[90rem] gap-6 px-4 py-6 sm:px-6 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8 md:px-8 md:py-10 xl:grid-cols-[17rem_minmax(0,1fr)] 2xl:gap-12">
        <main className="library-main min-w-0 md:col-start-2 md:row-start-1">
          {workOfDay ? (
            <section className="home-hero mb-7" aria-labelledby="welcome-heading">
              <div className="home-hero-copy">
                <p className="kicker">
                  A little room for wonder{" "}
                  <span className="hero-spark" aria-hidden="true">
                    ✳
                  </span>
                </p>
                <h1 id="welcome-heading" className="mt-4 font-reading">
                  Leave the noise.
                  <br />
                  <em>Enter a story.</em>
                </h1>
                <p className="hero-intro">
                  Good stories, gathered from many places and told in many voices. Take your time.
                  The next one is waiting.
                </p>
                <div className="hero-actions">
                  <Link
                    to="/read/$slug"
                    params={{ slug: workOfDay.slug }}
                    className="btn btn-solid hero-read-button"
                  >
                    Read today’s story <span aria-hidden="true">↗</span>
                  </Link>
                  <a href="#collection" className="hero-browse-link">
                    Browse the library <ArrowDown className="size-4" aria-hidden />
                  </a>
                  <a href="/mahabharata" className="hero-browse-link">
                    Read the Mahabharata <span aria-hidden="true">↗</span>
                  </a>
                </div>
                <p className="hero-feature-meta">
                  <span className="hero-live-dot" /> Today’s pick <span aria-hidden="true">·</span>{" "}
                  {workOfDay.language ?? "English"} <span aria-hidden="true">·</span>{" "}
                  {readingMinutes(workOfDay)} min
                </p>
              </div>
              <Link
                to="/read/$slug"
                params={{ slug: workOfDay.slug }}
                className="hero-art-link no-underline"
                aria-label={`Read ${workOfDay.title} by ${workOfDay.author}`}
              >
                <div className="hero-art-backdrop" aria-hidden="true" />
                {catalogue[(catalogue.indexOf(workOfDay) + 7) % catalogue.length] ? (
                  <div className="hero-stack hero-stack-back" aria-hidden="true">
                    <StoryArtwork
                      work={catalogue[(catalogue.indexOf(workOfDay) + 7) % catalogue.length]}
                    />
                  </div>
                ) : null}
                {catalogue[(catalogue.indexOf(workOfDay) + 19) % catalogue.length] ? (
                  <div className="hero-stack hero-stack-mid" aria-hidden="true">
                    <StoryArtwork
                      work={catalogue[(catalogue.indexOf(workOfDay) + 19) % catalogue.length]}
                    />
                  </div>
                ) : null}
                <div className="hero-feature-cover">
                  <StoryArtwork work={workOfDay} />
                </div>
                <div className="hero-cover-caption">
                  <span className="kicker">The daily escape</span>
                  <span className="hero-cover-title">{workOfDay.title}</span>
                  <span className="hero-cover-author">{workOfDay.author}</span>
                </div>
              </Link>
              <button
                type="button"
                className="hero-surprise"
                onClick={surpriseMe}
                aria-label="Surprise me with a story"
              >
                <Shuffle className="size-4" aria-hidden />
                <span>Surprise me</span>
              </button>
            </section>
          ) : (
            <header className="home-hero home-hero--empty mb-7">
              <div className="home-hero-copy">
                <p className="kicker">A reading room for everyone</p>
                <h1 className="mt-4 font-reading">
                  Leave the noise.
                  <br />
                  <em>Enter a story.</em>
                </h1>
                <p className="hero-intro">
                  A quieter corner of the internet. Browse freely, find a story in your language,
                  and take your time.
                </p>
              </div>
            </header>
          )}
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
                <h2 id="moods-heading" className="mt-1 font-reading text-2xl">
                  Browse by feeling
                </h2>
              </div>
              {genreMood ? (
                <button
                  type="button"
                  className="text-sm underline underline-offset-4"
                  onClick={() => setGenreMood("")}
                >
                  Clear mood
                </button>
              ) : null}
            </div>
            <div className="mood-grid mt-4">
              {[
                {
                  id: "mystery",
                  title: "Mystery & suspense",
                  note: "Shadows, secrets, and uneasy endings.",
                },
                {
                  id: "myth",
                  title: "Myths & wonder",
                  note: "Old worlds, impossible journeys, and brave choices.",
                },
                {
                  id: "romance",
                  title: "Matters of the heart",
                  note: "Love, longing, and unexpected kindness.",
                },
                {
                  id: "quiet",
                  title: "Quiet moments",
                  note: "Reflective essays, poems, and gentler pages.",
                },
                {
                  id: "wonder",
                  title: "Adventure & imagination",
                  note: "A door into another place.",
                },
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
                  <span className="mood-art" aria-hidden="true">
                    <StoryArtwork
                      work={
                        catalogue.find((work) => {
                          const words =
                            `${work.title} ${work.author} ${(work.genres ?? []).join(" ")}`.toLocaleLowerCase();
                          return mood.id === "mystery"
                            ? /horror|thriller|gothic|mystery|ghost|haunt|secret|shadow/.test(words)
                            : mood.id === "myth"
                              ? /mythology|myth|persephone|orpheus|prometheus|odin|isis|rama|osiris|gods|goddess|adventure/.test(
                                  words,
                                )
                              : mood.id === "romance"
                                ? /love story|romance|heart|love|magi|marriage|belong/.test(words)
                                : mood.id === "quiet"
                                  ? work.shelf === "poem" ||
                                    work.shelf === "essay" ||
                                    work.shelf === "letter" ||
                                    /psychological|health|drama/.test(words)
                                  : /adventure|comics|mythology|fantasy|science|journey/.test(
                                      words,
                                    );
                        }) ??
                        workOfDay ??
                        catalogue[0]
                      }
                    />
                  </span>
                  <span className="mood-card-copy">
                    <span className="font-reading text-lg">{mood.title}</span>
                    <span className="mt-1 block text-sm leading-snug muted">{mood.note}</span>
                  </span>
                  <span className="mood-card-arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>
              ))}
            </div>
          </section>

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
                  <span className="path-cover" aria-hidden="true">
                    <StoryArtwork work={catalogue.find(item.select) ?? workOfDay ?? catalogue[0]} />
                  </span>
                  <span className="path-copy">
                    <span className="font-reading text-lg">{item.title}</span>
                    <span className="mt-1 block text-sm leading-snug muted">{item.note}</span>
                  </span>
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
              label="Language"
              value={language}
              onChange={setLanguage}
              options={["all", ...languages]}
              labels={{ all: "Every language" }}
            />
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

          <div
            id="collection"
            className="mt-8 flex scroll-mt-8 flex-wrap items-center justify-between gap-3"
          >
            <p className="text-sm muted" aria-live="polite">
              Showing {Math.min(visibleCount, filtered.length)} of {filtered.length}{" "}
              {filtered.length === 1 ? "volume" : "volumes"}
              {query ? ` matching “${query}”` : " on the shelf"}
            </p>
            <div className="view-switch" role="group" aria-label="Story display">
              <button
                type="button"
                className={view === "grid" ? "view-switch-button active" : "view-switch-button"}
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
              >
                <LayoutGrid className="size-4" aria-hidden />
                <span>Cards</span>
              </button>
              <button
                type="button"
                className={view === "list" ? "view-switch-button active" : "view-switch-button"}
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
              >
                <List className="size-4" aria-hidden />
                <span>List</span>
              </button>
            </div>
          </div>
          {filtered.length === 0 ? (
            <p className="mt-8 font-reading text-xl">
              Nothing on the shelf matches. Try another spelling or loosen a filter.
            </p>
          ) : (
            shelfSequence.map((id) => {
              const group = filtered.slice(0, visibleCount).filter((work) => work.shelf === id);
              if (!group.length) return null;
              return (
                <section key={id} className="mt-8">
                  <h2 className="kicker">{shelfLabel[id]}</h2>
                  <ul className={`story-grid mt-4 ${view === "list" ? "story-grid--list" : ""}`}>
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
                            <div className="story-card-cover" lang={languageTagFor(work.language)}>
                              <StoryArtwork work={work} />
                              <span className="story-card-status">{status}</span>
                            </div>
                            <div className="story-card-body">
                              <p className="kicker">
                                {genreFor(work)} · {work.language ?? "English"} · {work.year}
                              </p>
                              <h3 className="mt-2 font-reading text-xl leading-snug">
                                {work.title}
                              </h3>
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
          {filtered.length > visibleCount ? (
            <div className="mt-8 flex flex-col items-center gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setVisibleCount((count) => count + 24)}
              >
                Show 24 more stories
              </button>
              <p className="text-xs muted">No rush. Read one story at a time.</p>
            </div>
          ) : null}
        </main>

        <aside className="library-sidebar md:col-start-1 md:row-start-1 md:sticky md:top-6 md:max-h-[calc(100dvh-3rem)] md:self-start md:overflow-y-auto md:pr-2">
          <p className="kicker">A library for taking your time</p>
          <h2 className="mt-3 font-reading text-3xl leading-tight tracking-tight">
            Find a page
            <br />
            that feels like yours.
          </h2>
          <p className="mt-4 max-w-sm font-reading text-lg leading-snug muted">
            Stories, poems, and wisdom from many places. Read freely, in the language that feels
            closest.
          </p>
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
          <p className="mt-5 text-sm muted">
            {catalogue.length} volumes · {notes.length} margin notes ·{" "}
            {formatMinutes(totalSeconds(seconds))} together
          </p>
          <Link
            to="/writers"
            className="mt-6 block rounded-xl border hairline elev p-4 no-underline transition hover:border-[var(--color-accent)]"
          >
            <span className="kicker">For writers</span>
            <span className="mt-2 block font-reading text-xl">Become a content writer</span>
            <span className="mt-1 block text-sm muted">
              Share stories, poems, and regional voices.
            </span>
          </Link>
          <a
            href={feedbackHref}
            className="mt-3 block rounded-xl border hairline elev p-4 no-underline transition hover:border-[var(--color-accent)]"
          >
            <span className="kicker">Help improve the Reading Room</span>
            <span className="mt-2 block font-reading text-xl">Share feedback</span>
            <span className="mt-1 block text-sm muted">
              Tell us what you enjoy or what could work better.
            </span>
          </a>
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
