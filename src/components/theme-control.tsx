import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useReadingStore } from "@/lib/reading-store";

/** Keep the persisted reading mode in sync across every route, including non-reader pages. */
export function ReadingTheme() {
  const light = useReadingStore((state) => state.light);
  const setLight = useReadingStore((state) => state.setLight);
  const hydrated = useReadingStore((state) => state.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.light = light;
    document.documentElement.style.colorScheme = light === "night" ? "dark" : "light";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        light === "night" ? "#141312" : light === "day" ? "#efe6d6" : "#f4f0e6",
      );
  }, [hydrated, light]);

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Switch to ${light === "night" ? "day" : "night"} theme`}
      title={`Switch to ${light === "night" ? "day" : "night"} theme`}
      onClick={() => setLight(light === "night" ? "day" : "night")}
    >
      {light === "night" ? (
        <Sun aria-hidden className="size-4" />
      ) : (
        <Moon aria-hidden className="size-4" />
      )}
      <span>{light === "night" ? "Day" : "Night"}</span>
    </button>
  );
}
