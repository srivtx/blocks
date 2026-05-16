import { phases } from "@/lib/architecture";

export const simulatorUnlockRequirement: Record<string, string> = {
  "tx-flow": "runtime-internals",
  "account-ownership": "solana",
  "memory-state": "foundations-state",
  "block-production": "runtime-internals",
  "parallel-execution": "solana",
  "validator-internals": "runtime-internals",
  "fork-consensus": "runtime-internals",
  "pda-derivation": "pda",
  "cpi-stack": "defi",
};

export function getPhaseIndex(phaseId: string): number {
  return phases.findIndex((p) => p.id === phaseId);
}

export function isPhaseUnlocked(completed: string[], phaseId: string): boolean {
  const idx = getPhaseIndex(phaseId);
  if (idx <= 0) return true;
  const prev = phases[idx - 1];
  return completed.includes(prev.id);
}

export function isSimulatorUnlocked(completed: string[], simulatorId: string): boolean {
  const requiredPhase = simulatorUnlockRequirement[simulatorId];
  if (!requiredPhase) return false;
  return completed.includes(requiredPhase);
}
