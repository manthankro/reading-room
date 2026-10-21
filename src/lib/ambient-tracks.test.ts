import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import { describe, it } from "node:test";
import { ambientTracks } from "./ambient-tracks.ts";

describe("ambient recordings", () => {
  it("lists four unique, locally available, credited sound files", () => {
    assert.equal(ambientTracks.length, 4);
    assert.equal(new Set(ambientTracks.map((track) => track.id)).size, ambientTracks.length);
    for (const track of ambientTracks) {
      const file = `public${track.src}`;
      assert.ok(existsSync(file), `${track.label} file is missing`);
      assert.ok(statSync(file).size > 20_000, `${track.label} file is unexpectedly small`);
      assert.match(track.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      assert.ok(track.author && track.license);
    }
  });
});
