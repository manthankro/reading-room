import { createFileRoute } from "@tanstack/react-router";
import { ReaderScreen } from "@/components/reader-screen";
import { getWork } from "@/lib/library";

export const Route = createFileRoute("/read/$slug")({
  head: ({ params }) => {
    const work = getWork(params.slug);
    return {
      meta: [{ title: work ? `${work.title} · Reading Room` : "Reading Room" }],
    };
  },
  component: ReaderRoute,
});

function ReaderRoute() {
  const { slug } = Route.useParams();
  return <ReaderScreen slug={slug} />;
}
