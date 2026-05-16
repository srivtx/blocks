import { defiCaseStudies } from "@/lib/defi-case-studies";

export default function DefiSystemsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <section className="glass-panel">
        <p className="eyebrow">DeFi Case Studies</p>
        <h1 className="display-title mt-2">End-To-End DeFi Architecture Walkthroughs</h1>
        <p className="section-copy mt-3">Each case maps architecture, runtime flow, invariants, and failure mode if constraints are removed.</p>
      </section>
      <section className="mt-6 grid gap-4">
        {defiCaseStudies.map((c) => (
          <article key={c.id} className="lens-item">
            <p className="lens-question">{c.title}</p>
            <p className="lesson-copy mt-2"><strong>Architecture:</strong> {c.architecture}</p>
            <p className="lesson-copy mt-2"><strong>Execution Flow:</strong> {c.runtimeFlow}</p>
            <p className="lesson-copy mt-2"><strong>Invariants:</strong> {c.invariants.join(" | ")}</p>
            <p className="lesson-copy mt-2"><strong>What Breaks If Removed:</strong> {c.failureMode}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
