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
      { title: "Why State Must Be Explicit", narrative: ["Computation feels simple until you need to prove why a result happened. If state is implicit, you cannot audit causality.", "Protocol engineering starts with explicit state snapshots and deterministic transition rules."] },
      { title: "Failure In Ad-Hoc Systems", narrative: ["When two operators run the same logic on slightly different local assumptions, outcomes diverge.", "That divergence is tolerable in single-app software, but fatal in consensus systems."] },
      { title: "Constraint That Forces Design", narrative: ["We need a machine where input + prior state always produce the same next state.", "This is the foundation that every validator runtime builds on."] },
    ],
    validatorMentalModel: ["A validator is a deterministic replay machine.", "It does not trust intent text; it trusts transition validity."],
    stateTransitionExercise: ["Given S0(balance=10), tx(-3), produce S1.", "Now replay tx(-3) on S1 and explain whether that is valid or a double-apply."],
    architectureCheckpoints: ["I can explain why implicit state breaks auditability.", "I can describe deterministic transition rules.", "I can explain replay from prior state."],
    codeAfterArchitecture: {
      title: "Minimal deterministic reducer",
      snippet: "type State = { balance: number };\nfunction apply(state: State, delta: number): State {\n  return { balance: state.balance + delta };\n}",
      explanation: "Code is only useful after we understand that the function defines the legal state transition boundary.",
    },
  },
  "distributed-systems": {
    phaseId: "distributed-systems",
    architectureWalkthrough: [
      { title: "Problem: Replicated Machines", narrative: ["A network has many machines, each with delayed views of reality.", "If updates are applied in different orders, state diverges."] },
      { title: "Why Previous Systems Fail", narrative: ["Naive replication assumes instant delivery and honest participants.", "Real networks have partitions, delays, and adversarial actors."] },
      { title: "Forcing Constraint", narrative: ["We need ordered, replayable inputs and fault-tolerant agreement.", "Consensus is not a feature add-on; it is the state convergence engine."] },
    ],
    validatorMentalModel: ["Validators are independent computers executing the same ordered log.", "Agreement is over order and validity, not over intent narratives."],
    stateTransitionExercise: ["Replica A sees tx1 then tx2; Replica B sees tx2 then tx1.", "Explain why deterministic logic still diverges without ordering."],
    architectureCheckpoints: ["I can explain order-dependence in distributed state.", "I can explain why partitions change safety/liveness tradeoffs.", "I can explain what consensus converges on."],
    codeAfterArchitecture: {
      title: "Ordered log replay",
      snippet: "for (const tx of orderedLog) {\n  state = applyTransaction(state, tx);\n}",
      explanation: "The architecture decision is the ordered log; the loop is only its implementation surface.",
    },
  },
  cryptography: {
    phaseId: "cryptography",
    architectureWalkthrough: [
      { title: "Trust Without Central Identity", narrative: ["Open systems cannot rely on a single identity provider.", "Signatures let every validator verify authorization locally."] },
      { title: "Failure Without Signatures", narrative: ["Without cryptographic authentication, ownership is claim-based, not proof-based.", "Any participant could forge state mutation requests."] },
      { title: "Constraint And Tradeoff", narrative: ["Every mutation must carry proof the runtime can verify.", "This adds CPU cost, but removes trust dependency."] },
    ],
    validatorMentalModel: ["Validators verify signatures before execution.", "Invalid authorization must fail before state access."],
    stateTransitionExercise: ["Given a valid transaction payload but wrong signer, predict runtime behavior.", "Explain why deterministic rejection is critical for consensus."],
    architectureCheckpoints: ["I can explain local verification.", "I can explain ownership as key-based authority.", "I can explain deterministic auth failure."],
    codeAfterArchitecture: {
      title: "Signature gate",
      snippet: "if (!verifySignature(message, signature, publicKey)) {\n  throw new Error('unauthorized');\n}",
      explanation: "This is the runtime gate that enforces cryptographic authorization before mutation.",
    },
  },
  bitcoin: {
    phaseId: "bitcoin",
    architectureWalkthrough: [
      { title: "UTXO As Minimal State Machine", narrative: ["Bitcoin tracks spendable outputs, not mutable account objects.", "Each spend references prior outputs and proves authority."] },
      { title: "Why Previous Ledgers Failed", narrative: ["Centralized balance ledgers require trusted operators.", "UTXO shifts verification to cryptographic provenance."] },
      { title: "Constraint And Tradeoff", narrative: ["State must remain auditable output-by-output.", "Programmability is constrained for stronger validation simplicity."] },
    ],
    validatorMentalModel: ["Validator checks whether inputs are unspent and authorized.", "Accepted transaction replaces old outputs with new outputs."],
    stateTransitionExercise: ["Input: output A(5), output B(4). Spend 7 with fee 1.", "Construct valid resulting outputs and explain conservation."],
    architectureCheckpoints: ["I can explain output provenance.", "I can explain double-spend prevention.", "I can explain UTXO tradeoff vs programmability."],
    codeAfterArchitecture: {
      title: "UTXO consume/create",
      snippet: "for (const input of tx.inputs) spendSet.delete(input.ref);\nfor (const output of tx.outputs) spendSet.add(output.id);",
      explanation: "This state change is safe only if input ownership and unspent status were validated first.",
    },
  },
  ethereum: {
    phaseId: "ethereum",
    architectureWalkthrough: [
      { title: "Generalized Runtime", narrative: ["Ethereum introduced programmable contracts with shared global state.", "This enabled complex protocols but increased execution contention."] },
      { title: "Why Earlier Model Was Limiting", narrative: ["UTXO composition for complex logic is cumbersome.", "Generalized execution centralizes logic on-chain."] },
      { title: "Constraint And Tradeoff", narrative: ["All validators must replay bytecode identically.", "Gas and serial ordering bound resource usage and safety."] },
    ],
    validatorMentalModel: ["Validators execute bytecode instruction-by-instruction.", "State root convergence is the safety signal."],
    stateTransitionExercise: ["Two transactions both update same contract variable.", "Explain why order changes output and why total ordering matters."],
    architectureCheckpoints: ["I can explain global state mutation.", "I can explain gas as runtime safety bound.", "I can explain serial execution bottlenecks."],
    codeAfterArchitecture: {
      title: "Gas-bounded execution loop",
      snippet: "while (gasLeft > 0 && pc < bytecode.length) {\n  ({ state, pc, gasLeft } = step(state, pc, gasLeft));\n}",
      explanation: "Gas exists to constrain runtime execution as a consensus safety primitive.",
    },
  },
  solana: {
    phaseId: "solana",
    architectureWalkthrough: [
      { title: "Account-Centric Parallel Runtime", narrative: ["Solana externalizes account read/write sets to enable parallel scheduling.", "Execution scaling comes from explicit state access declaration."] },
      { title: "Failure Mode In Serial Runtimes", narrative: ["Global serialization underutilizes hardware.", "Hot contracts become throughput bottlenecks."] },
      { title: "Constraint And Tradeoff", narrative: ["Developers must reason about account ownership and mutability up front.", "That complexity buys deterministic safe parallelism."] },
    ],
    validatorMentalModel: ["Leader schedules non-conflicting transactions in parallel.", "Validators replay with identical account lock logic."],
    stateTransitionExercise: ["Tx A writes X,Y. Tx B writes Y,Z. Tx C reads X only.", "Which can parallelize and why?"],
    architectureCheckpoints: ["I can explain account lock scheduling.", "I can explain program-account ownership boundaries.", "I can explain why declared access is required."],
    codeAfterArchitecture: {
      title: "Conflict detection",
      snippet: "const conflict = txA.writes.some((acct) => txB.reads.includes(acct) || txB.writes.includes(acct));",
      explanation: "Parallelization is a consequence of explicit access sets, not a runtime guess.",
    },
  },
  "runtime-internals": {
    phaseId: "runtime-internals",
    architectureWalkthrough: [
      { title: "Validator Pipeline", narrative: ["Transaction handling is staged: fetch, verify, schedule, execute, commit.", "Pipelining overlaps work to maximize throughput without violating determinism."] },
      { title: "Why Monolithic Loops Fail", narrative: ["Single-stage processing wastes CPU and increases latency.", "Staging isolates responsibilities and improves observability." ] },
      { title: "Constraint And Tradeoff", narrative: ["Stages must compose deterministically across nodes.", "Pipeline complexity raises debugging difficulty."] },
    ],
    validatorMentalModel: ["Each stage emits artifacts consumed by next stage.", "Any nondeterministic stage output can break consensus replay."],
    stateTransitionExercise: ["If signature verification is skipped for one packet batch, predict downstream failure domain.", "Explain why this is consensus-critical, not just security-critical."],
    architectureCheckpoints: ["I can name pipeline stages and responsibilities.", "I can explain stage composability.", "I can explain deterministic replay across validators."],
    codeAfterArchitecture: {
      title: "Pipeline boundary sketch",
      snippet: "verified = sigverify(batch);\nscheduled = schedule(verified);\nexecuted = execute(scheduled);\ncommit(executed);",
      explanation: "The important part is stage boundaries and deterministic contracts between them.",
    },
  },
  pda: {
    phaseId: "pda",
    architectureWalkthrough: [
      { title: "Program-Controlled Address Space", narrative: ["Protocols need deterministic addresses for discoverable state.", "PDAs provide canonical state locations without private keys."] },
      { title: "Failure Without Deterministic Addressing", narrative: ["Random addresses fragment state discovery and composability.", "Authority becomes hard to reason about across programs."] },
      { title: "Constraint And Tradeoff", narrative: ["Seeds must be carefully designed to avoid collisions and semantic ambiguity.", "Seed strategy becomes part of architecture, not helper code."] },
    ],
    validatorMentalModel: ["Validator re-derives PDA from seeds and program id.", "invoke_signed proves program authority without keypair."],
    stateTransitionExercise: ["Design seed tuple for market-vault-user position.", "Explain how you preserve uniqueness and discoverability."],
    architectureCheckpoints: ["I can explain PDA derivation determinism.", "I can explain signer emulation boundary.", "I can explain seed design as protocol architecture."],
    codeAfterArchitecture: {
      title: "PDA derivation",
      snippet: "const [pda, bump] = findProgramAddressSync([Buffer.from('vault'), userPk.toBuffer()], programId);",
      explanation: "This line encodes a protocol namespace decision; that decision is the real architecture work.",
    },
  },
  defi: {
    phaseId: "defi",
    architectureWalkthrough: [
      { title: "DeFi As Composed State Machines", narrative: ["A DeFi protocol is not one program; it is an authority graph over many state domains.", "CPI composition turns isolated logic into system-wide execution flows."] },
      { title: "Failure In Naive Composition", narrative: ["If invariants are checked only at local call sites, cross-program value leakage appears.", "Authority overreach in one branch can compromise the full protocol." ] },
      { title: "Constraint And Tradeoff", narrative: ["Every CPI path needs explicit invariant and authority boundaries.", "Composability increases power and systemic risk simultaneously."] },
    ],
    validatorMentalModel: ["Validator replays entire CPI call graph, not just root instruction.", "Safety depends on deterministic nested execution and final invariant checks."],
    stateTransitionExercise: ["Swap route A->B->Token changes pool reserves and user balances.", "List invariant checks required before commit."],
    architectureCheckpoints: ["I can explain CPI authority propagation.", "I can explain protocol invariant boundaries.", "I can explain composed transition replay."],
    codeAfterArchitecture: {
      title: "CPI pattern sketch",
      snippet: "invoke_signed(&ix, account_infos, signer_seeds)?;\nassert_invariants(post_state)?;",
      explanation: "The call is easy; the protocol-safe invariant boundary is the real engineering challenge.",
    },
  },
  "advanced-architecture": {
    phaseId: "advanced-architecture",
    architectureWalkthrough: [
      { title: "Owning Tradeoffs Explicitly", narrative: ["Protocol design is a sequence of constrained choices across throughput, safety, and decentralization.", "Each choice changes validator cost, attack surface, and user experience."] },
      { title: "Why Optimizing One Axis Fails", narrative: ["Throughput-only designs often hide validator centralization pressure.", "Safety-only designs can become unusable and fail economically."] },
      { title: "Constraint And Synthesis", narrative: ["Architecture must map each component to causal need and failure containment.", "You are designing systems behavior under adversarial conditions, not just API workflows."] },
    ],
    validatorMentalModel: ["Validator economics are part of architecture correctness.", "Determinism boundaries and state topology shape long-term protocol viability."],
    stateTransitionExercise: ["Given target TPS and validator hardware budget, choose state topology and justify.", "Explain what breaks if you remove one safety component."],
    architectureCheckpoints: ["I can map design choices to constraints.", "I can articulate explicit tradeoff ownership.", "I can reason about validator/runtime impact before writing code."],
    codeAfterArchitecture: {
      title: "Architecture checklist object",
      snippet: "const design = { stateTopology, authorityGraph, invariants, replayCost, failureContainment };",
      explanation: "Code is a record of architectural choices already reasoned through.",
    },
  },
};
