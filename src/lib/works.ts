export type Shelf = "story" | "essay" | "poem" | "letter";

export type Work = {
  slug: string;
  title: string;
  author: string;
  year: number;
  shelf: Shelf;
  paragraphs: string[];
};

export const works: Work[] = [
  {
    "slug": "the-story-of-an-hour",
    "title": "The Story of an Hour",
    "author": "Kate Chopin",
    "year": 1894,
    "shelf": "story",
    "paragraphs": [
      "Knowing that Mrs. Mallard was afflicted with a heart trouble, great care was taken to break to her as gently as possible the news of her husband's death."
    ]
  }
];
