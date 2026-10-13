import { useEffect } from "react";
import { useReadingStore } from "@/lib/reading-store";

export function ReadingHydration() {
  useEffect(() => {
    void useReadingStore.persist.rehydrate();
  }, []);
  return null;
}
