import { createFileRoute } from "@tanstack/react-router";
import { MahabharataScreen } from "@/components/mahabharata-screen";

export const Route = createFileRoute("/mahabharata")({
  head: () => ({ meta: [{ title: "The Mahabharata · Pramanix Shelf" }] }),
  component: MahabharataScreen,
});
