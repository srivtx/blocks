export type CoreStep = {
  stage: string;
  actor: string;
  architectureReason: string;
  runtimeAction: string;
  stateBefore: string;
  stateAfter: string;
  validatorCheck: string;
  kitCode: string;
};

export type CoreModule = {
  id: string;
  title: string;
  goal: string;
  whyThisMatters: string;
  prerequisites: string[];
  reusableIn: string[];
  steps: CoreStep[];
};

export const solanaKitVersion = "@solana/kit@6.9.0";

export const coreModules: CoreModule[] = [
  {
    id: "accounts-authority",
    title: "Accounts, Ownership, And Signer Authority",
    goal: "Understand who can mutate which state and why runtime authorization exists.",
    whyThisMatters:
      "Vault, escrow, AMM, lending, and liquidation all depend on explicit ownership and signer checks before mutation.",
    prerequisites: ["State transition basics", "Cryptographic authorization"],
    reusableIn: ["Vault", "Escrow", "AMM", "Lending", "Liquidation"],
    steps: [
      {
        stage: "1. Instruction Ingress",
        actor: "Client + Runtime",
        architectureReason: "Mutation requests must declare accounts so runtime can enforce ownership boundaries.",
        runtimeAction: "Runtime loads account metadata and signer set from transaction message.",
        stateBefore: "No mutation context.",
        stateAfter: "Account + signer context assembled.",
        validatorCheck: "All required accounts are present and signature set is complete.",
        kitCode:
          "import { address, createTransactionMessage } from '@solana/kit';\nconst msg = createTransactionMessage({ version: 'legacy' });",
      },
      {
        stage: "2. Ownership Gate",
        actor: "Runtime",
        architectureReason: "Only owner program should mutate account data.",
        runtimeAction: "Runtime compares instruction program id against each writable account owner.",
        stateBefore: "Writable accounts unresolved for authority.",
        stateAfter: "Writable subset is either authorized or rejected.",
        validatorCheck: "Owner mismatch causes deterministic failure.",
        kitCode:
          "// Kit builds message/instruction; owner checks happen in runtime during execution.\n// your architecture must pass correct account metas (writable/read-only).",
      },
      {
        stage: "3. Signer Constraint",
        actor: "Runtime + Program",
        architectureReason: "Even correct owner program needs caller authority proof for specific actions.",
        runtimeAction: "Program enforces signer requirements (e.g., admin/user authority accounts).",
        stateBefore: "Ownership may be valid, signer intent still unproven.",
        stateAfter: "Signer-authorized mutation path unlocked.",
        validatorCheck: "Missing signer flag fails uniformly across validators.",
        kitCode:
          "import { signTransactionMessageWithSigners } from '@solana/kit';\nconst signed = await signTransactionMessageWithSigners(msg);",
      },
      {
        stage: "4. Commit",
        actor: "Validator Runtime",
        architectureReason: "Only validated authority transitions should reach canonical state.",
        runtimeAction: "State delta commits after execution and checks pass.",
        stateBefore: "Pending transition.",
        stateAfter: "Canonical account state updated.",
        validatorCheck: "Replay confirms same authority decision and same final state.",
        kitCode:
          "import { sendAndConfirmTransactionFactory } from '@solana/kit';\nconst sendAndConfirm = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });",
      },
    ],
  },
  {
    id: "pda-schema",
    title: "PDA Schema And Program-Controlled State",
    goal: "Design deterministic state namespaces used by all protocols.",
    whyThisMatters:
      "Vaults, escrows, pools, positions, and obligation accounts need predictable addresses for discoverability and safety.",
    prerequisites: ["Ownership model", "Signer authority"],
    reusableIn: ["Vault", "Escrow", "AMM", "Position management"],
    steps: [
      {
        stage: "1. Seed Schema Design",
        actor: "Protocol Architect",
        architectureReason: "Seeds define namespace semantics and long-term compatibility.",
        runtimeAction: "No runtime action yet; this is architecture decision phase.",
        stateBefore: "No canonical address map.",
        stateAfter: "Seed tuple definitions established.",
        validatorCheck: "Later validators re-derive from these exact seeds.",
        kitCode:
          "// Example schema: ['vault', market, user] // architecture artifact before code",
      },
      {
        stage: "2. Deterministic Derivation",
        actor: "Client + Runtime",
        architectureReason: "All nodes must resolve same address from same seeds.",
        runtimeAction: "Address derivation produces canonical PDA.",
        stateBefore: "Address unknown.",
        stateAfter: "Canonical PDA resolved.",
        validatorCheck: "Re-derivation consistency across validators.",
        kitCode:
          "import { getProgramDerivedAddress } from '@solana/kit';\nconst [pda, bump] = await getProgramDerivedAddress({ programAddress, seeds });",
      },
      {
        stage: "3. invoke_signed Authority",
        actor: "Program + Runtime",
        architectureReason: "Program must sign for PDA-owned state without private key.",
        runtimeAction: "Runtime validates seed proof for signer emulation.",
        stateBefore: "PDA mutation unauthorized.",
        stateAfter: "PDA mutation authorized via derivation proof.",
        validatorCheck: "Seed/bump mismatch fails deterministically.",
        kitCode:
          "// Client passes PDA accounts; on-chain program uses invoke_signed with matching seeds/bump.",
      },
    ],
  },
  {
    id: "tx-message-pipeline",
    title: "Transaction Message Pipeline",
    goal: "Map instruction planning to signed message to confirmed state transition.",
    whyThisMatters:
      "Every real protocol action (deposit, swap, settle) flows through this exact path.",
    prerequisites: ["Ownership", "PDA schema"],
    reusableIn: ["All protocol operations"],
    steps: [
      {
        stage: "1. Instruction Planning",
        actor: "Client",
        architectureReason: "Instructions must encode exact account dependencies and authority intent.",
        runtimeAction: "None yet, off-chain planning.",
        stateBefore: "Intent only.",
        stateAfter: "Structured instruction set.",
        validatorCheck: "Later checks depend on account metas being correct.",
        kitCode:
          "import { appendTransactionMessageInstructions } from '@solana/kit';",
      },
      {
        stage: "2. Message Construction",
        actor: "Client",
        architectureReason: "Message freezes ordered execution intent and account list.",
        runtimeAction: "Transaction message serialized for network.",
        stateBefore: "Instruction objects.",
        stateAfter: "Finalized transaction message.",
        validatorCheck: "Ordering and metas replayable by validators.",
        kitCode:
          "import { createTransactionMessage } from '@solana/kit';\nconst msg = createTransactionMessage({ version: 'legacy' });",
      },
      {
        stage: "3. Signing",
        actor: "Signer",
        architectureReason: "Authorization proof attached to immutable message intent.",
        runtimeAction: "Signer applies signature(s).",
        stateBefore: "Unsigned message.",
        stateAfter: "Signed transaction message.",
        validatorCheck: "Signature validity before execution.",
        kitCode:
          "import { signTransactionMessageWithSigners } from '@solana/kit';\nconst signed = await signTransactionMessageWithSigners(msg);",
      },
      {
        stage: "4. Send + Confirm",
        actor: "RPC + Validator",
        architectureReason: "Execution must be observed at commitment level before assuming state success.",
        runtimeAction: "Transaction processed, replayed, and committed.",
        stateBefore: "Pending network inclusion.",
        stateAfter: "Committed/failed transition result.",
        validatorCheck: "Replay equivalence and commitment confirmation.",
        kitCode:
          "import { sendAndConfirmTransactionFactory } from '@solana/kit';\nawait sendAndConfirm(signed, { commitment: 'confirmed' });",
      },
    ],
  },
  {
    id: "rpc-observability",
    title: "RPC Observability And State Decoding",
    goal: "Fetch and interpret on-chain state safely with commitment awareness.",
    whyThisMatters:
      "Engineering decisions depend on reading the right state at the right commitment level.",
    prerequisites: ["Transaction pipeline"],
    reusableIn: ["Monitoring", "Risk engines", "Frontend state views"],
    steps: [
      {
        stage: "1. RPC Client Setup",
        actor: "Client",
        architectureReason: "Reliable state reads need explicit endpoint and transport assumptions.",
        runtimeAction: "RPC transport initialized.",
        stateBefore: "No chain read channel.",
        stateAfter: "Queryable state channel established.",
        validatorCheck: "N/A (read path).",
        kitCode:
          "import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit';\nconst rpc = createSolanaRpc(endpoint);",
      },
      {
        stage: "2. Commitment-Aware Read",
        actor: "Client",
        architectureReason: "Different commitments reflect different finality confidence.",
        runtimeAction: "Account data fetched at selected commitment.",
        stateBefore: "Unknown account snapshot.",
        stateAfter: "Versioned account snapshot acquired.",
        validatorCheck: "Read consistency depends on commitment semantics.",
        kitCode:
          "const account = await rpc.getAccountInfo(address).send();",
      },
      {
        stage: "3. Decode + Interpret",
        actor: "Client",
        architectureReason: "Raw bytes are not meaning; schema decoding is protocol truth surface.",
        runtimeAction: "Bytes decoded into typed fields.",
        stateBefore: "Opaque byte array.",
        stateAfter: "Typed state object.",
        validatorCheck: "Schema mismatch indicates client/runtime model drift.",
        kitCode:
          "import { getU64Codec } from '@solana/kit';\n// decode according to protocol layout",
      },
    ],
  },
  {
    id: "runtime-pipeline",
    title: "Validator Runtime Pipeline",
    goal: "Understand internal validator stages that all protocol transitions traverse.",
    whyThisMatters:
      "Protocol behavior in production is constrained by validator pipeline semantics, not local happy-path code.",
    prerequisites: ["Transaction pipeline", "Authority checks"],
    reusableIn: ["All advanced protocol design"],
    steps: [
      {
        stage: "1. Fetch + SigVerify",
        actor: "Validator",
        architectureReason: "Invalid authorization should be filtered before expensive execution.",
        runtimeAction: "Packets fetched and signatures verified.",
        stateBefore: "Raw packets.",
        stateAfter: "Verified packet batch.",
        validatorCheck: "Invalid signatures dropped deterministically.",
        kitCode: "// Client side implication: always sign exact final message; mutated message invalidates auth.",
      },
      {
        stage: "2. Banking + Scheduling",
        actor: "Validator",
        architectureReason: "Account locks enforce safe parallel state transitions.",
        runtimeAction: "Transactions scheduled into execution lanes.",
        stateBefore: "Unscheduled verified txs.",
        stateAfter: "Conflict-aware execution plan.",
        validatorCheck: "Lock conflicts resolved deterministically.",
        kitCode: "// Client implication: accurate account metas improve scheduler correctness and throughput.",
      },
      {
        stage: "3. Execution + Commit + Replay",
        actor: "Validator",
        architectureReason: "Canonical state must be reproducible under replay.",
        runtimeAction: "Instructions execute, deltas commit, peers replay.",
        stateBefore: "Pending bank state.",
        stateAfter: "Committed bank + replay-verifiable result.",
        validatorCheck: "Replay mismatch triggers consensus-level invalidation.",
        kitCode: "// Client implication: determinism-safe instruction composition only.",
      },
    ],
  },
  {
    id: "invariants-failures",
    title: "Invariant Library And Failure Injection",
    goal: "Formalize what must remain true and how failures appear when checks are removed.",
    whyThisMatters:
      "Without invariant boundaries, composed systems can pass local checks and still fail globally.",
    prerequisites: ["Runtime pipeline", "DeFi composition basics"],
    reusableIn: ["Vault", "Escrow", "AMM", "Lending", "Liquidations"],
    steps: [
      {
        stage: "1. Define Invariants",
        actor: "Protocol Architect",
        architectureReason: "Invariant set is the protocol's safety contract.",
        runtimeAction: "N/A - specification phase.",
        stateBefore: "Implicit assumptions.",
        stateAfter: "Explicit invariant checklist.",
        validatorCheck: "Future execution checks reference these invariants.",
        kitCode: "// Example invariant object used in client-side assertions and test scaffolds.",
      },
      {
        stage: "2. Boundary Checks",
        actor: "Program",
        architectureReason: "Checks must run at entry, CPI boundaries, and post-state commit candidate.",
        runtimeAction: "Invariant evaluations at critical boundaries.",
        stateBefore: "Potentially unsafe intermediate state.",
        stateAfter: "Transition accepted/rejected based on invariants.",
        validatorCheck: "Deterministic pass/fail from same pre-state and inputs.",
        kitCode: "// Client flow should include simulation and decode checks before relying on outcome.",
      },
      {
        stage: "3. Failure Injection",
        actor: "Learner/Test Harness",
        architectureReason: "Understanding what breaks builds durable system intuition.",
        runtimeAction: "Toggle off one check, replay scenario, observe failure path.",
        stateBefore: "Safety checks active.",
        stateAfter: "Exploit/failure path visible.",
        validatorCheck: "Failure mode must be reproducible and explainable.",
        kitCode:
          "import { getSignatureFromTransaction } from '@solana/kit';\n// capture tx, inspect fail/success paths across toggles",
      },
    ],
  },
];
