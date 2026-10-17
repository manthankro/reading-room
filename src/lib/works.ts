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
    slug: "the-story-of-an-hour",
    title: "The Story of an Hour",
    author: "Kate Chopin",
    year: 1894,
    shelf: "story",
    paragraphs: [
      "Knowing that Mrs. Mallard was afflicted with a heart trouble, great care was taken to break to her as gently as possible the news of her husband's death.",
      "It was her sister Josephine who told her, in broken sentences; veiled hints that revealed in half concealing. Her husband's friend Richards was there, too, near her.",
      "When the doctors came they said she had died of heart disease — of the joy that kills.",
    ],
  },
  {
    slug: "the-gift-of-the-magi",
    title: "The Gift of the Magi",
    author: "O. Henry",
    year: 1905,
    shelf: "story",
    paragraphs: [
      "One dollar and eighty-seven cents. That was all. And sixty cents of it was in pennies.",
      "There was clearly nothing to do but flop down on the shabby little couch and howl. So Della did it.",
      "The magi, as you know, were wise men—wonderfully wise men—who brought gifts to the Babe in the manger.",
    ],
  },
];
