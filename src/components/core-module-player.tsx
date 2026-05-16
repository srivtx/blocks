"use client";

import { useEffect, useMemo, useState } from "react";
import type { CoreModule } from "@/lib/core-systems";

export function CoreModulePlayer({ module }: { module: CoreModule }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setIndex((i) => {
        if (i >= module.steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 1400);
    return () => clearInterval(t);
  }, [playing, module.steps.length]);

  const step = module.steps[index];
  const progress = useMemo(
    () => Math.round(((index + 1) / module.steps.length) * 100),
    [index, module.steps.length],
  );

  return (
    <article className="lens-item">
      <p className="lens-question">{module.title}</p>
      <p className="lesson-copy mt-1"><strong>Goal:</strong> {module.goal}</p>
      <p className="lesson-copy mt-1"><strong>Why this matters:</strong> {module.whyThisMatters}</p>
      <p className="lesson-copy mt-1"><strong>Reusable in:</strong> {module.reusableIn.join(" | ")}</p>

      <div className="mt-3 rounded-md border border-[var(--line)] bg-[rgba(5,14,26,0.9)] p-3">
        <p className="phase-order">Step Progress: {index + 1}/{module.steps.length} ({progress}%)</p>
        <p className="phase-title mt-1">{step.stage}</p>
        <p className="lesson-copy mt-1"><strong>Actor:</strong> {step.actor}</p>
        <p className="lesson-copy mt-1"><strong>Architecture Reason:</strong> {step.architectureReason}</p>
        <p className="lesson-copy mt-1"><strong>Runtime Action:</strong> {step.runtimeAction}</p>
        <p className="lesson-copy mt-1"><strong>State Before:</strong> {step.stateBefore}</p>
        <p className="lesson-copy mt-1"><strong>State After:</strong> {step.stateAfter}</p>
        <p className="lesson-copy mt-1"><strong>Validator Check:</strong> {step.validatorCheck}</p>
        <pre className="mt-2 overflow-x-auto rounded-md border border-[var(--line)] bg-[rgba(2,10,20,0.95)] p-3 text-xs text-slate-100">
          <code>{step.kitCode}</code>
        </pre>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button className="term-chip" type="button" onClick={() => setIndex((i) => Math.max(0, i - 1))}>Back</button>
        <button className="term-chip" type="button" onClick={() => setIndex((i) => Math.min(module.steps.length - 1, i + 1))}>Next</button>
        <button className="term-chip" type="button" onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play Flow"}</button>
        <button className="term-chip" type="button" onClick={() => { setPlaying(false); setIndex(0); }}>Reset</button>
      </div>

      <details className="mt-3 term-panel">
        <summary className="phase-title cursor-pointer">Prerequisites + Reuse Context</summary>
        <p className="lesson-copy mt-2"><strong>Prerequisites:</strong> {module.prerequisites.join(" | ")}</p>
        <p className="lesson-copy mt-2"><strong>Used again in:</strong> {module.reusableIn.join(" | ")}</p>
      </details>
    </article>
  );
}
