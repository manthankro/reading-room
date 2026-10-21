export const languageTags: Record<string, string> = {
  English: "en",
  Hindi: "hi",
  Marathi: "mr",
  Gujarati: "gu",
  Bengali: "bn",
  Tamil: "ta",
  Telugu: "te",
  Kannada: "kn",
  Malayalam: "ml",
};

export function languageTagFor(language?: string): string {
  return languageTags[language ?? "English"] ?? "en";
}
