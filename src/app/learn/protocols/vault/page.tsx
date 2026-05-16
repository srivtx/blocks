import Link from "next/link";
import { vaultDeepDive } from "@/lib/vault-deep-dive";
import { VaultDeepDivePlayer } from "@/components/vault-deep-dive-player";

export default function VaultDeepDivePage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8">
      <section className="glass-panel">
        <p className="eyebrow">Protocol Deep Dive</p>
        <h1 className="display-title mt-2">{vaultDeepDive.title}</h1>
        <p className="section-copy mt-2"><strong>Objective:</strong> {vaultDeepDive.objective}</p>
        <p className="section-copy mt-2"><strong>Architecture Summary:</strong> {vaultDeepDive.architectureSummary}</p>
        <p className="section-copy mt-2"><strong>Primary Constraints:</strong> {vaultDeepDive.primaryConstraints.join(" | ")}</p>
        <p className="section-copy mt-2"><strong>Accounts Model:</strong> {vaultDeepDive.accountsModel.join(" | ")}</p>
        <p className="section-copy mt-2"><strong>Authority Graph:</strong> {vaultDeepDive.authorityGraph.join(" | ")}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/learn/core-systems" className="term-chip">Back To Core Systems</Link>
          <Link href="/architecture/defi-systems" className="term-chip">Compare With DeFi Cases</Link>
        </div>
      </section>

      <VaultDeepDivePlayer />
    </main>
  );
}
