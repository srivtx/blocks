export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "foundation" | "applied" | "systems";
};

function q(
  id: string,
  difficulty: QuizQuestion["difficulty"],
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
): QuizQuestion {
  return { id, difficulty, prompt, options, correctIndex, explanation };
}

function buildDrills(prefix: string, rows: Array<{ prompt: string; correct: string; distractors: string[]; explanation: string; difficulty: QuizQuestion["difficulty"] }>) {
  return rows.map((r, i) => {
    const options = [r.correct, ...r.distractors].slice(0, 4);
    return q(`${prefix}-d${i + 1}`, r.difficulty, r.prompt, options, 0, r.explanation);
  });
}

export const phaseQuizzes: Record<string, QuizQuestion[]> = {
  "foundations-state": [
    q("f1", "foundation", "Why is deterministic state transition required?", ["Faster UI rendering", "Consensus-safe replay", "Cheaper storage", "Less networking"], 1, "Validators must replay identical transitions to converge."),
    q("f2", "foundation", "State transition means:", ["Any random mutation", "From prior state + input to next state", "Only UI change", "Only mempool update"], 1, "Formal state evolution is the core model."),
    q("f3", "applied", "If validators start from different prior state, same tx gives:", ["Always same output", "Potentially different output", "No output", "Automatic rollback"], 1, "Determinism assumes same prior state."),
    q("f4", "systems", "What breaks first without deterministic transitions?", ["Consensus convergence", "Wallet branding", "RPC logs", "Explorer theme"], 0, "Convergence depends on reproducibility."),
    ...buildDrills("f", [
      { difficulty: "applied", prompt: "Constraint forcing this design is:", correct: "Replay equivalence", distractors: ["Color consistency", "Faster CSS", "Lower RPC count"], explanation: "Consensus requires equivalent replay." },
      { difficulty: "systems", prompt: "State machine thinking helps primarily with:", correct: "Causal auditability", distractors: ["Logo design", "Domain names", "Ad targeting"], explanation: "You can reason why output changed." },
      { difficulty: "applied", prompt: "Prior-state mismatch across validators creates:", correct: "Divergent next states", distractors: ["Guaranteed finality", "Lower compute", "No signatures"], explanation: "Different input context yields different outputs." },
      { difficulty: "systems", prompt: "Architecture-before-code at this phase means:", correct: "Define legal transitions first", distractors: ["Write SDK first", "Choose theme first", "Optimize cache first"], explanation: "Rules precede implementation." },
      { difficulty: "foundation", prompt: "Determinism + ordering + same prior state yields:", correct: "Convergent output", distractors: ["Random output", "Nonstop forks", "No execution"], explanation: "That triad enables consensus." },
      { difficulty: "systems", prompt: "Removing transition constraints mainly risks:", correct: "Undebuggable consensus failure", distractors: ["Better UX", "Lower runtime checks", "Smaller signatures"], explanation: "You lose causal guarantees." },
    ]),
  ],
  "distributed-systems": [
    q("d1", "foundation", "Same tx set, different order across replicas leads to?", ["Equivalent state", "Guaranteed finality", "Potential divergence", "Lower latency"], 2, "Order-dependent transitions can diverge."),
    q("d2", "foundation", "Consensus primarily establishes shared:", ["UI layout", "Ordering + validity", "Programming language", "Hardware profile"], 1, "Shared order/validity enables replay."),
    q("d3", "applied", "During partition, safety-oriented designs prioritize:", ["Unlimited writes", "Deterministic conflict handling", "Ignoring signatures", "Manual merge"], 1, "Fault-aware safety first."),
    q("d4", "systems", "Replication architecture goal is:", ["Perfect speed", "Convergent state under faults", "No validators", "No ordering"], 1, "Convergence under failures."),
    ...buildDrills("d", [
      { difficulty: "applied", prompt: "Network delay primarily affects:", correct: "Per-node view of order", distractors: ["Signature math", "Hash function", "Program ownership"], explanation: "Nodes observe events at different times." },
      { difficulty: "systems", prompt: "Without ordering guarantees, replicas can:", correct: "Legally diverge", distractors: ["Always match", "Skip validation", "Auto-finalize"], explanation: "Order-sensitive transitions differ." },
      { difficulty: "foundation", prompt: "Partition tolerance tradeoff often touches:", correct: "Safety vs liveness windows", distractors: ["Font stack", "Compiler version", "Wallet icon"], explanation: "Distributed systems constraints are real." },
      { difficulty: "applied", prompt: "Deterministic replay requires:", correct: "Same ordered input stream", distractors: ["Same UI", "Same SSD brand", "Same timezone"], explanation: "Ordering is part of input." },
      { difficulty: "systems", prompt: "Consensus disagreement usually indicates:", correct: "Replay/input mismatch", distractors: ["Color theme issue", "Missing docs", "Slow homepage"], explanation: "Nodes differ in validity/order processing." },
      { difficulty: "systems", prompt: "Scalability pressure introduces:", correct: "Coordination complexity", distractors: ["No trust issues", "No faults", "No tradeoffs"], explanation: "More nodes increase coordination cost." },
    ]),
  ],
  cryptography: [
    q("c1", "foundation", "Why verify signatures before execution?", ["Compression", "Authorization gate", "Faster gossip", "Fee estimation"], 1, "Unauthorized mutations must fail first."),
    q("c2", "applied", "Invalid signature but valid logic should:", ["Execute anyway", "Reject deterministically", "Ask user retry", "Defer to leader"], 1, "Authorization failure is terminal."),
    q("c3", "systems", "Crypto checks remove dependence on:", ["Determinism", "Trusted identity intermediary", "State machine", "Consensus"], 1, "Validators verify locally."),
    ...buildDrills("c", [
      { difficulty: "foundation", prompt: "Public key ownership enables:", correct: "Verifiable mutation authority", distractors: ["Unlimited writes", "No signatures", "No replay"], explanation: "Ownership is cryptographically anchored." },
      { difficulty: "applied", prompt: "If signer mismatch occurs, runtime should:", correct: "Abort mutation path", distractors: ["Commit anyway", "Fork chain", "Retry silently"], explanation: "Security and consensus align here." },
      { difficulty: "systems", prompt: "Cryptography in validators is mainly:", correct: "Local truth verification", distractors: ["UI encryption", "Theme control", "Caching strategy"], explanation: "Trust minimization through proof." },
      { difficulty: "applied", prompt: "Hash-linked data primarily guarantees:", correct: "Integrity evidence", distractors: ["Faster execution", "Lower gas", "Higher TVL"], explanation: "Tampering becomes detectable." },
      { difficulty: "systems", prompt: "Without cryptographic auth, open networks become:", correct: "Permissionless forgery surfaces", distractors: ["More deterministic", "Less adversarial", "Faster finality"], explanation: "Any actor can claim authority." },
    ]),
  ],
  bitcoin: [
    q("b1", "foundation", "UTXO state is represented as:", ["Mutable balances", "Unspent output set", "Contract heap", "Epoch cache"], 1, "Bitcoin tracks spendable outputs."),
    q("b2", "applied", "Double-spend prevention relies on:", ["Random validator choice", "Input references to unspent outputs", "UI lock", "Gas refund"], 1, "Inputs must reference currently unspent outputs."),
    q("b3", "systems", "Bitcoin tradeoff vs generalized VM:", ["Higher expressivity", "Simpler validation model", "No cryptography", "No state"], 1, "Constrained scripting simplifies validation."),
    ...buildDrills("b", [
      { difficulty: "foundation", prompt: "Spending an output does what to state?", correct: "Removes it from unspent set", distractors: ["Duplicates it", "Ignores it", "Encrypts UI"], explanation: "Consumed outputs cannot be spent again." },
      { difficulty: "applied", prompt: "New outputs in a transaction are:", correct: "Future spendable state", distractors: ["Irrelevant metadata", "Consensus votes", "Program ids"], explanation: "They form next spend opportunities." },
      { difficulty: "systems", prompt: "Why UTXO is audit-friendly:", correct: "Provenance chain is explicit", distractors: ["No signatures needed", "No validation needed", "No ordering"], explanation: "Lineage is explicit per output." },
      { difficulty: "applied", prompt: "If input already spent, validator should:", correct: "Reject transaction", distractors: ["Queue for later", "Auto-repair", "Mint new output"], explanation: "Double-spend invalidates tx." },
      { difficulty: "systems", prompt: "Constraint that shaped Bitcoin model:", correct: "Trust-minimized value transfer", distractors: ["Rich contract UX", "Parallel VM calls", "PDA derivation"], explanation: "Design favors robust verification." },
    ]),
  ],
  ethereum: [
    q("e1", "foundation", "Gas is chiefly a runtime safety control for:", ["Validator branding", "Unbounded computation", "Block timestamps", "Wallet signatures"], 1, "Gas bounds execution resources."),
    q("e2", "applied", "Two txs writing same storage slot require:", ["Parallel no order", "Deterministic ordering", "No validation", "Different chain"], 1, "Shared mutable state is order-sensitive."),
    q("e3", "systems", "Global serial execution primarily limits:", ["Determinism", "Throughput scalability", "Signature validity", "Finality concept"], 1, "Serialization constrains parallelism."),
    ...buildDrills("e", [
      { difficulty: "foundation", prompt: "Account-based model centers on:", correct: "Mutable global state", distractors: ["UTXO-only outputs", "No storage", "No ordering"], explanation: "Contracts mutate storage under order." },
      { difficulty: "applied", prompt: "Gas exhaustion during execution means:", correct: "Execution halts by runtime rule", distractors: ["Infinite loop continues", "Consensus skips tx", "No fee cost"], explanation: "Resource bounds are enforced." },
      { difficulty: "systems", prompt: "Why deterministic opcodes matter:", correct: "State root convergence", distractors: ["UI consistency", "Logo rendering", "RPC pagination"], explanation: "Consensus depends on identical opcode semantics." },
      { difficulty: "applied", prompt: "Order swap of dependent txs can cause:", correct: "Different final state", distractors: ["Same guaranteed state", "No execution", "Faster block time"], explanation: "Dependencies are order-sensitive." },
      { difficulty: "systems", prompt: "Ethereum solved which Bitcoin limitation?", correct: "Generalized on-chain programmability", distractors: ["Removed cryptography", "Removed consensus", "Removed state"], explanation: "It generalized execution capabilities." },
    ]),
  ],
  solana: [
    q("s1", "foundation", "Sealevel parallelism depends on explicit:", ["GPU type", "Read/write account sets", "MEV relays", "UTXO age"], 1, "Declared access sets enable deterministic scheduling."),
    q("s2", "applied", "TxA writes X,Y and TxB writes Y,Z. They should:", ["Always parallelize", "Conflict on Y", "Bypass locks", "Auto-merge"], 1, "Shared write target creates conflict."),
    q("s3", "systems", "Architecture cost behind Solana throughput:", ["Less account reasoning", "More explicit account/authority reasoning", "No runtime checks", "No validators"], 1, "Developer explicitness enables runtime parallelism."),
    ...buildDrills("s", [
      { difficulty: "foundation", prompt: "Account owner governs:", correct: "Who may mutate data", distractors: ["Who may view docs", "Who may set CSS", "Who may change URL"], explanation: "Ownership bounds write authority." },
      { difficulty: "applied", prompt: "Scheduler defers a tx when:", correct: "Its locks conflict with active wave", distractors: ["Its UI is slow", "Its signer is rich", "Its slot is even"], explanation: "Conflict-safe execution is mandatory." },
      { difficulty: "systems", prompt: "Sealevel determinism relies on:", correct: "Declared access + consistent lock rules", distractors: ["Random lane assignment", "Optimistic ignoring conflicts", "Off-chain sort"], explanation: "Parallel safety comes from explicit constraints." },
      { difficulty: "applied", prompt: "Program may directly write which accounts?", correct: "Accounts it owns", distractors: ["Any account in block", "All signer accounts", "All token accounts"], explanation: "Owner check gates mutations." },
      { difficulty: "systems", prompt: "Why this model scales better:", correct: "Non-conflicting txs run concurrently", distractors: ["No signatures", "No validation", "No consensus"], explanation: "Concurrency with safety improves throughput." },
    ]),
  ],
  "runtime-internals": [
    q("r1", "foundation", "Validator pipeline stages must compose with:", ["Randomization", "Determinism", "Compression", "Caching"], 1, "Nondeterministic stage outputs break replay."),
    q("r2", "applied", "Skipping sigverify in one stage causes:", ["Minor UI issue", "Potential invalid state transitions", "Faster consensus", "Lower replay cost"], 1, "Invalid auth can enter execution path."),
    q("r3", "systems", "Pipeline architecture exists to:", ["Reduce validators", "Overlap work while preserving replay equivalence", "Avoid signatures", "Bypass scheduling"], 1, "Throughput gains must preserve safety."),
    ...buildDrills("r", [
      { difficulty: "foundation", prompt: "Fetch stage responsibility:", correct: "Ingest packet data", distractors: ["Finalize votes", "Derive PDAs", "Run UI"], explanation: "Data ingress precedes verify." },
      { difficulty: "applied", prompt: "Replay stage validates:", correct: "Fork execution consistency", distractors: ["Theme files", "Wallet names", "API docs"], explanation: "Replay confirms execution correctness." },
      { difficulty: "systems", prompt: "Stage boundary contracts protect:", correct: "Cross-validator equivalence", distractors: ["Code style", "Branding", "Indexing speed only"], explanation: "Deterministic contracts between stages matter." },
      { difficulty: "applied", prompt: "Vote stage depends on:", correct: "Validated replay outcome", distractors: ["First packet seen", "Largest UI", "Fastest RPC"], explanation: "Votes should follow valid execution." },
      { difficulty: "systems", prompt: "Pipeline complexity tradeoff:", correct: "Higher throughput, harder observability", distractors: ["Lower throughput, no tradeoff", "No determinism", "No validation"], explanation: "Performance vs complexity is explicit." },
    ]),
  ],
  pda: [
    q("p1", "foundation", "PDAs provide:", ["Private key wallets", "Deterministic program-controlled addresses", "Faster signatures", "Cheaper rent"], 1, "PDAs create canonical state addresses."),
    q("p2", "applied", "Same seeds + same program id should produce:", ["Random address", "Same PDA", "Different PDA per validator", "No address"], 1, "Derivation is deterministic."),
    q("p3", "systems", "Poor seed design primarily risks:", ["Better UX", "State namespace ambiguity/collision pressure", "No authority checks", "No CPI"], 1, "Seed schema is protocol architecture."),
    ...buildDrills("p", [
      { difficulty: "foundation", prompt: "invoke_signed proves:", correct: "Program-derived authority", distractors: ["Human wallet signature", "No authority", "Random authority"], explanation: "Runtime verifies seed-based authority." },
      { difficulty: "applied", prompt: "Bump exists to:", correct: "Find valid off-curve PDA", distractors: ["Increase fees", "Lower rent", "Skip seeds"], explanation: "Bump helps derive legal PDA." },
      { difficulty: "systems", prompt: "PDA determinism is crucial for:", correct: "Composable state discovery", distractors: ["Theme consistency", "RPC vendor lock", "Token icon size"], explanation: "Protocols must find canonical state." },
      { difficulty: "applied", prompt: "Changing seed schema later can break:", correct: "Address compatibility", distractors: ["Hash security", "Consensus math", "Signature alg"], explanation: "Namespace stability is architectural." },
      { difficulty: "systems", prompt: "PDA design is primarily:", correct: "State topology design", distractors: ["Frontend utility", "Dev-only helper", "Optional cosmetic"], explanation: "It shapes protocol storage semantics." },
    ]),
  ],
  defi: [
    q("df1", "foundation", "In CPI-heavy systems, critical safety layer is:", ["UI retries", "Invariant checks + authority bounds", "RPC fanout", "Token symbols"], 1, "Composability needs strict invariant/authority checks."),
    q("df2", "applied", "After nested CPI flow, root program should:", ["Skip checks", "Run post-state invariant validation", "Only log success", "Reset balances"], 1, "Final invariants protect protocol safety."),
    q("df3", "systems", "Composability increases:", ["Only UX", "Power and blast radius", "Only fee savings", "Only validator count"], 1, "Composition increases systemic coupling."),
    ...buildDrills("df", [
      { difficulty: "foundation", prompt: "Authority graph describes:", correct: "Who can mutate what state", distractors: ["Who owns domain", "Who writes docs", "Who picks colors"], explanation: "Authority mapping is core safety surface." },
      { difficulty: "applied", prompt: "Missing oracle freshness checks risks:", correct: "Undercollateralized actions", distractors: ["Better liquidity", "Deterministic gains", "Cheaper signatures"], explanation: "Stale inputs break risk controls." },
      { difficulty: "systems", prompt: "Invariant checks should run:", correct: "At boundaries and post-composition", distractors: ["Only in UI", "Only once at deploy", "Never in runtime"], explanation: "Composition requires repeated checks." },
      { difficulty: "applied", prompt: "CPI call depth matters because:", correct: "More frames increase failure coupling", distractors: ["It changes token symbol", "It removes consensus", "It speeds hashing"], explanation: "Nested paths expand risk surface." },
      { difficulty: "systems", prompt: "Protocol-level failure containment means:", correct: "Localizing bad transitions before commit", distractors: ["Hiding logs", "Disabling votes", "Skipping ownership checks"], explanation: "Containment is architectural safety." },
    ]),
  ],
  "advanced-architecture": [
    q("a1", "foundation", "Protocol architecture should optimize one axis only?", ["Yes", "No, must own tradeoffs", "Only throughput", "Only decentralization"], 1, "Sustainable protocols own multi-axis tradeoffs."),
    q("a2", "applied", "Throughput gain that raises validator hardware floor may hurt:", ["Color theme", "Decentralization", "Hashing", "Account ownership"], 1, "Higher cost can centralize validator set."),
    q("a3", "systems", "Best architecture practice is mapping components to:", ["Trendiness", "Constraint and failure containment", "Code style", "Marketing"], 1, "Design must be causally justified."),
    ...buildDrills("a", [
      { difficulty: "foundation", prompt: "Architecture-before-code means:", correct: "Define system behavior before implementation", distractors: ["Ship code then reason", "Skip tradeoffs", "Ignore validators"], explanation: "Model first, code second." },
      { difficulty: "applied", prompt: "Removing one safety component should be tested by:", correct: "Breakage scenario analysis", distractors: ["Color A/B test", "Logo voting", "RPC benchmark only"], explanation: "You must know failure impact." },
      { difficulty: "systems", prompt: "Validator cost profile impacts:", correct: "Long-term decentralization viability", distractors: ["Only syntax", "Only docs", "Only UX copy"], explanation: "Economics shape network structure." },
      { difficulty: "applied", prompt: "State topology decisions influence:", correct: "Scalability and fault domains", distractors: ["Font families", "Explorer name", "Seed phrase length"], explanation: "Topology determines system behavior." },
      { difficulty: "systems", prompt: "Protocol maturity requires:", correct: "Explicit tradeoff ownership", distractors: ["Copy-paste patterns", "No constraints", "No threat model"], explanation: "Clarity beats accidental design." },
    ]),
  ],
};

