import { createFileRoute } from "@tanstack/react-router";
import { WriterApplicationScreen } from "@/components/writer-application-screen";

export const Route = createFileRoute("/writers")({
  head: () => ({
    meta: [
      { title: "Become a Content Writer · Reading Room" },
      {
        name: "description",
        content: "Share your fiction, poetry, folklore, and stories in your own language with Reading Room.",
      },
    ],
  }),
  component: WriterApplicationScreen,
});
