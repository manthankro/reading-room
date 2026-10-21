import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { translationTargets } from "./translation.shared.ts";

const translationInput = z.object({
  slug: z.string().min(1).max(200),
  targetLanguage: z.enum(translationTargets),
});

export const getTranslationStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { getTranslationStatusServer } = await import("./translation.server.ts");
  return getTranslationStatusServer();
});

export const translateStory = createServerFn({ method: "POST" })
  .validator((input: unknown) => translationInput.parse(input))
  .handler(async ({ data }) => {
    const { translateStoryServer } = await import("./translation.server.ts");
    return translateStoryServer(data);
  });
