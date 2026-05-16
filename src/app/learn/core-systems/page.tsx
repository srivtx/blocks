import Link from "next/link";
import { CoreModulePlayer } from "@/components/core-module-player";
import { coreModules, solanaKitVersion } from "@/lib/core-systems";

export default function CoreSystemsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8">
      <section className="glass-panel">
        <p className="eyebrow">Core Systems Track</p>
        <h1 className="display-title mt-2">Reusable Solana Architecture + Runtime + Kit Foundations</h1>
        <p className="section-copy mt-3">
          This section teaches the primitives reused everywhere (vault, escrow, AMM, lending) using the same learning
          pattern: first-principles architecture, validator/runtime flow, and concrete code side-by-side.
        </p>
        <p className="section-copy mt-2">
          Solana Kit baseline pinned for this track: <strong>{solanaKitVersion}</strong>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/" className="term-chip">Back To Map</Link>
          <Link href="/learn/foundations/puzzles" className="term-chip">Thinking Puzzles First</Link>
          <Link href="/learn/tooling/anchor-basics" className="term-chip">Anchor Basics</Link>
          <Link href="/learn/protocols/vault" className="term-chip">Build Vault On Top Of Core</Link>
          <Link href="/architecture/defi-systems" className="term-chip">Then Apply In DeFi Case Studies</Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4">
        {coreModules.map((module) => (
          <CoreModulePlayer key={module.id} module={module} />
        ))}
      </section>
    </main>
  );
}
