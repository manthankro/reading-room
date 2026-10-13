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
