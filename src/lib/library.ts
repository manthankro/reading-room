import { works, type Shelf, type Work } from "@/lib/works";

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
  return works.find((work) => work.slug === slug);
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

export function genreFor(work: Work): string {
  if (work.shelf === "poem") return "Poetry";
  if (work.shelf === "letter") return "Letters";
  if (work.shelf === "essay") return "Essays";
  const title = `${work.title} ${work.author}`.toLowerCase();
  if (/ghost|haunt|horror|house of usher|yellow wallpaper/.test(title)) return "Gothic";
  if (/adventure|sea|island|treasure|journey|road/.test(title)) return "Adventure";
  if (/love|magi|marriage|romance/.test(title)) return "Love & belonging";
  return "Short fiction";
}

export function periodFor(year: number): string {
  if (year < 1800) return "Before 1800";
  if (year < 1900) return "1800s";
  return "1900s";
}

function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3;
  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const next = [i];
    for (let j = 1; j <= b.length; j += 1) {
      next[j] = Math.min(next[j - 1] + 1, row[j] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    row = next;
  }
  return row[b.length];
}

export function matchesSearch(work: Work, query: string): boolean {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const words = `${work.title} ${work.author} ${work.year} ${openingLine(work)}`
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
