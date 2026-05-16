"use client";

import { useEffect, useMemo, useState } from "react";
import type { DefiCaseStudy } from "@/lib/defi-case-studies";

export function DefiCaseWalkthrough({ study }: { study: DefiCaseStudy }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setIndex((i) => {
        if (i >= study.steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 1300);
    return () => clearInterval(t);
  }, [playing, study.steps.length]);

  const step = study.steps[index];
  const progress = useMemo(() => Math.round(((index + 1) / study.steps.length) * 100), [index, study.steps.length]);

  return (
    <article className="lens-item">
      <p className="lens-question">{study.title}</p>
      <p className="lesson-copy mt-2"><strong>Architecture:</strong> {study.architecture}</p>
      <p className="lesson-copy mt-2"><strong>Authority Model:</strong> {study.authorityModel}</p>
      <p className="lesson-copy mt-2"><strong>Accounts Involved:</strong> {study.accountsInvolved.join(" | ")}</p>

      <div className="mt-3 rounded-md border border-[var(--line)] bg-[rgba(5,14,26,0.8)] p-3">
        <p className="phase-order">Execution Progress: {progress}%</p>
        <p className="phase-title mt-1">{step.stage}</p>
        <p className="lesson-copy mt-1"><strong>Actor:</strong> {step.actor}</p>
        <p className="lesson-copy mt-1"><strong>Action:</strong> {step.action}</p>
        <p className="lesson-copy mt-1"><strong>State Delta:</strong> {step.stateDelta}</p>
        <p className="lesson-copy mt-1"><strong>Invariant Checks:</strong> {step.invariantsChecked.join(" | ")}</p>
        <p className="lesson-copy mt-1"><strong>If This Step Is Removed:</strong> {step.ifRemovedBreakage}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button className="term-chip" type="button" onClick={() => setIndex((i) => Math.max(0, i - 1))}>Back</button>
        <button className="term-chip" type="button" onClick={() => setIndex((i) => Math.min(study.steps.length - 1, i + 1))}>Next</button>
        <button className="term-chip" type="button" onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play Flow"}</button>
        <button className="term-chip" type="button" onClick={() => { setPlaying(false); setIndex(0); }}>Reset</button>
        <span className="phase-order self-center">Step {index + 1}/{study.steps.length}</span>
      </div>

      <details className="mt-3 term-panel">
        <summary className="phase-title cursor-pointer">Full Ordered Timeline</summary>
        <ol className="mt-2 grid gap-2">
          {study.steps.map((s, i) => (
            <li key={s.stage} className="lesson-copy"><strong>{i + 1}.</strong> {s.stage} {" -> "} {s.action}</li>
          ))}
        </ol>
      </details>

      <details className="mt-3 term-panel">
        <summary className="phase-title cursor-pointer">What Breaks If Constraints Are Removed</summary>
        <p className="lesson-copy mt-2">{study.failureMode}</p>
      </details>
    </article>
  );
}