export const simulatorQuizzes: Record<string, QuizQuestion[]> = {
  "tx-flow": [
    q("tx1", "foundation", "What must happen before state commit?", ["UI confirmation", "Signature + execution validation", "Price oracle update", "Fork vote"], 1, "Commit follows verified auth and deterministic execution."),
    q("tx2", "applied", "If account locks conflict, scheduler should:", ["Ignore and run", "Serialize/defer conflicting tx", "Drop all tx", "Restart chain"], 1, "Conflict handling preserves deterministic correctness."),
    q("tx3", "systems", "Tx flow architecture transforms:", ["UI actions into visuals", "Signed intent into canonical state", "RPC calls into DNS", "Blocks into wallets"], 1, "Runtime maps authenticated intent to consensus state."),
    ...buildDrills("tx", [
      { difficulty: "foundation", prompt: "Ingress stage primarily does:", correct: "Accept transaction packets", distractors: ["Finalize votes", "Derive PDAs", "Mint tokens"], explanation: "Packets arrive before deeper checks." },
      { difficulty: "applied", prompt: "Signature failure should cause:", correct: "Deterministic rejection", distractors: ["Auto commit", "UI retry only", "Fork vote"], explanation: "Auth must fail early." },
      { difficulty: "applied", prompt: "Account lock planning enables:", correct: "Safe scheduling", distractors: ["Random order", "Skip validation", "No replay"], explanation: "Locks bound conflict domains." },
      { difficulty: "systems", prompt: "Commit stage requires:", correct: "Validated transition delta", distractors: ["Unverified packet", "Random hash", "Theme state"], explanation: "Only verified outcomes commit." },
      { difficulty: "systems", prompt: "Replay by other validators checks:", correct: "Execution equivalence", distractors: ["Wallet balances only", "CSS parity", "Host region"], explanation: "Consensus needs replay equivalence." },
    ]),
  ],
  "cpi-stack": [
    q("cp1", "foundation", "CPI safety primarily depends on?", ["Call depth only", "Invariant checks across call graph", "Token decimals", "RPC speed"], 1, "Nested calls must preserve invariants."),
    q("cp2", "applied", "Authority propagation in CPI should be:", ["Implicit and broad", "Explicit and bounded", "Skipped", "Randomized"], 1, "Scoped authority reduces blast radius."),
    q("cp3", "systems", "Removing post-CPI invariant checks risks:", ["Better safety", "Silent value leakage", "Faster consensus only", "No effect"], 1, "Cross-program drift can bypass assumptions."),
    ...buildDrills("cp", [
      { difficulty: "foundation", prompt: "Root instruction in CPI stack does:", correct: "Initiates composed execution", distractors: ["Skips runtime", "Disables signatures", "Bypasses ownership"], explanation: "Root call starts chain." },
      { difficulty: "applied", prompt: "Nested token transfer should be validated by:", correct: "Authority + account scope checks", distractors: ["UI metadata", "Color hints", "Slot parity"], explanation: "Runtime authorization is mandatory." },
      { difficulty: "applied", prompt: "Frame unwind should include:", correct: "Post-state verification", distractors: ["Ignoring state", "No checks", "Blind commit"], explanation: "Unwind isn’t safety bypass." },
      { difficulty: "systems", prompt: "Composed protocols fail when:", correct: "Local checks ignore global invariants", distractors: ["There are many docs", "Too many users", "Bright colors"], explanation: "Global invariants must hold." },
      { difficulty: "systems", prompt: "CPI architecture exists to:", correct: "Compose state machines safely", distractors: ["Hide transitions", "Avoid validators", "Remove ownership"], explanation: "Safe composition is the objective." },
    ]),
  ],
  "fork-consensus": [
    q("fc1", "foundation", "Fork convergence is driven by?", ["Random choice", "Replay validity + vote weight", "Wallet count", "Slot color"], 1, "Validators choose valid forks by weighted signals."),
    q("fc2", "applied", "Why replay both fork candidates?", ["UI metrics", "Validate execution before voting", "Lower fees", "Skip signatures"], 1, "Votes must follow valid replay."),
    q("fc3", "systems", "Lockouts in voting help with:", ["Arbitrary switching", "Convergence stability", "Bypassing replay", "Increasing partitions"], 1, "Lockouts discourage oscillation."),
    ...buildDrills("fc", [
      { difficulty: "foundation", prompt: "Competing fork appears due to:", correct: "Network delay/partition effects", distractors: ["Theme mismatch", "No signatures", "No slots"], explanation: "Divergent observations can create competing blocks." },
      { difficulty: "applied", prompt: "Validator votes should target fork with:", correct: "Valid replay and stronger cumulative support", distractors: ["Earliest seen packet", "Most UI users", "Longest docs"], explanation: "Validity + weight guide selection." },
      { difficulty: "applied", prompt: "Fork choice without replay can cause:", correct: "Invalid chain preference", distractors: ["Guaranteed safety", "Better finality", "No impact"], explanation: "Replay checks validity before commitment." },
      { difficulty: "systems", prompt: "Finality emerges when:", correct: "Supermajority converges under lockouts", distractors: ["One validator says so", "RPC is fast", "Mempool is empty"], explanation: "Convergence thresholds matter." },
      { difficulty: "systems", prompt: "Consensus architecture balances:", correct: "Liveness and safety constraints", distractors: ["Only UI and speed", "Only wallet support", "Only token price"], explanation: "Tradeoffs are explicit." },
    ]),
  ],
};
