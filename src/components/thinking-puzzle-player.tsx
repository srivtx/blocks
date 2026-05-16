"use client";

import { useState } from "react";
import type { ThinkingPuzzle } from "@/lib/thinking-puzzles";

export function ThinkingPuzzlePlayer({ puzzle }: { puzzle: ThinkingPuzzle }) {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <article className="lens-item">
      <p className="lens-question">{puzzle.title}</p>
      <p className="lesson-copy mt-1"><strong>Context:</strong> {puzzle.context}</p>
      <p className="lesson-copy mt-1"><strong>Puzzle:</strong> {puzzle.problem}</p>
      <p className="lesson-copy mt-1"><strong>Constraints:</strong> {puzzle.constraints.join(" | ")}</p>

      <div className="mt-3 term-panel">
        <p className="phase-title">Thinking Workspace</p>
        <p className="lesson-copy mt-1">Write how you would reason before touching code.</p>
        <textarea
          aria-label={`puzzle-${puzzle.id}-answer`}
          className="mt-2 w-full rounded-md border border-[var(--line)] bg-[rgba(5,14,26,0.9)] p-3 text-sm text-slate-100"
          rows={5}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your step-by-step reasoning..."
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button className="term-chip" type="button" onClick={() => setShowHint((v) => !v)}>
          {showHint ? "Hide Hints" : "Show Hints"}
        </button>
        <button className="term-chip" type="button" onClick={() => setShowSolution((v) => !v)}>
          {showSolution ? "Hide Solution" : "Reveal Solution"}
        </button>
      </div>

      {showHint ? (
        <div className="term-panel mt-3">
          <p className="phase-title">Hints</p>
          <ul className="list-disc pl-5 text-sm text-slate-200">
            {puzzle.hints.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {showSolution ? (
        <div className="term-panel mt-3">
          <p className="phase-title">Reference Reasoning Path</p>
          <ol className="list-decimal pl-5 text-sm text-slate-200">
            {puzzle.solution.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p className="phase-title mt-3">Bridge To Implementation</p>
          <ul className="list-disc pl-5 text-sm text-slate-200">
            {puzzle.implementationBridge.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
