export type CausalQuestion =
  | "problem"
  | "failure"
  | "constraint"
  | "tradeoff"
  | "runtime"
  | "state"
  | "ownership"
  | "validator"
  | "determinism"
  | "breakage";

export type LessonPhase = {
  id: string;
  order: number;
  title: string;
  objective: string;
  unlockDependsOn?: string;
  causalChain: Record<CausalQuestion, string>;
};

export type SimulatorSpec = {
  id: string;
  title: string;
  focus: string;
  actors: string[];
  observableState: string[];
};

export type GlossaryTerm = {
  term: string;
  explanation: string;
  whyItExists: string;
};

export const phases: LessonPhase[] = [
  { id: "foundations-state", order: 1, title: "Foundations Of Computation And State", objective: "Model systems as state machines and reason about memory transitions before distribution.", causalChain: { problem: "Computation without explicit state models hides failure modes.", failure: "Ad hoc logic cannot prove what changed or why.", constraint: "We need deterministic transitions from known inputs.", tradeoff: "Stricter models reduce flexibility but increase correctness.", runtime: "Runtime becomes a deterministic state-transition executor.", state: "State is a snapshot transformed by verified transitions.", ownership: "Ownership starts as authority to mutate specific state cells.", validator: "Validators later replay transitions, not intentions.", determinism: "Same input + same prior state => same output.", breakage: "Remove deterministic transitions and consensus collapses." } },
  { id: "distributed-systems", order: 2, title: "Distributed Systems Constraints", objective: "Understand replication, latency, partitioning, and coordination constraints.", unlockDependsOn: "foundations-state", causalChain: { problem: "Single-machine trust does not scale to open networks.", failure: "Independent replicas diverge under network delay and faults.", constraint: "Agreement must survive latency, crash, and adversarial behavior.", tradeoff: "Stronger consistency costs throughput and liveness windows.", runtime: "Runtime execution must be replayable across validators.", state: "Global state is emergent from converged local replay.", ownership: "Mutation rights require globally verifiable authorization.", validator: "Validators verify ordering and execution, not trust peers.", determinism: "Consensus relies on deterministic replay from ordered inputs.", breakage: "Remove ordering guarantees and replicas cannot converge." } },
  { id: "cryptography", order: 3, title: "Cryptographic Trust Construction", objective: "Use signatures and hashes to verify intent, integrity, and history.", unlockDependsOn: "distributed-systems", causalChain: { problem: "Open networks need trust without central identity authority.", failure: "Without signatures, anyone can mutate state as anyone else.", constraint: "Authorization must be locally verifiable by every validator.", tradeoff: "Cryptographic checks add compute overhead.", runtime: "Runtime verifies signatures before state transitions.", state: "Only authenticated actors can propose valid transitions.", ownership: "Public keys become explicit ownership anchors.", validator: "Every validator independently verifies proofs.", determinism: "Cryptographic validity is deterministic for fixed inputs.", breakage: "Remove signatures and ownership semantics vanish." } },
  { id: "bitcoin", order: 4, title: "Bitcoin As Minimal State Machine", objective: "Learn UTXO design as constrained but robust state accounting.", unlockDependsOn: "cryptography", causalChain: { problem: "Need censorship-resistant transfer of value.", failure: "Central ledgers create single trust and failure points.", constraint: "Value transfer must be verifiable from prior outputs.", tradeoff: "UTXO clarity limits expressive programmability.", runtime: "Validation checks spend rules and double-spend prevention.", state: "State is the set of unspent outputs.", ownership: "Outputs encode who can authorize spending next.", validator: "Miners/validators enforce chain-valid spend history.", determinism: "Script evaluation remains intentionally constrained.", breakage: "Remove UTXO linkage and provenance auditing breaks." } },
  { id: "ethereum", order: 5, title: "Ethereum As Generalized Execution", objective: "Understand account-based global state and programmable contracts.", unlockDependsOn: "bitcoin", causalChain: { problem: "UTXO scripting is too restrictive for complex protocols.", failure: "Complex multi-step logic becomes brittle off-chain orchestration.", constraint: "Need shared programmable runtime with deterministic execution.", tradeoff: "Global serial execution constrains parallel throughput.", runtime: "EVM executes bytecode with gas-bounded steps.", state: "Contracts mutate shared state under transaction ordering.", ownership: "Accounts and contracts own balances and storage domains.", validator: "Validators replay ordered transactions to converge state root.", determinism: "Deterministic opcodes preserve consensus safety.", breakage: "Remove gas bounds and halting/resource safety degrades." } },
  { id: "solana", order: 6, title: "Solana As High-Performance Runtime", objective: "Model account-centric execution and parallelization constraints.", unlockDependsOn: "ethereum", causalChain: { problem: "Serial execution limits throughput for global apps.", failure: "Shared mutable hotspots bottleneck validator pipelines.", constraint: "Parallelism needs explicit read/write account sets.", tradeoff: "Developers must reason about accounts and access upfront.", runtime: "Sealevel schedules non-conflicting transactions concurrently.", state: "Accounts are explicit state containers with ownership rules.", ownership: "Programs control only accounts they own.", validator: "Leaders propose blocks; validators replay account-locked execution.", determinism: "Declared account access preserves deterministic scheduling.", breakage: "Remove account declaration and safe parallelism disappears." } },
  { id: "runtime-internals", order: 7, title: "Runtime Internals And Validator Pipeline", objective: "Trace transaction lifecycle from ingress to finalized state.", unlockDependsOn: "solana", causalChain: { problem: "High throughput requires pipelined verification and execution.", failure: "Monolithic processing wastes CPU and increases latency.", constraint: "Validation, scheduling, and execution must overlap safely.", tradeoff: "Pipeline complexity raises implementation and observability costs.", runtime: "Signature verify, banking, execution, and commit run as stages.", state: "State transitions commit after successful pipeline checks.", ownership: "Ownership checks gate every write at runtime boundaries.", validator: "Validators independently run equivalent staged pipelines.", determinism: "Stage outputs must compose deterministically across nodes.", breakage: "Remove stage isolation and replay equivalence degrades." } },
  { id: "pda", order: 8, title: "PDA And Authority Derivation", objective: "Use deterministic address derivation for program-controlled state.", unlockDependsOn: "runtime-internals", causalChain: { problem: "Programs need predictable state addresses without private keys.", failure: "Random addresses make composable state discovery unreliable.", constraint: "Derivation must be deterministic and collision-resistant.", tradeoff: "Seed design discipline becomes a core architecture concern.", runtime: "Runtime verifies PDA derivation and signer constraints.", state: "PDAs anchor canonical protocol state namespaces.", ownership: "Program-derived authority enables controlled mutation patterns.", validator: "Validators verify derivation exactly from seeds and program id.", determinism: "Identical seeds map to identical addresses everywhere.", breakage: "Remove PDA determinism and protocol state composability breaks." } },
  { id: "defi", order: 9, title: "DeFi As Composed State Machines", objective: "Connect accounts, CPIs, and authority to protocol-level behavior.", unlockDependsOn: "pda", causalChain: { problem: "Financial primitives require coordinated multi-program transitions.", failure: "Isolated contracts cannot safely compose complex flows.", constraint: "Cross-program calls need explicit authority and invariant checks.", tradeoff: "Composability increases blast radius of design mistakes.", runtime: "CPIs execute nested transitions with bounded authorization.", state: "Protocol state spans pools, vaults, markets, and ledgers.", ownership: "Authority graphs define who can move which assets when.", validator: "Validators replay full CPI call graphs deterministically.", determinism: "Invariant-safe composition depends on deterministic call order.", breakage: "Remove invariant checks and value safety collapses." } },
  { id: "advanced-architecture", order: 10, title: "Advanced Protocol Architecture", objective: "Design end-to-end protocols with explicit tradeoff ownership.", unlockDependsOn: "defi", causalChain: { problem: "Production protocols must balance throughput, safety, and UX.", failure: "Optimizing one axis blindly creates hidden systemic fragility.", constraint: "Every decision must map to runtime and validator realities.", tradeoff: "Architectural clarity demands slower but more rigorous design loops.", runtime: "Architecture choices materialize as execution and state semantics.", state: "State topology determines scalability and failure domains.", ownership: "Authority minimization reduces exploit surfaces.", validator: "Validator cost profile determines sustainable decentralization.", determinism: "Determinism boundaries define verification confidence.", breakage: "Remove systems reasoning and protocol reliability erodes." } },
];

