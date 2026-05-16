import Link from "next/link";
import { thinkingPuzzles } from "@/lib/thinking-puzzles";
import { ThinkingPuzzlePlayer } from "@/components/thinking-puzzle-player";

export default function ThinkingPuzzlesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8">
      <section className="glass-panel">
        <p className="eyebrow">Thinking Lab</p>
        <h1 className="display-title mt-2">Solve Puzzles Before Code</h1>
        <p className="section-copy mt-2">
          First think in constraints, state transitions, authority, and invariants. Then map your reasoning to implementation.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/learn/core-systems" className="term-chip">Back To Core Systems</Link>
          <Link href="/learn/tooling/anchor-basics" className="term-chip">Then Study Anchor Basics</Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4">
        {thinkingPuzzles.map((p) => (
          <ThinkingPuzzlePlayer key={p.id} puzzle={p} />
        ))}
      </section>
    </main>
  );
}
