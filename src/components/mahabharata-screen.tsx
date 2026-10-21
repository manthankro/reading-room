import { Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { StoryArtwork } from "@/components/story-artwork";
import { mahabharataWorks } from "@/lib/works-mahabharata";
import { readingMinutes, wordCount } from "@/lib/library";

export function MahabharataScreen() {
  return (
    <div className="shell min-h-screen">
      <header className="site-masthead-wrap px-4 sm:px-6 md:px-8">
        <div className="site-masthead mx-auto flex w-full max-w-[90rem] items-center justify-between gap-4 py-4 sm:py-5">
          <Link to="/" className="brand-lockup no-underline" aria-label="Pramanix Shelf home">
            <span className="brand-mark" aria-hidden="true">
              <BookOpen className="size-5" />
            </span>
            <span className="brand-copy">
              <span className="brand-name">Pramanix Shelf</span>
              <span className="brand-caption">A reading room for everyone</span>
            </span>
          </Link>
          <nav className="masthead-nav flex items-center gap-4" aria-label="Main navigation">
            <Link to="/" className="text-sm">
              Library
            </Link>
            <Link to="/writers" className="text-sm">
              For writers
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[90rem] px-4 py-7 sm:px-6 md:px-8 md:py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm muted no-underline">
          <ArrowLeft className="size-4" aria-hidden /> Back to the library
        </Link>
        <section className="mt-6 grid items-center gap-6 rounded-2xl border p-5 sm:p-8 md:grid-cols-[minmax(0,1.3fr)_minmax(13rem,.7fr)]">
          <div>
            <p className="kicker">A dedicated epic shelf · 18 parvas</p>
            <h1 className="mt-3 max-w-3xl font-reading text-4xl leading-tight sm:text-5xl">
              The Mahabharata
            </h1>
            <p className="mt-4 max-w-3xl font-reading text-xl leading-relaxed muted">
              Follow the whole arc: a family’s beginnings, the dice game, exile, the war at
              Kurukshetra, its cost, the work of peace, and the final journey. Each parva has its
              own substantial chapter, so you can read in order or return to a place in the story.
            </p>
            <p className="mt-4 text-sm muted">
              Original English prose retelling · 18 chapters · No one-minute teaser entries
            </p>
          </div>
          <div className="mx-auto w-48 max-w-full md:w-56">
            <StoryArtwork work={mahabharataWorks[0]} />
          </div>
        </section>
        <section className="mt-9" aria-labelledby="parvas-title">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="kicker">Read the complete journey</p>
              <h2 id="parvas-title" className="mt-1 font-reading text-3xl">
                The 18 parvas
              </h2>
            </div>
            <span className="text-sm muted">Begin at the start, or choose any chapter</span>
          </div>
          <ol className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {mahabharataWorks.map((chapter, index) => (
              <li key={chapter.slug}>
                <Link
                  to="/read/$slug"
                  params={{ slug: chapter.slug }}
                  className="collection-card group flex h-full items-center gap-4 p-4 no-underline"
                >
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border font-reading text-lg"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-reading text-lg leading-snug">
                      {chapter.title.split(" — ")[1]}
                    </span>
                    <span className="mt-1 block text-sm muted">
                      {readingMinutes(chapter)} min · {wordCount(chapter)} words
                    </span>
                  </span>
                  <ChevronRight
                    className="size-4 shrink-0 muted transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ol>
        </section>
        <p className="mt-9 max-w-3xl border-t pt-5 text-sm leading-relaxed muted">
          This is an original prose retelling, not a verse-by-verse translation. The current
          complete chapter text is in English; regional-language editions are not included yet.
        </p>
      </main>
    </div>
  );
}
