"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GlossaryInline } from "@/components/glossary-inline";
import type { PhaseLesson } from "@/lib/lesson-content";
import { assessments, evaluateAssessment } from "@/lib/assessments";
import { useProgressStore } from "@/lib/progress-store";
import { phases } from "@/lib/architecture";

export function ArchitectureGate({ lesson, phaseId }: { lesson: PhaseLesson; phaseId: string }) {
  const [checks, setChecks] = useState<boolean[]>(lesson.architectureCheckpoints.map(() => false));
  const [answer, setAnswer] = useState("");
  const completed = useProgressStore((s) => s.completedPhases);
  const completePhase = useProgressStore((s) => s.completePhase);

  const allCheckpointsPassed = useMemo(() => checks.every(Boolean), [checks]);
  const assessment = assessments[phaseId];
  const assessmentResult = useMemo(() => evaluateAssessment(answer, assessment.requiredKeywords), [answer, assessment.requiredKeywords]);
  const masteryPassed = allCheckpointsPassed && assessmentResult.passed;

  const idx = phases.findIndex((p) => p.id === phaseId);
  const nextPhase = idx >= 0 ? phases[idx + 1] : undefined;
  const isComplete = completed.includes(phaseId);

  return (
    <section className="mt-6 grid gap-4">
      {lesson.architectureWalkthrough.map((section) => (
        <article key={section.title} className="lens-item">
          <p className="lens-question">{section.title}</p>
          <div className="mt-1 grid gap-2">
            {section.narrative.map((line, i) => (
              <GlossaryInline key={`${section.title}-${i}`} text={line} />
            ))}
          </div>
        </article>
      ))}

      <article className="lens-item">
        <p className="lens-question">Validator Mental Model</p>
        <div className="mt-1 grid gap-2">
          {lesson.validatorMentalModel.map((line, i) => (
            <GlossaryInline key={`v-${i}`} text={line} />
          ))}
        </div>
      </article>

      <article className="lens-item">
        <p className="lens-question">State Transition Exercise</p>
        <ul className="list-disc pl-5 text-sm text-slate-200">
          {lesson.stateTransitionExercise.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </article>

      <article className="lens-item">
        <p className="lens-question">Architecture Checkpoints (required before code)</p>
        <div className="mt-2 grid gap-2">
          {lesson.architectureCheckpoints.map((cp, idx2) => (
            <label key={cp} className="flex items-start gap-2 text-sm text-slate-200">
              <input
                aria-label={`checkpoint-${idx2 + 1}`}
                type="checkbox"
                checked={checks[idx2]}
                onChange={(e) => {
                  const next = [...checks];
                  next[idx2] = e.target.checked;
                  setChecks(next);
                }}
              />
              <span>{cp}</span>
            </label>
          ))}
        </div>
      </article>

      <article className="lens-item">
        <p className="lens-question">Causal Reasoning Assessment</p>
        <p className="lesson-copy">{assessment.prompt}</p>
        <textarea
          aria-label="assessment-answer"
          className="mt-2 w-full rounded-md border border-[var(--line)] bg-[rgba(5,14,26,0.9)] p-3 text-sm text-slate-100"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your reasoning in your own words..."
        />
        <p className="sim-meta mt-2">Matched concepts: {assessmentResult.matched.join(", ") || "none"}</p>
        {!assessmentResult.passed ? <p className="sim-meta">Missing: {assessmentResult.missing.join(", ")}</p> : null}
      </article>

      <article className="lens-item">
        <p className="lens-question">Code After Architecture</p>
        {!allCheckpointsPassed ? (
          <p className="lesson-copy">Complete all architecture checkpoints to unlock this code view.</p>
        ) : (
          <>
            <p className="phase-title">{lesson.codeAfterArchitecture.title}</p>
            <pre className="mt-2 overflow-x-auto rounded-md border border-[var(--line)] bg-[rgba(4,12,24,0.9)] p-3 text-xs text-slate-100">
              <code>{lesson.codeAfterArchitecture.snippet}</code>
            </pre>
            <p className="lesson-copy mt-2">{lesson.codeAfterArchitecture.explanation}</p>
          </>
        )}
      </article>

      <article className="lens-item">
        <p className="lens-question">Phase Mastery</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="term-chip"
            disabled={!masteryPassed || isComplete}
            onClick={() => completePhase(phaseId)}
          >
            {isComplete ? "Phase Completed" : "Mark Phase Complete"}
          </button>
          {nextPhase ? <Link href={`/learn/${nextPhase.id}`} className="term-chip">Next Phase</Link> : null}
          <Link href="/" className="term-chip">Back To Map</Link>
        </div>
        {!masteryPassed && !isComplete ? (
          <p className="sim-meta mt-2">Complete checkpoints and pass reasoning assessment to unlock completion.</p>
        ) : null}
      </article>
    </section>
  );
}
