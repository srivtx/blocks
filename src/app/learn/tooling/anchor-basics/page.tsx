import Link from "next/link";
import { anchorBasics } from "@/lib/anchor-basics";
import { AnchorModulePlayer } from "@/components/anchor-module-player";

export default function AnchorBasicsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8">
      <section className="glass-panel">
        <p className="eyebrow">Tooling Fundamentals</p>
        <h1 className="display-title mt-2">Anchor Basics: What, Why, And How</h1>
        <p className="section-copy mt-2">
          Learn Anchor in architecture-first order: why it exists, what problems it solves, what it does not solve,
          and how it works with Solana Kit in real protocol workflows.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/learn/foundations/puzzles" className="term-chip">Back To Thinking Puzzles</Link>
          <Link href="/learn/protocols/vault" className="term-chip">Apply In Vault Deep Dive</Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4">
        {anchorBasics.map((m) => (
          <AnchorModulePlayer key={m.id} module={m} />
        ))}
      </section>
    </main>
  );
}
