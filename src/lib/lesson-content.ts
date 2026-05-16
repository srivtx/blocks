export type LessonSection = {
  title: string;
  narrative: string[];
};

export type PhaseLesson = {
  phaseId: string;
  architectureWalkthrough: LessonSection[];
  validatorMentalModel: string[];
  stateTransitionExercise: string[];
  architectureCheckpoints: string[];
  codeAfterArchitecture: {
    title: string;
    snippet: string;
    explanation: string;
  };
};

export const phaseLessons: Record<string, PhaseLesson> = {
  "foundations-state": {
    phaseId: "foundations-state",
    architectureWalkthrough: [
      {
        title: "The Actual Problem We Are Solving",
        narrative: [
          "Imagine two accountants updating the same ledger. Both receive a transfer request, but one starts from yesterday's balance while the other starts from today's balance.",
          "Both believe they are correct, but they output different balances. The core problem is not math skill. The core problem is missing shared State context.",
          "Phase 1 exists to solve this exact failure: how to make multiple machines produce one provable answer from the same input.",
        ],
      },
      {
        title: "Why Previous Thinking Fails",
        narrative: [
          "Most beginners think a transaction is just an instruction: 'subtract 3'. In distributed systems, that is incomplete.",
          "A transaction is only meaningful relative to Prior State. Without that, 'subtract 3' can be valid, invalid, or double-apply depending on what already happened.",
          "So the old model 'code runs -> output appears' fails. We need 'state snapshot -> deterministic transition -> next snapshot'.",
        ],
      },
      {
        title: "Constraint That Forces The Design",
        narrative: [
          "The system must guarantee: same prior State + same ordered input = same next State on every machine.",
          "This is why we model execution as a state machine, not as loose business logic.",
          "Every later blockchain topic (consensus, validators, runtime, accounts) depends on this constraint being true first.",
        ],
      },
      {
        title: "Before/After Mental Model",
        narrative: [
          "Before: 'Run function and trust result.' After: 'Prove the exact transition from S0 to S1.'",
          "Before: 'Instruction-centric thinking.' After: 'State-transition-centric thinking.'",
          "Before: 'One computer truth.' After: 'Replayable truth across many validators.'",
        ],
      },
    ],
    validatorMentalModel: [
      "A validator is not a calculator; it is a replay verifier. Its job is to confirm that each step from prior State to next State is legal.",
      "A validator does not trust user intent text. It trusts deterministic transition validity under protocol rules.",
      "If replay on two validators gives different outputs, the system is architecturally broken.",
    ],
    stateTransitionExercise: [
      "Case A: S0(balance=10), tx(-3). Compute S1 and explain why this transition is valid.",
      "Case B: Starting from S1, apply tx(-3) again. Is this a new valid transition or accidental double-apply? Explain using state history.",
      "Case C: Validator V1 starts from S0=10, validator V2 starts from S0=7, both apply tx(-3). Compare outputs and explain exactly why consensus would fail.",
    ],
    architectureCheckpoints: [
      "I can clearly state the problem: same instruction can produce different results if prior State differs.",
      "I can explain why transaction meaning is always relative to prior State.",
      "I can explain deterministic rule: same prior State + same ordered input = same next State.",
      "I can explain why validators are replay verifiers, not intent interpreters.",
    ],
    codeAfterArchitecture: {
      title: "Minimal Transition Function (S0 -> S1)",
      snippet:
        "type State = { balance: number; nonce: number };\n\ntype Tx = { delta: number; expectedNonce: number };\n\nfunction applyTransition(prev: State, tx: Tx): State {\n  if (tx.expectedNonce !== prev.nonce) throw new Error(\"invalid ordering/replay\");\n  return { balance: prev.balance + tx.delta, nonce: prev.nonce + 1 };\n}",
      explanation:
        "This is not 'just code'. It encodes architecture: explicit prior state, explicit transition rule, and replay/ordering guard via nonce.",
    },
  },

  "distributed-systems": {
    phaseId: "distributed-systems",
    architectureWalkthrough: [
      {
        title: "Concrete Failure Story",
        narrative: [
          "Replica A receives tx1 then tx2. Replica B receives tx2 then tx1 because of network delay.",
          "Both replicas run correct deterministic logic locally, but they can still end in different state if ordering differs.",
          "So the problem is not bad code. The problem is inconsistent observation order in a distributed network.",
        ],
      },
      {
        title: "Forcing Constraint",
        narrative: [
          "We need a shared ordering and validity process that survives latency, partitions, and failures.",
          "Consensus is the mechanism that transforms many local observations into one canonical execution sequence.",
          "Without that sequence, deterministic transition logic cannot produce convergent state globally.",
        ],
      },
      {
        title: "Tradeoff Introduced",
        narrative: [
          "Stronger agreement guarantees often reduce immediate throughput or liveness windows during faults.",
          "Protocol architecture is now about explicit safety/liveness tradeoffs, not pretending both are always maximal.",
        ],
      },
    ],
    validatorMentalModel: [
      "Validator = independent replayer of the agreed order, not follower of peer trust.",
      "Consensus output is an execution schedule, then runtime applies deterministic state transitions on top.",
    ],
    stateTransitionExercise: [
      "Given balance=10, tx1(-3), tx2(*2): compute final state for order A [tx1,tx2] and order B [tx2,tx1].",
      "Explain why both outputs can be locally correct but globally incompatible.",
      "Define what extra component is required to force one canonical result.",
    ],
    architectureCheckpoints: [
      "I can explain divergence from ordering mismatch.",
      "I can explain why deterministic code alone is insufficient without shared order.",
      "I can explain consensus as state-convergence infrastructure.",
    ],
    codeAfterArchitecture: {
      title: "Canonical Replay Loop",
      snippet: "for (const tx of canonicalOrderedLog) {\n  state = applyTransaction(state, tx);\n}",
      explanation: "The architecture is the canonical log; the loop is just execution of that architecture.",
    },
  },

  cryptography: {
    phaseId: "cryptography",
    architectureWalkthrough: [
      {
        title: "Problem: Open Network Authorization",
        narrative: [
          "In public systems, validators do not know users personally. They only see messages.",
          "Without cryptographic proof, any attacker can claim to be account owner and request state mutation.",
        ],
      },
      {
        title: "Constraint: Local Verifiability",
        narrative: [
          "Every validator must verify authorization independently from message data alone.",
          "This is why signatures are checked before execution, not after mutation.",
        ],
      },
      {
        title: "Tradeoff",
        narrative: [
          "Cryptographic checks add compute overhead, but remove trust dependency on identity intermediaries.",
          "Safety cost is intentional architecture, not overhead accident.",
        ],
      },
    ],
    validatorMentalModel: [
      "Validator treats signature verification as a hard gate into runtime mutation path.",
      "If auth proof fails, transition must fail deterministically for all validators.",
    ],
    stateTransitionExercise: [
      "Given valid payload but wrong signer, predict runtime output and state delta.",
      "Explain why identical rejection across validators is consensus-critical.",
    ],
    architectureCheckpoints: [
      "I can explain local cryptographic authorization.",
      "I can explain why auth checks happen before state mutation.",
      "I can explain deterministic failure path for invalid signatures.",
    ],
    codeAfterArchitecture: {
      title: "Authorization Gate",
      snippet: "if (!verifySignature(message, sig, pubkey)) throw new Error('unauthorized');",
      explanation: "This line encodes trust minimization: proof-based authority before any state change.",
    },
  },

  bitcoin: {
    phaseId: "bitcoin",
    architectureWalkthrough: [
      {
        title: "Why UTXO Exists",
        narrative: [
          "Bitcoin solves value transfer by modeling spendable outputs, not mutable account balances.",
          "Each spend references prior outputs, giving explicit provenance chain for every mutation.",
        ],
      },
      {
        title: "Failure It Avoids",
        narrative: [
          "Centralized balance ledgers hide trust assumptions in operators.",
          "UTXO externalizes validity: validators can prove whether each input is unspent and authorized.",
        ],
      },
      {
        title: "Tradeoff",
        narrative: [
          "Validation clarity is high, but generalized programmability is constrained.",
          "Design chooses robust auditability over expressive contract complexity.",
        ],
      },
    ],
    validatorMentalModel: [
      "Validator verifies input existence in unspent set and signature authority.",
      "Valid tx consumes old outputs and creates new outputs as next state.",
    ],
    stateTransitionExercise: [
      "Inputs: A=5, B=4. Spend 7 with fee 1. Construct valid outputs and explain conservation.",
      "Now attempt spending A again in a later tx. Explain exact rejection condition.",
    ],
    architectureCheckpoints: [
      "I can explain UTXO provenance.",
      "I can explain double-spend prevention as state rule.",
      "I can explain the expressivity vs validation-simplicity tradeoff.",
    ],
    codeAfterArchitecture: {
      title: "Consume / Create Output State",
      snippet: "for (const input of tx.inputs) unspent.delete(input.ref);\nfor (const out of tx.outputs) unspent.add(out.id);",
      explanation: "Only safe when authorization and unspent checks are already proven.",
    },
  },

  ethereum: {
    phaseId: "ethereum",
    architectureWalkthrough: [
      {
        title: "Problem Shift From Bitcoin",
        narrative: [
          "UTXO scripts are too constrained for rich protocol logic.",
          "Ethereum introduces a generalized runtime where contracts mutate shared global state.",
        ],
      },
      {
        title: "Constraint",
        narrative: [
          "All validators must execute bytecode identically and terminate safely.",
          "Gas enforces bounded computation; transaction order defines deterministic state evolution.",
        ],
      },
      {
        title: "Tradeoff",
        narrative: [
          "Shared mutable global state creates contention and serial bottlenecks.",
          "You gain expressivity but face throughput and MEV-driven ordering pressure.",
        ],
      },
    ],
    validatorMentalModel: [
      "Validator replays ordered bytecode execution and compares resulting state root.",
      "Correctness means identical post-state from identical pre-state and tx order.",
    ],
    stateTransitionExercise: [
      "Two txs modify same storage key. Compute outputs under two possible orders.",
      "Explain why ordering policy is architecture, not a minor runtime detail.",
    ],
    architectureCheckpoints: [
      "I can explain account/global-state mutation semantics.",
      "I can explain gas as safety bound.",
      "I can explain serial execution throughput tradeoff.",
    ],
    codeAfterArchitecture: {
      title: "Gas-Bounded VM Step Loop",
      snippet: "while (gasLeft > 0 && pc < code.length) {\n  ({ state, pc, gasLeft } = step(state, pc, gasLeft));\n}",
      explanation: "Bounded step execution is a consensus safety constraint, not optional optimization.",
    },
  },

  solana: {
    phaseId: "solana",
    architectureWalkthrough: [
      {
        title: "Problem: Serial Runtime Throughput Ceiling",
        narrative: [
          "If all transactions execute serially on shared state, hardware parallelism is wasted.",
          "Solana addresses this by making account access explicit so non-conflicting work can run concurrently.",
        ],
      },
      {
        title: "Constraint",
        narrative: [
          "Transactions must declare account read/write sets up front.",
          "Runtime can then deterministically schedule and lock accounts to avoid unsafe parallel writes.",
        ],
      },
      {
        title: "Tradeoff",
        narrative: [
          "Developers carry more state-model responsibility (ownership, mutability, authority graph).",
          "In return, runtime gets safe parallel execution and higher throughput.",
        ],
      },
    ],
    validatorMentalModel: [
      "Validator replays identical lock/schedule decisions from declared account metas.",
      "Parallelism is deterministic because conflicts are explicit, not guessed.",
    ],
    stateTransitionExercise: [
      "TxA writes X,Y. TxB writes Y,Z. TxC reads X only. Decide wave scheduling and justify lock behavior.",
      "Explain which conflicts are write-write vs read-write and why that matters.",
    ],
    architectureCheckpoints: [
      "I can explain account ownership boundaries.",
      "I can explain declared access sets and lock planning.",
      "I can explain why this enables deterministic parallelism.",
    ],
    codeAfterArchitecture: {
      title: "Conflict Detection Primitive",
      snippet: "const conflict = a.writes.some((k) => b.writes.includes(k) || b.reads.includes(k));",
      explanation: "This derives from architecture: explicit access declaration before execution.",
    },
  },

  "runtime-internals": {
    phaseId: "runtime-internals",
    architectureWalkthrough: [
      {
        title: "Why Pipeline Exists",
        narrative: [
          "A monolithic validator loop underuses hardware and raises latency.",
          "Runtime internals split processing into fetch, verify, schedule, execute, replay, and vote stages.",
        ],
      },
      {
        title: "Constraint",
        narrative: [
          "Each stage must produce deterministic artifacts for downstream stages across all validators.",
          "Any stage-level nondeterminism leaks into replay mismatch and consensus failure.",
        ],
      },
      {
        title: "Tradeoff",
        narrative: [
          "Pipeline raises implementation complexity and observability demands.",
          "But it is necessary for throughput while preserving deterministic equivalence.",
        ],
      },
    ],
    validatorMentalModel: [
      "Validator is a staged deterministic machine, not one giant function.",
      "Stage contract integrity determines replay equivalence.",
    ],
    stateTransitionExercise: [
      "If sigverify is bypassed for a packet batch, trace downstream effects through execution and vote stages.",
      "Explain why this is both security and consensus correctness failure.",
    ],
    architectureCheckpoints: [
      "I can name pipeline stages and their outputs.",
      "I can explain stage composability constraints.",
      "I can explain replay equivalence risk from stage nondeterminism.",
    ],
    codeAfterArchitecture: {
      title: "Staged Runtime Skeleton",
      snippet: "verified = sigverify(batch);\nscheduled = schedule(verified);\nexecuted = execute(scheduled);\ncommit(executed);\nvote(replay(executed));",
      explanation: "The architecture is in the stage boundaries and contracts between them.",
    },
  },

  pda: {
    phaseId: "pda",
    architectureWalkthrough: [
      {
        title: "Why PDAs Exist",
        narrative: [
          "Protocols need canonical addresses for discoverable, program-controlled state.",
          "Random addresses make composition and authority tracing brittle.",
        ],
      },
      {
        title: "Constraint",
        narrative: [
          "Address derivation must be deterministic from seeds + program id.",
          "Runtime must verify signer authority through invoke_signed without private keys.",
        ],
      },
      {
        title: "Tradeoff",
        narrative: [
          "Seed schema design becomes a hard architecture decision with long-term compatibility impact.",
          "Bad seed design causes namespace ambiguity and migration pain.",
        ],
      },
    ],
    validatorMentalModel: [
      "Validator re-derives PDA exactly and checks signer emulation validity.",
      "Authority is proven by derivation correctness, not hidden keys.",
    ],
    stateTransitionExercise: [
      "Design seeds for market + vault + user position. Explain uniqueness and discoverability.",
      "What breaks if seed schema changes after deployment?",
    ],
    architectureCheckpoints: [
      "I can explain deterministic derivation purpose.",
      "I can explain invoke_signed authority model.",
      "I can explain seed schema as protocol namespace architecture.",
    ],
    codeAfterArchitecture: {
      title: "Deterministic PDA Derivation",
      snippet: "const [pda, bump] = findProgramAddressSync([Buffer.from('vault'), userPk.toBuffer()], programId);",
      explanation: "This line reflects a namespace design decision, not a utility call.",
    },
  },

  defi: {
    phaseId: "defi",
    architectureWalkthrough: [
      {
        title: "System View",
        narrative: [
          "DeFi is not one contract. It is a composed network of state machines linked by CPI and authority graphs.",
          "A swap, borrow, or liquidation is a multi-account, multi-program state transition pipeline.",
        ],
      },
      {
        title: "Failure Mode",
        narrative: [
          "Local checks can pass while global protocol invariants fail across nested calls.",
          "This is how value leakage, insolvency drift, and authority overreach appear.",
        ],
      },
      {
        title: "Constraint And Tradeoff",
        narrative: [
          "Every CPI edge must preserve explicit authority boundaries and post-state invariants.",
          "Composability increases capability and systemic risk together.",
        ],
      },
    ],
    validatorMentalModel: [
      "Validator replays full CPI call graph and post-state effects, not just root instruction.",
      "Protocol safety is deterministic composition of nested transitions.",
    ],
    stateTransitionExercise: [
      "Trace swap -> borrow -> collateral update path and list invariant checks per boundary.",
      "Identify one local-pass/global-fail scenario and explain how to catch it.",
    ],
    architectureCheckpoints: [
      "I can explain CPI authority propagation.",
      "I can explain global invariant boundaries.",
      "I can explain composed-state replay requirements.",
    ],
    codeAfterArchitecture: {
      title: "CPI + Invariant Boundary",
      snippet: "invoke_signed(&ix, accounts, signerSeeds)?;\nassert_global_invariants(postState)?;",
      explanation: "The important part is invariant boundary design around composed execution.",
    },
  },

  "advanced-architecture": {
    phaseId: "advanced-architecture",
    architectureWalkthrough: [
      {
        title: "Final Design Reality",
        narrative: [
          "Protocol architecture is tradeoff ownership across throughput, safety, and decentralization economics.",
          "You are not selecting APIs. You are selecting failure modes and who pays their cost.",
        ],
      },
      {
        title: "Common Failure",
        narrative: [
          "Optimizing one metric blindly (TPS, UX, cost) pushes hidden fragility elsewhere.",
          "Robust design requires explicit mapping from each decision to runtime and validator consequences.",
        ],
      },
      {
        title: "Constraint",
        narrative: [
          "Every architectural component must answer: what failure does it prevent, and what breaks if removed?",
          "If you cannot answer that, the component is not yet justified.",
        ],
      },
    ],
    validatorMentalModel: [
      "Validator cost profile is part of protocol correctness, not an operations afterthought.",
      "Determinism boundaries and state topology define long-term survivability.",
    ],
    stateTransitionExercise: [
      "Choose state topology for target throughput and validator budget. Justify tradeoffs.",
      "Remove one safety component and trace concrete breakage chain.",
    ],
    architectureCheckpoints: [
      "I can map choices to constraints and failure containment.",
      "I can articulate explicit tradeoff ownership.",
      "I can reason about runtime and validator impacts before code.",
    ],
    codeAfterArchitecture: {
      title: "Architecture Decision Surface",
      snippet: "const design = { stateTopology, authorityGraph, invariants, replayCost, validatorCostFloor, failureContainment };",
      explanation: "Code records architecture choices that were reasoned causally first.",
    },
  },
};
