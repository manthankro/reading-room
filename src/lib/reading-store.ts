import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Light = "lamp" | "day" | "night";
export type Measure = "narrow" | "comfort" | "wide";
export type Leading = "snug" | "open";
export type Size = 0 | 1 | 2 | 3;

export type Place = {
  index: number;
  ratio: number;
  updatedAt: number;
  finished: boolean;
};

export type MarginNote = {
  id: string;
  slug: string;
  quote: string;
  body: string;
  createdAt: number;
};

export type Bookmark = { id: string; slug: string; index: number; createdAt: number };
export type Highlight = { id: string; slug: string; quote: string; createdAt: number };
export type ReadingSnapshot = {
  places: Record<string, Place>;
  notes: MarginNote[];
  bookmarks: Bookmark[];
  highlights: Highlight[];
  seconds: Record<string, number>;
  dailySeconds: Record<string, number>;
  goalMinutes: number;
  light: Light;
  size: Size;
  measure: Measure;
  leading: Leading;
};

type ReadingState = {
  hydrated: boolean;
  places: Record<string, Place>;
  notes: MarginNote[];
  bookmarks: Bookmark[];
  highlights: Highlight[];
  seconds: Record<string, number>;
  dailySeconds: Record<string, number>;
  goalMinutes: number;
  light: Light;
  size: Size;
  measure: Measure;
  leading: Leading;
  focus: boolean;
  setHydrated: () => void;
  setPlace: (slug: string, patch: Pick<Place, "index" | "ratio"> & { finished?: boolean }) => void;
  addSeconds: (slug: string, amount: number) => void;
  addNote: (note: Omit<MarginNote, "id" | "createdAt">) => void;
  removeNote: (id: string) => void;
  toggleBookmark: (slug: string, index: number) => void;
  addHighlight: (slug: string, quote: string) => void;
  removeHighlight: (id: string) => void;
  setGoalMinutes: (minutes: number) => void;
  importSnapshot: (snapshot: ReadingSnapshot) => void;
  replaceSnapshot: (snapshot: ReadingSnapshot) => void;
  setLight: (light: Light) => void;
  setSize: (size: Size) => void;
  setMeasure: (measure: Measure) => void;
  setLeading: (leading: Leading) => void;
  setFocus: (focus: boolean) => void;
};

export const useReadingStore = create<ReadingState>()(
  persist(
    (set) => ({
      hydrated: false,
      places: {},
      notes: [],
      bookmarks: [],
      highlights: [],
      seconds: {},
      dailySeconds: {},
      goalMinutes: 20,
      light: "lamp",
      size: 1,
      measure: "comfort",
      leading: "open",
      focus: false,
      setHydrated: () => set({ hydrated: true }),
      setPlace: (slug, patch) =>
        set((state) => {
          const prev = state.places[slug];
          const finished = prev?.finished || Boolean(patch.finished);
          return {
            places: {
              ...state.places,
              [slug]: {
                index: patch.index,
                ratio: finished ? Math.max(patch.ratio, prev?.ratio ?? 0) : patch.ratio,
                updatedAt: Date.now(),
                finished,
              },
            },
          };
        }),
      addSeconds: (slug, amount) =>
        set((state) => {
          const day = new Date().toISOString().slice(0, 10);
          return {
            seconds: { ...state.seconds, [slug]: (state.seconds[slug] ?? 0) + amount },
            dailySeconds: { ...state.dailySeconds, [day]: (state.dailySeconds[day] ?? 0) + amount },
          };
        }),
      addNote: (note) =>
        set((state) => ({
          notes: [
            {
              ...note,
              id: crypto.randomUUID(),
              createdAt: Date.now(),
            },
            ...state.notes,
          ],
        })),
      removeNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),
      toggleBookmark: (slug, index) =>
        set((state) => {
          const existing = state.bookmarks.find(
            (item) => item.slug === slug && item.index === index,
          );
          return {
            bookmarks: existing
              ? state.bookmarks.filter((item) => item.id !== existing.id)
              : [
                  { id: crypto.randomUUID(), slug, index, createdAt: Date.now() },
                  ...state.bookmarks,
                ],
          };
        }),
      addHighlight: (slug, quote) =>
        set((state) => ({
          highlights: [
            { id: crypto.randomUUID(), slug, quote, createdAt: Date.now() },
            ...state.highlights,
          ],
        })),
      removeHighlight: (id) =>
        set((state) => ({ highlights: state.highlights.filter((item) => item.id !== id) })),
      setGoalMinutes: (goalMinutes) =>
        set({ goalMinutes: Math.max(5, Math.min(240, goalMinutes)) }),
      importSnapshot: (incoming) =>
        set((state) => {
          const places = { ...incoming.places, ...state.places };
          for (const [slug, remote] of Object.entries(incoming.places)) {
            const local = state.places[slug];
            if (!local || remote.updatedAt > local.updatedAt) places[slug] = remote;
          }
          const byId = <T extends { id: string }>(a: T[], b: T[]) => [
            ...new Map([...a, ...b].map((item) => [item.id, item])).values(),
          ];
          const maxMap = (a: Record<string, number>, b: Record<string, number>) =>
            Object.fromEntries(
              Array.from(new Set([...Object.keys(a), ...Object.keys(b)])).map((key) => [
                key,
                Math.max(a[key] ?? 0, b[key] ?? 0),
              ]),
            );
          return {
            places,
            notes: byId(incoming.notes, state.notes),
            bookmarks: byId(incoming.bookmarks, state.bookmarks),
            highlights: byId(incoming.highlights, state.highlights),
            seconds: maxMap(incoming.seconds, state.seconds),
            dailySeconds: maxMap(incoming.dailySeconds, state.dailySeconds),
            goalMinutes: incoming.goalMinutes,
            light: incoming.light,
            size: incoming.size,
            measure: incoming.measure,
            leading: incoming.leading,
          };
        }),
      replaceSnapshot: (snapshot) => set(snapshot),
      setLight: (light) => set({ light }),
      setSize: (size) => set({ size }),
      setMeasure: (measure) => set({ measure }),
      setLeading: (leading) => set({ leading }),
      setFocus: (focus) => set({ focus }),
    }),
    {
      name: "reading-room",
      version: 1,
      skipHydration: true,
      partialize: (state) => ({
        places: state.places,
        notes: state.notes,
        bookmarks: state.bookmarks,
        highlights: state.highlights,
        seconds: state.seconds,
        dailySeconds: state.dailySeconds,
        goalMinutes: state.goalMinutes,
        light: state.light,
        size: state.size,
        measure: state.measure,
        leading: state.leading,
        focus: state.focus,
      }),
      onRehydrateStorage: () => () => {
        useReadingStore.setState({ hydrated: true });
      },
    },
  ),
);

export function totalSeconds(seconds: Record<string, number>): number {
  return Object.values(seconds).reduce((sum, value) => sum + value, 0);
}

export function getReadingSnapshot(): ReadingSnapshot {
  const {
    places,
    notes,
    bookmarks,
    highlights,
    seconds,
    dailySeconds,
    goalMinutes,
    light,
    size,
    measure,
    leading,
  } = useReadingStore.getState();
  return {
    places,
    notes,
    bookmarks,
    highlights,
    seconds,
    dailySeconds,
    goalMinutes,
    light,
    size,
    measure,
    leading,
  };
}

export function formatMinutes(seconds: number): string {
  const minutes = Math.max(0, Math.round(seconds / 60));
  if (seconds > 0 && minutes === 0) return "Under a minute";
  return `${minutes} min`;
}
