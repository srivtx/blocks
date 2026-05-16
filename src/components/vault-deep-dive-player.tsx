"use client";

import { useEffect, useMemo, useState } from "react";
import { vaultDeepDive } from "@/lib/vault-deep-dive";

export function VaultDeepDivePlayer() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setIndex((i) => {
        if (i >= vaultDeepDive.steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 1500);
    return () => clearInterval(t);
  }, [playing]);

  const step = vaultDeepDive.steps[index];
  const progress = useMemo(
    () => Math.round(((index + 1) / vaultDeepDive.steps.length) * 100),
    [index],
  );

  return (
    <section className="panel mt-6">
      <p className="section-title">Interactive Vault Build Flow</p>
      <p className="section-copy">Progress {index + 1}/{vaultDeepDive.steps.length} ({progress}%)</p>

      <article className="term-panel mt-3">
        <p className="phase-title">{step.stage}</p>
        <p className="lesson-copy mt-1"><strong>Purpose:</strong> {step.purpose}</p>
        <p className="lesson-copy mt-1"><strong>Accounts:</strong> {step.accounts.join(" | ")}</p>
        <p className="lesson-copy mt-1"><strong>Authority:</strong> {step.authority}</p>
        <p className="lesson-copy mt-1"><strong>Runtime Flow:</strong> {step.runtimeFlow}</p>
        <p className="lesson-copy mt-1"><strong>State Before:</strong> {step.stateBefore}</p>
        <p className="lesson-copy mt-1"><strong>State After:</strong> {step.stateAfter}</p>
        <p className="lesson-copy mt-1"><strong>Invariant Checks:</strong> {step.invariantChecks.join(" | ")}</p>
        <p className="lesson-copy mt-1"><strong>If Removed:</strong> {step.failureIfRemoved}</p>
        <p className="lesson-copy mt-1"><strong>Core Module Refs:</strong> {step.coreRefs.join(" | ")}</p>
        <pre className="mt-2 overflow-x-auto rounded-md border border-[var(--line)] bg-[rgba(2,10,20,0.95)] p-3 text-xs text-slate-100">
          <code>{step.kitCode}</code>
        </pre>
      </article>

      <div className="mt-3 flex flex-wrap gap-2">
        <button className="term-chip" type="button" onClick={() => setIndex((i) => Math.max(0, i - 1))}>Back</button>
        <button className="term-chip" type="button" onClick={() => setIndex((i) => Math.min(vaultDeepDive.steps.length - 1, i + 1))}>Next</button>
        <button className="term-chip" type="button" onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play Flow"}</button>
        <button className="term-chip" type="button" onClick={() => { setPlaying(false); setIndex(0); }}>Reset</button>
      </div>
    </section>
  );
}
