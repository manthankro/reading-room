import { createFileRoute } from "@tanstack/react-router";
import { WriterAdminScreen } from "@/components/writer-admin-screen";

export const Route = createFileRoute("/admin/writers")({
  head: () => ({
    meta: [
      { title: "Writer Applications · Reading Room" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: WriterAdminScreen,
});
