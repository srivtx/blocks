"use client";

import { useMemo, useState } from "react";
import type { QuizQuestion } from "@/lib/quiz-bank";
import { useProgressStore } from "@/lib/progress-store";

export function QuizPanel({ quizId, title, questions }: { quizId: string; title: string; questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const recordQuiz = useProgressStore((s) => s.recordQuiz);
  const best = useProgressStore((s) => s.quizScores[quizId] ?? 0);

  const score = useMemo(() => {
    let correct = 0;
    for (const q of questions) if (answers[q.id] === q.correctIndex) correct += 1;
    return { correct, total: questions.length, pct: questions.length ? Math.round((correct / questions.length) * 100) : 0 };
  }, [answers, questions]);

  const canSubmit = Object.keys(answers).length === questions.length;

  return (
    <section className="lens-item mt-4">
      <p className="lens-question">{title}</p>
      <p className="sim-meta mt-1">Best score: {best}%</p>
      <div className="mt-3 grid gap-3">
        {questions.map((q, idx) => (
          <article key={q.id} className="term-panel">
            <p className="phase-title">Q{idx + 1}. {q.prompt}</p>
            <div className="mt-2 grid gap-2">
              {q.options.map((opt, oi) => (
                <label key={opt} className="flex items-start gap-2 text-sm text-slate-200">
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === oi}
                    onChange={() => setAnswers((s) => ({ ...s, [q.id]: oi }))}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {submitted ? <p className="sim-meta mt-2">{q.explanation}</p> : null}
          </article>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          className="term-chip"
          type="button"
          disabled={!canSubmit}
          onClick={() => {
            setSubmitted(true);
            recordQuiz(quizId, score.pct);
          }}
        >
          Submit Quiz
        </button>
        {submitted ? <span className="phase-order">Score: {score.correct}/{score.total} ({score.pct}%)</span> : null}
      </div>
    </section>
  );
}
