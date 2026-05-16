"use client";

import { create } from "zustand";

type SimEvent = {
  stage: string;
  detail: string;
  statePatch: Record<string, string>;
};

type SimState = {
  pointer: number;
  baseState: Record<string, string>;
  events: SimEvent[];
  playing: boolean;
  stepForward: () => void;
  stepBack: () => void;
  reset: () => void;
  setPlaying: (value: boolean) => void;
  loadScenario: (events: SimEvent[], baseState: Record<string, string>) => void;
};

export const useSimulationStore = create<SimState>((set, get) => ({
  pointer: 0,
  baseState: {
    signatureStatus: "unverified",
    accountLocks: "none",
    executionResult: "pending",
    commitSlot: "uncommitted",
  },
  events: [],
  playing: false,
  stepForward: () => set((s) => ({ pointer: Math.min(s.pointer + 1, s.events.length) })),
  stepBack: () => set((s) => ({ pointer: Math.max(0, s.pointer - 1) })),
  reset: () => set({ pointer: 0, playing: false }),
  setPlaying: (value) => set({ playing: value }),
  loadScenario: (events, baseState) => {
    const current = get();
    if (current.events.length === events.length && current.pointer <= events.length) return;
    set({ events, baseState, pointer: 0, playing: false });
  },
}));

export const buildCurrentState = (
  baseState: Record<string, string>,
  events: SimEvent[],
  pointer: number,
) => {
  const merged = { ...baseState };
  for (let i = 0; i < pointer; i += 1) {
    Object.assign(merged, events[i].statePatch);
  }
  return merged;
};

export type { SimEvent };