export const simulators: SimulatorSpec[] = [
  { id: "tx-flow", title: "Transaction Flow", focus: "Trace transaction ingress, verification, scheduling, execution, and commit.", actors: ["User", "Leader", "Validator", "Runtime"], observableState: ["signatureStatus", "accountLocks", "executionResult", "commitSlot"] },
  { id: "account-ownership", title: "Account Ownership", focus: "Track ownership boundaries, signer authority, and write permissions.", actors: ["User", "Program", "Runtime", "Owned Account"], observableState: ["ownerProgram", "signerAuth", "writePermission", "mutationStatus"] },
  { id: "memory-state", title: "Memory And State Mutation", focus: "Visualize in-memory execution deltas and committed account state.", actors: ["Instruction VM", "Runtime", "Account Store"], observableState: ["memoryFrame", "pendingDelta", "commitStatus", "stateRootHint"] },
  { id: "block-production", title: "Block Production", focus: "Simulate leader scheduling, packet batching, and block assembly.", actors: ["Leader", "PoH Stream", "Banking Stage", "Block Store"], observableState: ["leaderSlot", "packetBatch", "entryStream", "blockStatus"] },
  { id: "parallel-execution", title: "Parallel Execution Deep", focus: "Analyze read/write conflicts and deterministic lane scheduling.", actors: ["Scheduler", "Execution Lanes", "Lock Manager", "Runtime"], observableState: ["laneMap", "rwConflicts", "lockTable", "completionOrder"] },
  { id: "validator-internals", title: "Validator Internals Deep", focus: "Trace validator pipeline internals from fetch to vote emission.", actors: ["Fetch", "SigVerify", "Banking", "Replay", "Vote"], observableState: ["packetQueue", "verifiedQueue", "bankFork", "voteState"] },
  { id: "pda-derivation", title: "PDA Derivation", focus: "Explore seed design, address derivation, and signer validation.", actors: ["Program", "Runtime", "Client"], observableState: ["seeds", "bump", "derivedAddress", "signerCheck"] },
  { id: "cpi-stack", title: "CPI Call Stack", focus: "Visualize nested calls, authority propagation, and invariant checks.", actors: ["Program A", "Program B", "Runtime", "Token Program"], observableState: ["callDepth", "accountAccess", "authorityGraph", "invariants"] },
  { id: "fork-consensus", title: "Fork And Consensus", focus: "Understand fork divergence and validator vote convergence.", actors: ["Leader", "Forks", "Validator Set", "Finality"], observableState: ["leaderSlot", "forkChoice", "voteWeight", "finalizedHead"] },
];

export const glossary = [
  { term: "Deterministic Execution", explanation: "All validators produce the same result from the same ordered inputs.", whyItExists: "Without deterministic replay, distributed consensus cannot converge safely." },
  { term: "Account Ownership", explanation: "A program can mutate only accounts it owns under runtime rules.", whyItExists: "Ownership bounds state mutation and prevents arbitrary writes." },
  { term: "PDA", explanation: "A Program Derived Address is deterministically generated from seeds and program id.", whyItExists: "It creates predictable, program-controlled addresses without private keys." },
  { term: "Sealevel", explanation: "Solana runtime model for parallel transaction execution on disjoint accounts.", whyItExists: "It addresses throughput limits of strictly serial smart contract execution." },
];
