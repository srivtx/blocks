export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const phaseQuizzes: Record<string, QuizQuestion[]> = {
  "foundations-state": [
    { id: "f1", prompt: "Why is deterministic state transition required?", options: ["Faster UI rendering", "Consensus-safe replay", "Cheaper storage", "Less networking"], correctIndex: 1, explanation: "Validators must replay identical transitions to converge." },
    { id: "f2", prompt: "What breaks first if state transitions are nondeterministic?", options: ["Wallet UX", "Consensus convergence", "Fee market", "RPC cache"], correctIndex: 1, explanation: "Replica outputs diverge and consensus cannot finalize safely." },
  ],
  "distributed-systems": [
    { id: "d1", prompt: "Same tx set, different order across replicas leads to?", options: ["Equivalent state", "Guaranteed finality", "Potential divergence", "Lower latency"], correctIndex: 2, explanation: "Order-dependent transitions can diverge." },
    { id: "d2", prompt: "Consensus primarily establishes shared what?", options: ["UI state", "Transaction ordering + validity", "Programming language", "Hardware profile"], correctIndex: 1, explanation: "Shared order/validity enables deterministic replay." },
  ],
  cryptography: [
    { id: "c1", prompt: "Why verify signatures before execution?", options: ["Compression", "Authorization gate", "Faster gossip", "Fee estimation"], correctIndex: 1, explanation: "Unauthorized mutations must fail before state access." },
  ],
  bitcoin: [
    { id: "b1", prompt: "UTXO state is primarily represented as?", options: ["Mutable balances", "Unspent output set", "Contract heap", "Epoch cache"], correctIndex: 1, explanation: "Bitcoin state is the set of spendable outputs." },
  ],
  ethereum: [
    { id: "e1", prompt: "Gas is chiefly a runtime safety control for?", options: ["Validator branding", "Unbounded computation", "Block timestamps", "Wallet signatures"], correctIndex: 1, explanation: "Gas bounds execution resources deterministically." },
  ],
  solana: [
    { id: "s1", prompt: "Sealevel parallelism depends on explicit?", options: ["GPU type", "Read/write account sets", "MEV relays", "UTXO age"], correctIndex: 1, explanation: "Declared access sets enable deterministic conflict resolution." },
  ],
  "runtime-internals": [
    { id: "r1", prompt: "Validator pipeline stages must compose with what property?", options: ["Randomization", "Determinism", "Compression", "Caching"], correctIndex: 1, explanation: "Any nondeterministic stage output risks replay divergence." },
  ],
  pda: [
    { id: "p1", prompt: "PDAs exist mainly to provide?", options: ["Private key wallets", "Deterministic program-controlled addresses", "Faster signatures", "Cheaper rent"], correctIndex: 1, explanation: "PDAs give canonical address derivation without private keys." },
  ],
  defi: [
    { id: "df1", prompt: "In CPI-heavy systems, critical safety layer is?", options: ["UI retries", "Invariant checks + authority bounds", "RPC fanout", "Token symbols"], correctIndex: 1, explanation: "Composability needs strict invariant and authority enforcement." },
  ],
  "advanced-architecture": [
    { id: "a1", prompt: "Protocol architecture should optimize one axis only?", options: ["Yes", "No, must own tradeoffs", "Only throughput", "Only decentralization"], correctIndex: 1, explanation: "Sustainable protocols explicitly own multi-axis tradeoffs." },
  ],
};

export const simulatorQuizzes: Record<string, QuizQuestion[]> = {
  "tx-flow": [
    { id: "tx1", prompt: "What must happen before state commit?", options: ["UI confirmation", "Signature + execution validation", "Price oracle update", "Fork vote"], correctIndex: 1, explanation: "Commit follows verified auth and deterministic execution." },
  ],
  "cpi-stack": [
    { id: "cp1", prompt: "CPI safety primarily depends on?", options: ["Call depth only", "Invariant checks across call graph", "Token decimals", "RPC speed"], correctIndex: 1, explanation: "Nested calls must preserve invariant boundaries." },
  ],
  "fork-consensus": [
    { id: "fc1", prompt: "Fork convergence is driven by?", options: ["Random choice", "Replay validity + vote weight", "Wallet count", "Slot color"], correctIndex: 1, explanation: "Validators choose valid forks by weighted consensus signals." },
  ],
};
