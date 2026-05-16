export type PhaseAssessment = {
  phaseId: string;
  prompt: string;
  requiredKeywords: string[];
};

export const assessments: Record<string, PhaseAssessment> = {
  "foundations-state": { phaseId: "foundations-state", prompt: "Explain why deterministic state transitions are required before distributed consensus.", requiredKeywords: ["state", "deterministic", "replay", "consensus"] },
  "distributed-systems": { phaseId: "distributed-systems", prompt: "Explain how ordering and partitions affect state convergence.", requiredKeywords: ["ordering", "partition", "replica", "converge"] },
  cryptography: { phaseId: "cryptography", prompt: "Explain why local signature verification is required for authorization.", requiredKeywords: ["signature", "authorization", "validator", "local"] },
  bitcoin: { phaseId: "bitcoin", prompt: "Explain how UTXO links prevent invalid state mutation.", requiredKeywords: ["utxo", "unspent", "provenance", "double-spend"] },
  ethereum: { phaseId: "ethereum", prompt: "Explain how gas and ordered execution preserve runtime safety.", requiredKeywords: ["gas", "ordered", "execution", "safety"] },
  solana: { phaseId: "solana", prompt: "Explain how account access declaration enables parallel execution.", requiredKeywords: ["account", "read", "write", "parallel"] },
  "runtime-internals": { phaseId: "runtime-internals", prompt: "Explain why validator stage boundaries must compose deterministically.", requiredKeywords: ["stage", "deterministic", "pipeline", "replay"] },
  pda: { phaseId: "pda", prompt: "Explain why deterministic PDA derivation is needed for protocol state.", requiredKeywords: ["pda", "seeds", "program", "deterministic"] },
  defi: { phaseId: "defi", prompt: "Explain why CPI composition requires invariant and authority checks.", requiredKeywords: ["cpi", "invariant", "authority", "state"] },
  "advanced-architecture": { phaseId: "advanced-architecture", prompt: "Explain a tradeoff between throughput and validator decentralization.", requiredKeywords: ["tradeoff", "throughput", "validator", "decentralization"] },
};

export function evaluateAssessment(answer: string, requiredKeywords: string[]) {
  const normalized = answer.toLowerCase();
  const matched = requiredKeywords.filter((k) => normalized.includes(k.toLowerCase()));
  return {
    passed: matched.length >= Math.max(3, requiredKeywords.length - 1),
    matched,
    missing: requiredKeywords.filter((k) => !matched.includes(k)),
  };
}
