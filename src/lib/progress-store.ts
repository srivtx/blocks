"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProgressState = {
  completedPhases: string[];
  completePhase: (phaseId: string) => void;
  resetProgress: () => void;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedPhases: [],
      completePhase: (phaseId) =>
        set((s) => ({
          completedPhases: s.completedPhases.includes(phaseId)
            ? s.completedPhases
            : [...s.completedPhases, phaseId],
        })),
      resetProgress: () => set({ completedPhases: [] }),
    }),
    { name: "protocol-learning-progress-v1" },
  ),
);
