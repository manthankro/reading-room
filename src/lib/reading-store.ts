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

type ReadingState = {
  hydrated: boolean;
  places: Record<string, Place>;
  notes: MarginNote[];
  seconds: Record<string, number>;
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
      seconds: {},
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
        set((state) => ({
          seconds: {
            ...state.seconds,
            [slug]: (state.seconds[slug] ?? 0) + amount,
          },
        })),
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
        seconds: state.seconds,
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

export function formatMinutes(seconds: number): string {
  const minutes = Math.max(0, Math.round(seconds / 60));
  if (seconds > 0 && minutes === 0) return "Under a minute";
  return `${minutes} min`;
}
