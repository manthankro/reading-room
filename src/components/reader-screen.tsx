import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft, Lamp, Moon, PenLine, Sun, X } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { getWork, readingMinutes } from "@/lib/library";
import {
  formatMinutes,
  useReadingStore,
  type Leading,
  type Light,
  type Measure,
  type Size,
} from "@/lib/reading-store";

type Anchor = { text: string; top: number; left: number };

const lights: { value: Light; label: string; icon: typeof Lamp }[] = [
  { value: "lamp", label: "Lamp", icon: Lamp },
  { value: "day", label: "Day", icon: Sun },
  { value: "night", label: "Night", icon: Moon },
];

const sizes: { value: Size; label: string }[] = [
  { value: 0, label: "Small" },
  { value: 1, label: "Regular" },
  { value: 2, label: "Large" },
  { value: 3, label: "Largest" },
];

const measures: { value: Measure; label: string }[] = [
  { value: "narrow", label: "Narrow" },
  { value: "comfort", label: "Comfort" },
  { value: "wide", label: "Wide" },
];

const leadings: { value: Leading; label: string }[] = [
  { value: "snug", label: "Snug" },
  { value: "open", label: "Open" },
];

export function ReaderScreen({ slug }: { slug: string }) {
  const work = getWork(slug);
  const hydrated = useReadingStore((state) => state.hydrated);
  const place = useReadingStore((state) => state.places[slug]);
  const allNotes = useReadingStore((state) => state.notes);
  const notes = useMemo(
    () => allNotes.filter((note) => note.slug === slug),
    [allNotes, slug],
  );
  const seconds = useReadingStore((state) => state.seconds[slug] ?? 0);
  const light = useReadingStore((state) => state.light);
  const size = useReadingStore((state) => state.size);
  const measure = useReadingStore((state) => state.measure);
  const leading = useReadingStore((state) => state.leading);
  const focus = useReadingStore((state) => state.focus);
  const setPlace = useReadingStore((state) => state.setPlace);
  const addSeconds = useReadingStore((state) => state.addSeconds);
  const addNote = useReadingStore((state) => state.addNote);
  const removeNote = useReadingStore((state) => state.removeNote);
  const setLight = useReadingStore((state) => state.setLight);
  const setSize = useReadingStore((state) => state.setSize);
  const setMeasure = useReadingStore((state) => state.setMeasure);
  const setLeading = useReadingStore((state) => state.setLeading);
  const setFocus = useReadingStore((state) => state.setFocus);

  const [typeOpen, setTypeOpen] = useState(false);
  const [notesOn, setNotesOn] = useState(false);
  const [notesClosing, setNotesClosing] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [draft, setDraft] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const armed = useRef(false);

  useEffect(() => {
    if (!work || !hydrated) return;
    armed.current = false;
    const saved = useReadingStore.getState().places[slug];
    if (saved && saved.index > 0) {
      document.getElementById(`p-${saved.index}`)?.scrollIntoView({ block: "start" });
    } else {
      window.scrollTo(0, 0);
    }
    const timer = window.setTimeout(() => {
      armed.current = true;
    }, 450);
    return () => {
      armed.current = false;
      window.clearTimeout(timer);
    };
  }, [hydrated, slug, work]);

  useEffect(() => {
    if (!work) return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-readable] [data-p]"));
    if (nodes.length === 0) return;
    const last = nodes.length - 1;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!armed.current) return;
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.p);
        if (Number.isNaN(index)) return;
        const current = useReadingStore.getState().places[slug];
        const finished =
          Boolean(current?.finished) || (last > 0 && index >= last && index > 0);
        if (!current && index === 0 && !finished) return;
        if (current && current.index === index && current.finished === finished) return;
        const ratio = last === 0 ? 1 : index / last;
        setPlace(slug, { index, ratio, finished });
      },
      { rootMargin: "-18% 0px -55% 0px", threshold: [0.25, 0.6] },
    );
    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [setPlace, slug, work]);

  useEffect(() => {
    if (!work) return;
    let accrued = 0;
    const flush = () => {
      if (accrued <= 0) return;
      addSeconds(slug, accrued);
      accrued = 0;
    };
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      accrued += 1;
      if (accrued >= 15) flush();
    }, 1000);
    window.addEventListener("pagehide", flush);
    return () => {
      flush();
      window.clearInterval(timer);
      window.removeEventListener("pagehide", flush);
    };
  }, [addSeconds, slug, work]);

  useEffect(() => {
    const onSelect = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setAnchor(null);
        return;
      }
      const text = selection.toString().replace(/\s+/g, " ").trim();
      if (text.length < 8 || text.length > 320) {
        setAnchor(null);
        return;
      }
      const node = selection.anchorNode;
      const element = node instanceof Element ? node : node?.parentElement;
      if (!element?.closest("[data-readable]")) {
        setAnchor(null);
        return;
      }
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setAnchor(null);
        return;
      }
      setAnchor({
        text,
        top: Math.min(window.innerHeight - 64, Math.max(8, rect.bottom + 8)),
        left: Math.min(window.innerWidth - 168, Math.max(12, rect.left)),
      });
    };
    document.addEventListener("selectionchange", onSelect);
    return () => document.removeEventListener("selectionchange", onSelect);
  }, []);

  if (!work) {
    return (
      <div className="shell" data-light="lamp">
        <main className="mx-auto max-w-xl px-6 py-24">
          <h1 className="font-reading text-3xl">Not on this shelf</h1>
          <p className="mt-3 muted">That volume isn’t in the room.</p>
          <Link to="/" className="btn btn-solid mt-8">
            Back to the shelf
          </Link>
        </main>
      </div>
    );
  }

  const ratio = place?.finished ? 1 : (place?.ratio ?? 0);
  const percent = Math.round(ratio * 100);
  const remaining = Math.max(1, Math.round(readingMinutes(work) * (1 - ratio)));
  const poem = work.shelf === "poem";

  function openNotes(quote?: string) {
    setNotesClosing(false);
    setNotesOn(true);
    if (quote) {
      setDraft(quote);
      setDraftBody("");
    }
  }

  function closeNotes() {
    setNotesClosing(true);
    window.setTimeout(() => {
      setNotesOn(false);
      setNotesClosing(false);
    }, 150);
  }

  function saveNote() {
    const quote = draft.trim();
    const body = draftBody.trim();
    if (!quote || !body) return;
    addNote({ slug, quote, body });
    setDraft("");
    setDraftBody("");
  }

  return (
    <div className="shell" data-light={light}>
      <header className="bar sticky top-0 z-30 border-b hairline">
        {focus ? (
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeft className="size-4" aria-hidden />
              Shelf
            </Link>
            <button type="button" className="btn btn-quiet" onClick={() => setFocus(false)}>
              Exit focus
            </button>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl items-center gap-1 px-3 py-2 sm:px-4">
            <Link to="/" className="btn btn-ghost shrink-0">
              <ArrowLeft className="size-4" aria-hidden />
              Shelf
            </Link>
            <p className="min-w-0 flex-1 truncate text-center font-reading text-lg">{work.title}</p>
            <button
              type="button"
              className="btn btn-quiet shrink-0 px-3"
              aria-expanded={typeOpen}
              onClick={() => setTypeOpen((open) => !open)}
            >
              Type
            </button>
            <button
              type="button"
              className="btn btn-quiet shrink-0 px-3"
              aria-label={notes.length > 0 ? `Notes, ${notes.length}` : "Notes"}
              onClick={() => openNotes()}
            >
              <PenLine className="size-4" aria-hidden />
              {notes.length > 0 ? <span className="tabular-nums">{notes.length}</span> : null}
            </button>
          </div>
        )}
        <div className={typeOpen && !focus ? "settings open" : "settings"}>
          <div className="settings-inner">
            <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pt-1 pb-4">
              <Segment
                label="Light"
                value={light}
                options={lights.map((item) => ({
                  value: item.value,
                  label: <LightLabel item={item} />,
                }))}
                onChange={setLight}
              />
              <Segment label="Size" value={size} options={sizes} onChange={setSize} />
              <Segment label="Measure" value={measure} options={measures} onChange={setMeasure} />
              <Segment label="Leading" value={leading} options={leadings} onChange={setLeading} />
              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn btn-quiet"
                  onClick={() => {
                    setFocus(true);
                    setTypeOpen(false);
                  }}
                >
                  Focus the page
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="track" aria-hidden>
          <span style={{ width: `${percent}%` }} />
        </div>
      </header>

      <article className="paper sheet mx-auto mt-6 mb-16 px-5 py-10 sm:px-10 md:mt-10 md:px-14 md:py-16">
        <header className={poem ? "measure-narrow mx-auto" : "measure-comfort mx-auto"}>
          <p className="kicker sub">{work.author}</p>
          <h1 className="mt-3 font-reading text-4xl leading-tight">{work.title}</h1>
          <p className="sub mt-3 text-sm">
            {work.year} · {readingMinutes(work)} min
            {seconds >= 30 ? ` · ${formatMinutes(seconds)} with you` : ""}
            {place ? ` · ${place.finished ? "finished" : `${remaining} min left`}` : ""}
          </p>
        </header>

        <div
          data-readable
          className={`mx-auto mt-10 font-reading ${poem ? "poem" : "prose"} measure-${measure} size-${size} lead-${leading}`}
        >
          {work.paragraphs.map((paragraph, index) => (
            <p id={`p-${index}`} data-p={index} key={`${work.slug}-${index}`}>
              {paragraph}
            </p>
          ))}
        </div>

        <footer className={`mx-auto mt-12 border-t pt-6 hairline ${poem ? "measure-narrow" : "measure-comfort"}`}>
          <p className="kicker sub">End</p>
          <p className="sub mt-3 text-sm">Public domain.</p>
          {!place?.finished ? (
            <button
              type="button"
              className="btn btn-solid mt-6"
              onClick={() =>
                setPlace(slug, {
                  index: Math.max(0, work.paragraphs.length - 1),
                  ratio: 1,
                  finished: true,
                })
              }
            >
              Mark as read
            </button>
          ) : (
            <p className="mt-6 text-sm">Marked as read.</p>
          )}
        </footer>
      </article>

      {anchor ? (
        <button
          type="button"
          className="btn btn-solid keep-line"
          style={{ top: anchor.top, left: anchor.left }}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            openNotes(anchor.text);
            setAnchor(null);
            window.getSelection()?.removeAllRanges();
          }}
        >
          Keep this line
        </button>
      ) : null}

      {notesOn ? (
        <div className="fixed inset-0 z-40 flex justify-end">
          <button type="button" className="backdrop absolute inset-0" aria-label="Close notes" onClick={closeNotes} />
          <aside className={notesClosing ? "panel closing relative flex flex-col" : "panel relative flex flex-col"} aria-label="Marginal notes">
            <div className="flex items-center justify-between border-b hairline px-5 py-4">
              <h2 className="font-reading text-2xl">Notes</h2>
              <button type="button" className="btn btn-ghost" onClick={closeNotes} aria-label="Close notes">
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {draft ? (
                <form
                  className="mb-8"
                  onSubmit={(event) => {
                    event.preventDefault();
                    saveNote();
                  }}
                >
                  <blockquote className="quote">{draft}</blockquote>
                  <label className="mt-4 block">
                    <span className="kicker">Margin</span>
                    <textarea
                      className="note-box mt-2"
                      value={draftBody}
                      onChange={(event) => setDraftBody(event.target.value)}
                      placeholder="What you want to remember"
                      autoFocus
                    />
                  </label>
                  <div className="mt-3 flex gap-2">
                    <button type="submit" className="btn btn-solid" disabled={!draftBody.trim()}>
                      Save note
                    </button>
                    <button
                      type="button"
                      className="btn btn-quiet"
                      onClick={() => {
                        setDraft("");
                        setDraftBody("");
                      }}
                    >
                      Discard
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mb-8 text-sm muted">Select a line in the text, then keep it here.</p>
              )}

              {notes.length === 0 ? (
                <p className="font-reading text-lg">No notes in this volume yet.</p>
              ) : (
                <ul className="flex flex-col gap-5">
                  {notes.map((note) => (
                    <li key={note.id} className="border-b hairline pb-5">
                      <blockquote className="quote">{note.quote}</blockquote>
                      <p className="mt-3 font-reading text-lg leading-snug">{note.body}</p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-sm tabular-nums muted">{format(note.createdAt, "d MMM yyyy")}</p>
                        <button type="button" className="btn btn-ghost" onClick={() => removeNote(note.id)}>
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function LightLabel({ item }: { item: (typeof lights)[number] }) {
  const Icon = item.icon;
  return (
    <span className="inline-flex items-center gap-2">
      <Icon className="size-4" aria-hidden />
      {item.label}
    </span>
  );
}

function Segment<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: ReactNode }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="kicker">{label}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            className="chip"
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
