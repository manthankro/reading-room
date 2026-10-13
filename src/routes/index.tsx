import { createFileRoute } from "@tanstack/react-router";
import { LibraryScreen } from "@/components/library-screen";

export const Route = createFileRoute("/")({
  component: LibraryScreen,
});
