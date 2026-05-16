import Link from "next/link";
import { notFound } from "next/navigation";
import { phases, type CausalQuestion } from "@/lib/architecture";
import { phaseLessons } from "@/lib/lesson-content";
import { ArchitectureGate } from "@/components/architecture-gate";

const labels: Record<CausalQuestion, string> = {
  problem: "Problem",
  failure: "Prior Failure",
  constraint: "Forcing Constraint",
  tradeoff: "New Tradeoff",
  runtime: "Runtime Mechanics",
  state: "State Movement",
  ownership: "Ownership",
  validator: "Validator Processing",
  determinism: "Determinism",
  breakage: "Breakage If Removed",
};

export default async function PhasePage({ params }: { params: Promise<{ phase: string }> }) {
  const { phase } = await params;
  const current = phases.find((p) => p.id === phase);
  const lesson = phaseLessons[phase];
  if (!current || !lesson) return notFound();

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <div className="glass-panel">
        <p className="eyebrow">Phase {current.order}</p>
        <h1 className="display-title mt-2">{current.title}</h1>
        <p className="section-copy mt-3">{current.objective}</p>
      </div>

      <section className="mt-6 grid gap-3">
        {(Object.keys(labels) as CausalQuestion[]).map((k) => (
          <article className="lens-item" key={k}>
            <p className="lens-question">{labels[k]}</p>
            <p className="lens-answer">{current.causalChain[k]}</p>
          </article>
        ))}
      </section>

      <ArchitectureGate lesson={lesson} phaseId={current.id} />

      <div className="mt-8 flex gap-3">
        <Link href="/simulators/tx-flow" className="term-chip">Open Runtime Simulator</Link>
        <Link href="/architecture/validators" className="term-chip">Open System Diagrams</Link>
      </div>
    </main>
  );
}
