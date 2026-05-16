"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProgressState = {
  completedPhases: string[];
  quizScores: Record<string, number>;
  completePhase: (phaseId: string) => void;
  recordQuiz: (quizId: string, scorePct: number) => void;
  resetProgress: () => void;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedPhases: [],
      quizScores: {},
      completePhase: (phaseId) =>
        set((s) => ({
          completedPhases: s.completedPhases.includes(phaseId)
            ? s.completedPhases
            : [...s.completedPhases, phaseId],
        })),
      recordQuiz: (quizId, scorePct) =>
        set((s) => ({
          quizScores: {
            ...s.quizScores,
            [quizId]: Math.max(s.quizScores[quizId] ?? 0, scorePct),
          },
        })),
      resetProgress: () => set({ completedPhases: [], quizScores: {} }),
    }),
    { name: "protocol-learning-progress-v1" },
  ),
);
