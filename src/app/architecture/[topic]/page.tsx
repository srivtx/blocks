import { notFound } from "next/navigation";
import { diagramTopics } from "@/lib/system-diagrams";
import { DiagramView } from "@/components/diagram-view";

export default async function ArchitectureTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const model = diagramTopics[topic];
  if (!model) return notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <section className="panel">
        <h1 className="section-title">{model.title}</h1>
        <p className="section-copy mt-2">{model.why}</p>
        <DiagramView model={model} />
      </section>
    </main>
  );
}
