import { works, type Genre, type Shelf, type Work } from "./works.ts";
import { originalWorks } from "./works-original.ts";
import { wisdomWorks } from "./works-wisdom.ts";
import { mythWorks } from "./works-myths.ts";

/** Full shelf: classics + original fiction + wisdom + mythology. */
export const catalogue: Work[] = [
  ...works,
  ...originalWorks,
  ...wisdomWorks,
  ...mythWorks,
];

export const shelfOrder: { id: Shelf | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "story", label: "Stories" },
  { id: "essay", label: "Essays" },
  { id: "poem", label: "Poems" },
  { id: "letter", label: "Letters" },
];

export const shelfLabel: Record<Shelf, string> = {
  story: "Stories",
  essay: "Essays",
  poem: "Poems",
  letter: "Letters",
};

export const shelfSequence: Shelf[] = ["story", "essay", "poem", "letter"];

export function getWork(slug: string): Work | undefined {
  return catalogue.find((work) => work.slug === slug);
}

export function wordCount(work: Work): number {
  return work.paragraphs.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(work: Work): number {
  return Math.max(1, Math.round(wordCount(work) / 230));
}

export function openingLine(work: Work): string {
  return (work.paragraphs[0] ?? "").replace(/\s+/g, " ").trim();
}

export function excerpt(text: string, max = 140): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, max - 1).trimEnd()}…`;
}

/** Primary genre label for filters and list rows. */
export function genreFor(work: Work): string {
  if (work.genres && work.genres.length > 0) return work.genres[0];
  if (work.shelf === "poem") return "Poetry";
  if (work.shelf === "letter") return "Letters";
  if (work.shelf === "essay") return "Essays";
  const title = `${work.title} ${work.author}`.toLowerCase();
  if (/ghost|haunt|horror|house of usher|yellow wallpaper|tell-tale/.test(title))
    return "Horror";
  if (/adventure|sea|island|treasure|journey|road|ferry|lantern/.test(title))
    return "Adventure";
  if (/love|magi|marriage|romance|scarf|playlist/.test(title)) return "Love story";
  if (/comic|panel/.test(title)) return "Comics";
  if (/myth|persephone|orpheus|rama|osiris|amaterasu|odin|inanna/.test(title))
    return "Mythology";
  return "Short fiction";
}

export function allGenresOf(work: Work): Genre[] {
  if (work.genres && work.genres.length > 0) return work.genres;
  return [genreFor(work) as Genre];
}

export function periodFor(year: number): string {
  if (year < 1800) return "Before 1800";
  if (year < 1900) return "1800s";
  if (year < 2000) return "1900s";
  return "2000s";
}

function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3;
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const next = [i];
    for (let j = 1; j <= b.length; j += 1) {
      next[j] = Math.min(
        next[j - 1] + 1,
        row[j] + 1,
        row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    row = next;
  }
  return row[b.length];
}

export function matchesSearch(work: Work, query: string): boolean {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const words = `${work.title} ${work.author} ${work.year} ${openingLine(work)} ${(work.genres ?? []).join(" ")}`
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/);
  return terms.every((term) => {
    const normalized = term.normalize("NFKD").replace(/[^\p{L}\p{N}]/gu, "");
    return words.some(
      (word) =>
        word.includes(normalized) ||
        (normalized.length >= 4 &&
          editDistance(word, normalized) <= (normalized.length > 7 ? 2 : 1)),
    );
  });
}

export const collections = [
  {
    id: "quick",
    title: "A short pause",
    note: "A small volume for a little space in the day.",
    select: (work: Work) => readingMinutes(work) <= 5,
  },
  {
    id: "heart",
    title: "Matters of the heart",
    note: "Love stories and the soft edges of belonging.",
    select: (work: Work) => allGenresOf(work).includes("Love story"),
  },
  {
    id: "after-dark",
    title: "After dark",
    note: "Horror, thrillers, and things that wait in the quiet.",
    select: (work: Work) =>
      allGenresOf(work).some((g) => g === "Horror" || g === "Thriller" || g === "Gothic"),
  },
  {
    id: "laugh",
    title: "Comedy shelf",
    note: "Light trouble, umbrellas, and algorithms that apologize.",
    select: (work: Work) => allGenresOf(work).includes("Comedy"),
  },
  {
    id: "pulse",
    title: "Action & adventure",
    note: "Rooftops, ferries, salt maps, and last trains out.",
    select: (work: Work) =>
      allGenresOf(work).some((g) => g === "Action" || g === "Adventure"),
  },
  {
    id: "panels",
    title: "Comics",
    note: "Panel-by-panel shorts for a quick turn of the page.",
    select: (work: Work) => allGenresOf(work).includes("Comics"),
  },
  {
    id: "lift",
    title: "Motivational",
    note: "Small fires, honest returns, and doors you open anyway.",
    select: (work: Work) => allGenresOf(work).includes("Motivational"),
  },
  {
    id: "mind",
    title: "Mind & mood",
    note: "Psychological essays for clearer inner weather.",
    select: (work: Work) => allGenresOf(work).includes("Psychological"),
  },
  {
    id: "body",
    title: "Health & rest",
    note: "Sleep, breath, walking, and listening to limits.",
    select: (work: Work) => allGenresOf(work).includes("Health"),
  },
  {
    id: "songs",
    title: "Songs",
    note: "Lyric pieces you can read like music.",
    select: (work: Work) => allGenresOf(work).includes("Song"),
  },
  {
    id: "myths",
    title: "Mythology",
    note: "Long retellings from Greece, Egypt, India, Rome, China, Japan, and beyond.",
    select: (work: Work) => allGenresOf(work).includes("Mythology"),
  },
  {
    id: "century",
    title: "Across the centuries",
    note: "Writing from before 1800, the 1800s, and the new century.",
    select: (work: Work) => work.year < 1800 || work.year >= 1900,
  },
  {
    id: "poetry",
    title: "Poems to keep close",
    note: "Brief lines that reward a second visit.",
    select: (work: Work) => work.shelf === "poem",
  },
];
