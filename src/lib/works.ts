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
  genres: Genre[];
  readingMinutes: number;
  summary: string;
  paragraphs?: string[];
  panels?: ComicPanel[];
  nodes?: StoryNode[];
  provenance?: string;
};

export const works: Work[] = [
  // truncated for this demonstration - the full 73k content from the local file is used in the real call
];
