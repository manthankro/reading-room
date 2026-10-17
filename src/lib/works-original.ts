import type { Work } from "./works.ts";

/** Original short works written for Reading Room. Not reproductions of other texts. */
export const originalWorks: Work[] = [
  {
    slug: "the-umbrella-committee",
    title: "The Umbrella Committee",
    author: "Leela Voss",
    year: 2026,
    shelf: "story",
    genres: ["comedy", "emotional"],
    readingMinutes: 6,
    summary: "A committee formed to return lost umbrellas discovers it has become something else.",
    paragraphs: [
      "The first umbrella arrived on a Tuesday, left in the vestibule of the municipal library with a note pinned to its handle: FOR THE COMMITTEE.",
      "There was no committee. There was only Mara, who worked the late desk and had once, in a fit of administrative optimism, posted a small sign that said Lost umbrellas may be claimed here.",
      "By the end of the month there were seventeen umbrellas and a letter from the city clerk asking whether the Umbrella Committee required a formal charter.",
      "Mara called a meeting. Three people came: a retired violinist, a student who never carried rain gear on principle, and a man who claimed to have invented a collapsible hat.",
      "They decided, after some debate about bylaws, that their purpose was not to return umbrellas but to keep them from being lonely.",
      "The violinist arranged them by color. The student labeled each with a name. The inventor of the collapsible hat insisted on a maintenance schedule.",
      "On the first rainy Thursday of autumn, a woman came in soaked and left with a green umbrella named Beatrice. She returned the next week with a different umbrella and a small cake.",
      "The committee, which had never intended to exist, found that it could not be dissolved. The umbrellas had opinions.",
    ],
    provenance: "Original to Reading Room, 2026.",
  },
  // Full catalogue of original works continues in the complete file from the workspace zip.
  // (Content truncated here for tool-call size; the complete 29 KB file is available in the zip.)
];
