"use client";

import { useMemo, useState } from "react";
import type { QuizQuestion } from "@/lib/quiz-bank";
import { useProgressStore } from "@/lib/progress-store";

export function QuizPanel({ quizId, title, questions }: { quizId: string; title: string; questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [index, setIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const recordQuiz = useProgressStore((s) => s.recordQuiz);
  const best = useProgressStore((s) => s.quizScores[quizId] ?? 0);

  const score = useMemo(() => {
    let correct = 0;
    for (const q of questions) if (answers[q.id] === q.correctIndex) correct += 1;
    return { correct, total: questions.length, pct: questions.length ? Math.round((correct / questions.length) * 100) : 0 };
  }, [answers, questions]);

  const current = questions[index];
  const selected = answers[current.id];
  const answeredCount = Object.keys(answers).length;
  const isLast = index === questions.length - 1;

  const stageLabel = current.difficulty === "foundation" ? "Foundation" : current.difficulty === "applied" ? "Applied" : "Systems";

  return (
    <section className="lens-item mt-4">
      <p className="lens-question">{title}</p>
      <p className="sim-meta mt-1">Progressive mode • Best score: {best}%</p>

      <article className="term-panel mt-3">
        <p className="phase-order">{stageLabel} • Question {index + 1}/{questions.length}</p>
        <p className="phase-title mt-1">{current.prompt}</p>
        <div className="mt-2 grid gap-2">
          {current.options.map((opt, oi) => (
            <label key={opt} className="flex items-start gap-2 text-sm text-slate-200">
              <input
                type="radio"
                name={`${quizId}-${current.id}`}
                checked={selected === oi}
                onChange={() => setAnswers((s) => ({ ...s, [current.id]: oi }))}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
        {selected !== undefined ? (
          <p className="sim-meta mt-2">
            {selected === current.correctIndex ? "Correct." : "Not quite."} {current.explanation}
          </p>
        ) : null}
      </article>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button className="term-chip" type="button" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>Back</button>
        {!isLast ? (
          <button className="term-chip" type="button" onClick={() => setIndex((i) => i + 1)} disabled={selected === undefined}>Next</button>
        ) : (
          <button
            className="term-chip"
            type="button"
            disabled={answeredCount !== questions.length}
            onClick={() => {
              setSubmitted(true);
              recordQuiz(quizId, score.pct);
            }}
          >
            Submit Quiz
          </button>
        )}
        <span className="phase-order">Answered: {answeredCount}/{questions.length}</span>
      </div>

      {submitted ? <p className="phase-order mt-2">Final score: {score.correct}/{score.total} ({score.pct}%)</p> : null}
    </section>
  );
}
