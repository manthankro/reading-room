import { createHash } from "node:crypto";
import { getWork } from "./library.ts";
import { languageTagFor, languageTags } from "./language.ts";
import { translationTargets, type TranslationTarget } from "./translation.shared.ts";

export const TRANSLATION_MAX_CHARS = 28_000;
const TRANSLATION_BATCH_CHARS = 4_500;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_MAX_ENTRIES = 128;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 8;
const TRANSLATION_TIMEOUT_MS = 12_000;

type TranslationResult = {
  title: string;
  paragraphs: string[];
  sourceLanguage: string;
  targetLanguage: TranslationTarget;
  provider: "Google Cloud Translation";
  translatedAt: string;
};

export class TranslationMemoryCache<T> {
  private entries = new Map<string, { expiresAt: number; result: T }>();

  get(key: string, now = Date.now()): T | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= now) {
      this.entries.delete(key);
      return undefined;
    }
    return entry.result;
  }

  set(key: string, result: T, now = Date.now(), ttlMs = CACHE_TTL_MS): void {
    this.entries.delete(key);
    this.entries.set(key, { result, expiresAt: now + ttlMs });
    while (this.entries.size > CACHE_MAX_ENTRIES) {
      const oldest = this.entries.keys().next().value;
      if (oldest === undefined) break;
      this.entries.delete(oldest);
    }
  }

  prune(now = Date.now()): void {
    for (const [key, entry] of this.entries) {
      if (entry.expiresAt <= now) this.entries.delete(key);
    }
  }
}

const translationCache = new TranslationMemoryCache<TranslationResult>();
const requestsByIp = new Map<string, number[]>();

export class TranslationServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TranslationServiceError";
  }
}

type Chunk = { paragraphIndex: number; text: string };

function splitLongParagraph(text: string, maxChars: number): string[] {
  const sentences = text.match(/[^.!?।]+[.!?।]*\s*/gu) ?? [text];
  const parts: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if (sentence.length > maxChars) {
      if (current) parts.push(current.trim());
      current = "";
      let remaining = sentence.trim();
      while (remaining.length > maxChars) {
        let boundary = remaining.lastIndexOf(" ", maxChars);
        if (boundary < 1) boundary = maxChars;
        parts.push(remaining.slice(0, boundary).trim());
        remaining = remaining.slice(boundary).trim();
      }
      current = remaining;
      continue;
    }
    if (current.length + sentence.length > maxChars) {
      parts.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts.length ? parts : [text];
}

export function makeTranslationBatches(paragraphs: string[], maxChars = TRANSLATION_BATCH_CHARS): Chunk[][] {
  const chunks = paragraphs.flatMap((paragraph, paragraphIndex) =>
    splitLongParagraph(paragraph, maxChars).map((text) => ({ paragraphIndex, text })),
  );
  const batches: Chunk[][] = [];
  let batch: Chunk[] = [];
  let length = 0;
  for (const chunk of chunks) {
    if (batch.length >= 128 || (length + chunk.text.length > maxChars && batch.length > 0)) {
      batches.push(batch);
      batch = [];
      length = 0;
    }
    batch.push(chunk);
    length += chunk.text.length;
  }
  if (batch.length) batches.push(batch);
  return batches;
}

function decodeGoogleText(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number(decimal)))
    .replace(/&#x([\da-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)));
}

type GoogleResponse = {
  data?: { translations?: Array<{ translatedText?: string }> };
};

