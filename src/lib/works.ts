export type Shelf = "story" | "essay" | "poem" | "letter" | "comic";

export type Genre =
  | "comedy"
  | "emotional"
  | "romance"
  | "love"
  | "comic"
  | "action"
  | "adventure"
  | "horror"
  | "poetry"
  | "essay"
  | "letter";

export type ComicPanel = {
  scene: string;
  speaker: string;
  line: string;
};

export type StoryChoice = {
  label: string;
  next: string;
};

export type StoryNode = {
  id: string;
  text: string;
  choices?: StoryChoice[];
  ending?: boolean;
};

export type Work = {
  slug: string;
  title: string;
  author: string;
  year: number;
  shelf: Shelf;
  genres?: Genre[];
  readingMinutes?: number;
  summary?: string;
  paragraphs?: string[];
  panels?: ComicPanel[];
  nodes?: StoryNode[];
  provenance?: string;
};

export const works: Work[] = [
  {
    slug: "the-story-of-an-hour",
    title: "The Story of an Hour",
    author: "Kate Chopin",
    year: 1894,
    shelf: "story",
    genres: ["emotional"],
    readingMinutes: 5,
    summary: "A woman receives news of her husband's death and discovers an unexpected freedom.",
    paragraphs: [
      "Knowing that Mrs. Mallard was afflicted with a heart trouble, great care was taken to break to her as gently as possible the news of her husband's death.",
      "It was her sister Josephine who told her, in broken sentences; veiled hints that revealed in half concealing.",
      "When the doctors came they said she had died of heart disease — of the joy that kills.",
    ],
    provenance: "Public domain.",
  },
];

/** Full public-domain + expanded catalogue lives in the Grok workspace zip (src/lib/works.ts, ~74 KB). */
