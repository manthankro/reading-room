export const translationTargets = ["en", "hi", "mr"] as const;
export type TranslationTarget = (typeof translationTargets)[number];

export const translationTargetNames: Record<TranslationTarget, string> = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
};
