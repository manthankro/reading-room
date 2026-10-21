import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  catalogue,
  comicPanels,
  collections,
  genreFor,
  getWork,
  matchesSearch,
  readingMinutes,
  wordCount,
} from "./library.ts";
import { mahabharataWorks } from "./works-mahabharata.ts";

describe("catalogue", () => {
  it("includes classics, originals, wisdom, and myths", () => {
    assert.ok(catalogue.length >= 100, `expected 100+ volumes, got ${catalogue.length}`);
    assert.ok(catalogue.every((w) => w.slug && w.title && w.paragraphs.length > 0));
  });

  it("keeps original regional stories available across eight Indian languages", () => {
    for (const language of ["Hindi", "Marathi", "Gujarati", "Bengali", "Tamil", "Telugu", "Kannada", "Malayalam"]) {
      const stories = catalogue.filter((work) => work.language === language && work.author === "Reading Room");
      assert.ok(stories.length >= 3, `${language} needs at least three first-party stories`);
      assert.ok(stories.every((work) => work.paragraphs.length >= 4), `${language} stories should have readable body content`);
    }
  });

  it("resolves works by slug", () => {
    const sample = catalogue[0];
    assert.equal(getWork(sample.slug)?.title, sample.title);
    assert.equal(getWork("does-not-exist-xyz"), undefined);
  });

  it("exposes primary genres for filters", () => {
    const labels = new Set(catalogue.map(genreFor));
    for (const needed of ["Comedy", "Horror", "Mythology", "Motivational", "Health"]) {
      assert.ok(labels.has(needed), `missing genre label ${needed}`);
    }
  });

  it("supports typo-tolerant search", () => {
    const hit = catalogue.find((w) => matchesSearch(w, w.title.slice(0, 6)));
    assert.ok(hit);
  });

  it("searches story text beyond the opening line", () => {
    const work = getWork("the-story-of-an-hour");
    assert.ok(work);
    assert.ok(matchesSearch(work, "railroad disaster"));
  });

  it("computes positive reading minutes", () => {
    for (const work of catalogue.slice(0, 20)) {
      assert.ok(readingMinutes(work) >= 1);
    }
  });

  it("has working reading-path collections", () => {
    assert.ok(collections.length >= 8);
    for (const path of collections) {
      const count = catalogue.filter(path.select).length;
      // Some paths (e.g. pure poetry) may be empty; others must match.
      if (["lift", "myths", "laugh", "after-dark"].includes(path.id)) {
        assert.ok(count > 0, `collection ${path.id} matched nothing`);
      }
    }
  });

  it("offers distinct, multi-minute illustrated subgenres and historical shelves", () => {
    for (const [id, genre] of [
      ["manga", "Manga"],
      ["manhwa", "Manhwa"],
      ["isekai", "Isekai"],
      ["historical", "Historical"],
    ] as const) {
      const path = collections.find((item) => item.id === id);
      assert.ok(path, `missing ${id} reading path`);
      assert.ok(catalogue.some((work) => path.select(work) && work.genres?.includes(genre)));
    }

    for (const slug of [
      "manga-paper-moon-club",
      "manhwa-rooftop-garden",
      "isekai-second-sunrise",
      "comic-schoolyard-kite-day",
      "comic-umbrella-orchestra",
    ]) {
      const work = getWork(slug);
      assert.ok(work, `missing illustrated story ${slug}`);
      assert.equal(comicPanels(work).length, 16, `${slug} should have 16 panels`);
      assert.ok(readingMinutes(work) >= 2, `${slug} should show a multi-minute reading time`);
    }
  });

  it("keeps all 18 Mahabharata parvas and shows their real reading lengths", () => {
    assert.equal(mahabharataWorks.length, 18);
    assert.ok(mahabharataWorks.every((chapter) => wordCount(chapter) > 300));
    assert.ok(mahabharataWorks.every((chapter) => readingMinutes(chapter) >= 2));
  });
});
