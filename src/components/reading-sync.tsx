import { useEffect, useRef } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { loadReadingSnapshot, saveReadingSnapshot } from "@/lib/reading-sync";
import { getReadingSnapshot, useReadingStore } from "@/lib/reading-store";

export function ReadingSync() {
  const { user, isPending } = useCurrentUserState();
  const hydrated = useReadingStore((state) => state.hydrated);
  useReadingStore();
  const snapshot = getReadingSnapshot();
  const readyForSave = useRef(false);
  const currentUserId = user?.id;

  useEffect(() => {
    readyForSave.current = false;
    if (isPending || !hydrated || !currentUserId) return;
    let active = true;
    void loadReadingSnapshot()
      .then((remote) => {
        if (!active) return;
        const previousOwner = localStorage.getItem("reading-room-sync-owner");
        if (previousOwner && previousOwner !== currentUserId) {
          useReadingStore.getState().replaceSnapshot(
            remote ?? {
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
            },
          );
        } else if (remote) {
          useReadingStore.getState().importSnapshot(remote);
        }
        localStorage.setItem("reading-room-sync-owner", currentUserId);
        readyForSave.current = true;
      })
      .catch(() => {
        readyForSave.current = true;
      });
    return () => {
      active = false;
    };
  }, [currentUserId, hydrated, isPending]);

  useEffect(() => {
    if (!currentUserId || !hydrated || !readyForSave.current) return;
    const timer = window.setTimeout(() => {
      void saveReadingSnapshot({ data: snapshot }).catch(() => undefined);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [currentUserId, hydrated, snapshot]);
  return null;
}
