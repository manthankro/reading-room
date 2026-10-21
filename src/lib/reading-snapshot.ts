import { z } from "zod";
import type { ReadingSnapshot } from "./reading-store.ts";

const slug = z.string().min(1).max(200);
const finiteSeconds = z.number().finite().min(0).max(100_000_000);
const readingSnapshotSchema = z.object({
  places: z.record(slug, z.object({
    index: z.number().int().min(0).max(100_000),
    ratio: z.number().finite().min(0).max(1),
    updatedAt: z.number().finite().min(0),
    finished: z.boolean(),
  }).strict()).refine((value) => Object.keys(value).length <= 5_000),
  notes: z.array(z.object({
    id: z.string().min(1).max(100), slug, quote: z.string().max(320), body: z.string().max(4_000),
    createdAt: z.number().finite().min(0),
  }).strict()).max(2_000),
  bookmarks: z.array(z.object({
    id: z.string().min(1).max(100), slug, index: z.number().int().min(0).max(100_000),
    createdAt: z.number().finite().min(0),
  }).strict()).max(5_000),
  highlights: z.array(z.object({
    id: z.string().min(1).max(100), slug, quote: z.string().min(1).max(320),
    createdAt: z.number().finite().min(0),
  }).strict()).max(5_000),
  seconds: z.record(slug, finiteSeconds).refine((value) => Object.keys(value).length <= 5_000),
  dailySeconds: z.record(z.string().regex(/^\d{4}-\d{2}-\d{2}$/), finiteSeconds)
    .refine((value) => Object.keys(value).length <= 3_000),
  goalMinutes: z.number().int().min(5).max(240),
  light: z.enum(["lamp", "day", "night"]),
  size: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  measure: z.enum(["narrow", "comfort", "wide"]),
  leading: z.enum(["snug", "open"]),
}).strict();

export function parseReadingSnapshot(value: unknown): ReadingSnapshot | null {
  const result = readingSnapshotSchema.safeParse(value);
  return result.success ? result.data : null;
}