export async function translateWithGoogle(args: {
  paragraphs: string[];
  sourceLanguage: string;
  targetLanguage: TranslationTarget;
  apiKey: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}): Promise<string[]> {
  if (!args.apiKey.trim()) {
    throw new TranslationServiceError("Translation is not configured yet. The original story is still available.");
  }
  if (!Object.values(languageTags).includes(args.sourceLanguage) || !translationTargets.includes(args.targetLanguage)) {
    throw new TranslationServiceError("That language pair is not supported.");
  }
  if (args.paragraphs.length === 0 || args.paragraphs.some((paragraph) => !paragraph.trim())) {
    throw new TranslationServiceError("This story does not contain translatable text.");
  }
  const charCount = args.paragraphs.reduce((total, paragraph) => total + paragraph.length, 0);
  if (charCount > TRANSLATION_MAX_CHARS) {
    throw new TranslationServiceError("This story is too long to translate in one request.");
  }

  const output = args.paragraphs.map(() => [] as string[]);
  const fetchImpl = args.fetchImpl ?? fetch;
  for (const batch of makeTranslationBatches(args.paragraphs)) {
    let response: Response;
    try {
      response = await fetchImpl("https://translation.googleapis.com/language/translate/v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-Goog-Api-Key": args.apiKey,
        },
        body: JSON.stringify({
          q: batch.map((chunk) => chunk.text),
          source: args.sourceLanguage,
          target: args.targetLanguage,
          format: "text",
        }),
        signal: AbortSignal.timeout(args.timeoutMs ?? TRANSLATION_TIMEOUT_MS),
      });
    } catch (error) {
      if (error instanceof Error && error.name === "TimeoutError") {
        throw new TranslationServiceError("Translation took too long. Please try again.");
      }
      throw new TranslationServiceError("Translation could not connect. Please try again.");
    }
    if (!response.ok) {
      if (response.status === 429) {
        throw new TranslationServiceError("Translation is busy right now. Please try again in a little while.");
      }
      throw new TranslationServiceError("Translation is temporarily unavailable. Your original story is unchanged.");
    }
    let payload: GoogleResponse;
    try {
      payload = (await response.json()) as GoogleResponse;
    } catch {
      throw new TranslationServiceError("Translation returned an unreadable response. Your original story is unchanged.");
    }
    const translated = payload.data?.translations;
    if (!translated || translated.length !== batch.length || translated.some((item) => !item.translatedText)) {
      throw new TranslationServiceError("Translation was incomplete. Your original story is unchanged.");
    }
    batch.forEach((chunk, index) => output[chunk.paragraphIndex]?.push(decodeGoogleText(translated[index]!.translatedText!)));
  }

  return output.map((parts) => parts.join(" "));
}

export function sourceFingerprint(slug: string, title: string, paragraphs: string[], sourceLanguage: string, targetLanguage: TranslationTarget) {
  return createHash("sha256")
    .update(JSON.stringify({ slug, title, paragraphs, sourceLanguage, targetLanguage, version: 1 }))
    .digest("hex");
}

function isFirstPartyWork(author: string): boolean {
  return author === "Reading Room" || author.startsWith("Reading Room (after ");
}

export function checkTranslationRateLimit(
  store: Map<string, number[]>,
  key: string,
  now = Date.now(),
  maxRequests = RATE_MAX_REQUESTS,
  windowMs = RATE_WINDOW_MS,
): boolean {
  for (const [storedKey, timestamps] of store) {
    const active = timestamps.filter((time) => now - time < windowMs);
    if (active.length) store.set(storedKey, active);
    else store.delete(storedKey);
  }
  if (!store.has(key) && store.size >= 10_000) {
    const oldest = store.keys().next().value;
    if (oldest !== undefined) store.delete(oldest);
  }
  const recent = (store.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= maxRequests) {
    store.set(key, recent);
    return false;
  }
  recent.push(now);
  store.set(key, recent);
  return true;
}

export async function getTranslationStatusServer() {
  return { configured: Boolean(process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY?.trim()) };
}

export async function translateStoryServer(data: { slug: string; targetLanguage: TranslationTarget }): Promise<TranslationResult> {
  const { assertSameSiteRequest } = await import("./auth/isolation.server.ts");
  assertSameSiteRequest();
  const request = (await import("@tanstack/react-start/server")).getRequest();
  const ip = request?.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    || request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
  if (!checkTranslationRateLimit(requestsByIp, ip)) {
    throw new TranslationServiceError("You’ve requested several translations recently. Please wait a few minutes.");
  }

  const work = getWork(data.slug);
  if (!work || !isFirstPartyWork(work.author)) {
    throw new TranslationServiceError("This text is not available for translation. Its original language remains unchanged.");
  }
  const sourceLanguage = languageTagFor(work.language);
  if (sourceLanguage === data.targetLanguage) {
    throw new TranslationServiceError("Choose a language different from the original.");
  }
  const apiKey = process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY?.trim();
  if (!apiKey) {
    throw new TranslationServiceError("Translation is not configured yet. The original story is still available.");
  }

  const key = sourceFingerprint(work.slug, work.title, work.paragraphs, sourceLanguage, data.targetLanguage);
  const now = Date.now();
  translationCache.prune(now);
  const cached = translationCache.get(key, now);
  if (cached) return cached;

  const translatedContent = await translateWithGoogle({
    paragraphs: [work.title, ...work.paragraphs],
    sourceLanguage,
    targetLanguage: data.targetLanguage,
    apiKey,
  });
  const result: TranslationResult = {
    title: translatedContent[0] ?? work.title,
    paragraphs: translatedContent.slice(1),
    sourceLanguage,
    targetLanguage: data.targetLanguage,
    provider: "Google Cloud Translation",
    translatedAt: new Date().toISOString(),
  };
  translationCache.set(key, result, now);
  return result;
}
