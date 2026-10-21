import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  checkTranslationRateLimit,
  sourceFingerprint,
  translateWithGoogle,
  TranslationMemoryCache,
  TranslationServiceError,
} from "./translation.server.ts";

describe("story translation", () => {
  it("translates complete English passages into Hindi and Marathi", async () => {
    for (const targetLanguage of ["hi", "mr"] as const) {
      const translated = await translateWithGoogle({
        paragraphs: ["The first paragraph.", "A second paragraph."],
        sourceLanguage: "en",
        targetLanguage,
        apiKey: "server-only-key",
        fetchImpl: async (_input, init) => {
          const body = JSON.parse(String(init?.body)) as { q: string[]; target: string };
          assert.equal(body.target, targetLanguage);
          return new Response(JSON.stringify({ data: { translations: body.q.map((_, i) => ({ translatedText: `अनुवाद ${i + 1}` })) } }), { status: 200 });
        },
      });
      assert.deepEqual(translated, ["अनुवाद 1", "अनुवाद 2"]);
    }
  });

  it("supports a regional-language source and keeps the key out of the URL", async () => {
    let requestedUrl = "";
    let requestHeaders = new Headers();
    const translated = await translateWithGoogle({
      paragraphs: ["મૂળ વાર્તા."], sourceLanguage: "gu", targetLanguage: "mr", apiKey: "private-test-key",
      fetchImpl: async (input, init) => {
        requestedUrl = String(input);
        requestHeaders = new Headers(init?.headers);
        return new Response(JSON.stringify({ data: { translations: [{ translatedText: "मूळ भाषांतर" }] } }), { status: 200 });
      },
    });
    assert.deepEqual(translated, ["मूळ भाषांतर"]);
    assert.equal(new URL(requestedUrl).search, "");
    assert.equal(requestHeaders.get("X-Goog-Api-Key"), "private-test-key");
  });

  it("fails safely for missing configuration, provider errors, and timeouts", async () => {
    await assert.rejects(
      translateWithGoogle({ paragraphs: ["story"], sourceLanguage: "en", targetLanguage: "hi", apiKey: " " }),
      (error: unknown) => error instanceof TranslationServiceError && /not configured/i.test(error.message),
    );
    await assert.rejects(
      translateWithGoogle({ paragraphs: ["story"], sourceLanguage: "en", targetLanguage: "hi", apiKey: "key", fetchImpl: async () => new Response("", { status: 503 }) }),
      (error: unknown) => error instanceof TranslationServiceError && /original story is unchanged/i.test(error.message),
    );
    await assert.rejects(
      translateWithGoogle({ paragraphs: ["story"], sourceLanguage: "en", targetLanguage: "hi", apiKey: "key", fetchImpl: async () => { const error = new Error("timeout"); error.name = "TimeoutError"; throw error; } }),
      /too long/i,
    );
  });

  it("keeps translated Unicode and paragraph batching intact", async () => {
    const translated = await translateWithGoogle({
      paragraphs: ["नमस्ते।", "आणि पुन्हा भेटू."], sourceLanguage: "hi", targetLanguage: "mr", apiKey: "key",
      fetchImpl: async (_input, init) => {
        const body = JSON.parse(String(init?.body)) as { q: string[] };
        return new Response(JSON.stringify({ data: { translations: body.q.map((_, i) => ({ translatedText: `मराठी ${i + 1}` })) } }), { status: 200 });
      },
    });
    assert.deepEqual(translated, ["मराठी 1", "मराठी 2"]);
  });

  it("invalidates cache keys when source text or titles change and expires old entries", () => {
    const first = sourceFingerprint("story", "Title", ["Original"], "en", "hi");
    assert.notEqual(first, sourceFingerprint("story", "New title", ["Original"], "en", "hi"));
    assert.notEqual(first, sourceFingerprint("story", "Title", ["Edited source"], "en", "hi"));
    const cache = new TranslationMemoryCache<string>();
    cache.set(first, "अनुवाद", 1_000, 50);
    assert.equal(cache.get(first, 1_020), "अनुवाद");
    assert.equal(cache.get(first, 1_050), undefined);
  });

  it("limits repeated requests per rate-limit key", () => {
    const requests = new Map<string, number[]>();
    assert.equal(checkTranslationRateLimit(requests, "reader", 1_000, 2, 60_000), true);
    assert.equal(checkTranslationRateLimit(requests, "reader", 1_100, 2, 60_000), true);
    assert.equal(checkTranslationRateLimit(requests, "reader", 1_200, 2, 60_000), false);
  });
});
