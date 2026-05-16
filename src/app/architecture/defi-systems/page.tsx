import { defiCaseStudies } from "@/lib/defi-case-studies";
import { DefiCaseWalkthrough } from "@/components/defi-case-walkthrough";

export default function DefiSystemsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <section className="glass-panel">
        <p className="eyebrow">DeFi Case Studies</p>
        <h1 className="display-title mt-2">Interactive End-To-End DeFi Architecture Walkthroughs</h1>
        <p className="section-copy mt-3">
          Each case is step-ordered so you can trace exactly what happens, who executes it, how state changes,
          which invariants are checked, and what breaks if a step is removed.
        </p>
      </section>
      <section className="mt-6 grid gap-4">
        {defiCaseStudies.map((c) => (
          <DefiCaseWalkthrough key={c.id} study={c} />
        ))}
      </section>
    </main>
  );
}
