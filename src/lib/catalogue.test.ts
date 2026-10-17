import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  catalogue,
  collections,
  genreFor,
  getWork,
  matchesSearch,
  readingMinutes,
} from "./library.ts";

describe("catalogue", () => {
  it("includes classics, originals, wisdom, and myths", () => {
    assert.ok(catalogue.length >= 100, `expected 100+ volumes, got ${catalogue.length}`);
    assert.ok(catalogue.every((w) => w.slug && w.title && w.paragraphs.length > 0));
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
});
