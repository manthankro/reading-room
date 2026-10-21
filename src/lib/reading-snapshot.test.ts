import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseReadingSnapshot } from "./reading-snapshot.ts";

const validSnapshot = {
  places: { "quiet-story": { index: 2, ratio: 0.5, updatedAt: 10, finished: false } },
  notes: [{ id: "note-1", slug: "quiet-story", quote: "A line", body: "Remember this", createdAt: 10 }],
  bookmarks: [{ id: "bookmark-1", slug: "quiet-story", index: 2, createdAt: 10 }],
  highlights: [{ id: "highlight-1", slug: "quiet-story", quote: "A line", createdAt: 10 }],
  seconds: { "quiet-story": 120 },
  dailySeconds: { "2026-10-21": 60 },
  goalMinutes: 20,
  light: "lamp",
  size: 1,
  measure: "comfort",
  leading: "open",
};

describe("reading backup validation", () => {
  it("accepts a complete valid shelf backup", () => {
    assert.deepEqual(parseReadingSnapshot(validSnapshot), validSnapshot);
  });

  it("rejects malformed progress and unsupported reader settings", () => {
    assert.equal(parseReadingSnapshot({ ...validSnapshot, places: { x: { index: -1, ratio: 4, updatedAt: NaN, finished: "no" } } }), null);
    assert.equal(parseReadingSnapshot({ ...validSnapshot, light: "ultraviolet" }), null);
  });

  it("rejects oversized notes and excessive records", () => {
    assert.equal(parseReadingSnapshot({ ...validSnapshot, notes: [{ ...validSnapshot.notes[0], body: "x".repeat(4_001) }] }), null);
    assert.equal(parseReadingSnapshot({ ...validSnapshot, bookmarks: Array(5_001).fill(validSnapshot.bookmarks[0]) }), null);
  });
});
