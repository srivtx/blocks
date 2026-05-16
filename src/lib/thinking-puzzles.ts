export type ThinkingPuzzle = {
  id: string;
  title: string;
  context: string;
  problem: string;
  constraints: string[];
  expectedThinkingSteps: string[];
  hints: string[];
  solution: string[];
  implementationBridge: string[];
};

export const thinkingPuzzles: ThinkingPuzzle[] = [
  {
    id: "puzzle-ownership-drain",
    title: "Puzzle 1: Stop Unauthorized Vault Drain",
    context:
      "You are designing a vault protocol. A transaction tries to move funds from vault token account to attacker account.",
    problem:
      "What checks must exist so this transaction fails deterministically on all validators?",
    constraints: [
      "Open network, no trusted operator",
      "Program-owned custody account",
      "Deterministic replay on every validator",
    ],
    expectedThinkingSteps: [
      "Identify mutable accounts and intended authority.",
      "Define signer requirements for withdrawal path.",
      "Define owner-program checks for writable accounts.",
      "Define invariant linking position balance and custody balance.",
    ],
    hints: [
      "Can a signer be valid but still unauthorized for this account?",
      "What if account owner is not your program?",
      "What if ledger says user has 0 but transfer still executes?",
    ],
    solution: [
      "Require user signer for own withdrawal request.",
      "Require vault token account owner/authority to match program-derived authority.",
      "Reject writable accounts with owner mismatch.",
      "Enforce withdraw_amount <= user_position_balance.",
      "Re-check post-state invariant: custody delta must equal ledger delta.",
    ],
    implementationBridge: [
      "Kit side: ensure account metas include correct writable/read-only boundaries.",
      "Anchor side: use account constraints and signer checks in context struct.",
      "Runtime side: rely on deterministic owner + signer failure paths.",
    ],
  },
  {
    id: "puzzle-pda-collision",
    title: "Puzzle 2: Design Non-Colliding PDA Namespace",
    context:
      "You need per-user per-market vault position accounts.",
    problem:
      "How do you design seeds so addresses are deterministic, discoverable, and collision-resistant?",
    constraints: [
      "Addresses must be re-derived by any client/validator",
      "Namespace must survive protocol growth",
      "No private-key ownership for PDA accounts",
    ],
    expectedThinkingSteps: [
      "List entity dimensions that define uniqueness.",
      "Choose stable seed ordering and schema versioning.",
      "Define migration path impact if schema changes.",
      "Define signer emulation expectations for invoke_signed.",
    ],
    hints: [
      "What distinguishes one user's position from another?",
      "Could market A and market B collide?",
      "What breaks if you rename seeds later?",
    ],
    solution: [
      "Use explicit seed schema like ['position', market, user].",
      "Keep deterministic seed ordering fixed forever for existing accounts.",
      "Add version seed only for new schema generations.",
      "Use derived bump and invoke_signed with exact same seeds.",
    ],
    implementationBridge: [
      "Kit side: derive PDA with program id + seeds and pass canonical address in instruction.",
      "Anchor side: enforce seeds/bump constraints in account context.",
      "Runtime side: derivation mismatch must fail deterministically.",
    ],
  },
  {
    id: "puzzle-cpi-invariant",
    title: "Puzzle 3: Catch Hidden CPI Value Leak",
    context:
      "Your AMM calls token program and another fee program in a nested CPI path.",
    problem:
      "Local calls succeed, but pool slowly loses value. Where do you add checks?",
    constraints: [
      "Nested cross-program calls",
      "Multiple mutable accounts",
      "Need deterministic post-state safety",
    ],
    expectedThinkingSteps: [
      "Define global protocol invariants before CPI.",
      "Track expected deltas for each critical account.",
      "Recompute invariants after all nested calls.",
      "Abort commit on any invariant breach.",
    ],
    hints: [
      "Do pre-checks alone catch nested side effects?",
      "Which account balances must net out?",
      "Where is the final boundary before commit?",
    ],
    solution: [
      "Run pre-CPI invariant checks to establish baseline.",
      "Execute nested CPIs with scoped authority only.",
      "Run post-CPI invariant checks across full account graph.",
      "Reject if reserve/fee/position consistency fails.",
    ],
    implementationBridge: [
      "Kit side: build full account graph in instruction metas.",
      "Anchor side: model account constraints + post-state assertion logic.",
      "Runtime side: deterministic pass/fail ensures safe replay.",
    ],
  },
];
