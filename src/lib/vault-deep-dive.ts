export type VaultStep = {
  stage: string;
  purpose: string;
  accounts: string[];
  authority: string;
  runtimeFlow: string;
  stateBefore: string;
  stateAfter: string;
  invariantChecks: string[];
  failureIfRemoved: string;
  kitCode: string;
  coreRefs: string[];
};

export const vaultDeepDive = {
  id: "vault-v1",
  title: "Vault Architecture Deep Dive",
  objective:
    "Build a secure deposit/withdraw vault from first principles using reusable core system primitives.",
  architectureSummary:
    "Vault = program-owned token storage + user position ledger + authority model + deterministic instruction lifecycle.",
  primaryConstraints: [
    "Only authorized paths can move vault funds",
    "User ledger must remain consistent with vault balances",
    "All validators must replay identical deposit/withdraw transitions",
  ],
  accountsModel: [
    "Vault Config PDA (global parameters + admin authority)",
    "Vault Token Account (program-owned custody account)",
    "User Position PDA (per-user deposited balance/nonce)",
    "User Source/Destination Token Accounts",
  ],
  authorityGraph: [
    "Admin signer -> Vault Config controls policy updates",
    "Program-derived authority -> signs token CPI for vault movements",
    "User signer -> authorizes own deposit/withdraw intents",
  ],
  steps: [
    {
      stage: "1. Initialize Vault Namespace",
      purpose: "Create canonical addresses and ownership boundaries before any funds move.",
      accounts: ["Vault Config PDA", "Vault Token Account"],
      authority: "Admin signer initializes config; program owns vault token account.",
      runtimeFlow:
        "Client derives PDA seeds -> sends init instruction -> runtime verifies signer + ownership -> config committed.",
      stateBefore: "No canonical vault state.",
      stateAfter: "Vault config and vault token custody account established.",
      invariantChecks: ["Config PDA derivation deterministic", "Vault token owner == program authority"],
      failureIfRemoved: "Anyone can spoof config/custody accounts and route funds away.",
      kitCode:
        "import { getProgramDerivedAddress } from '@solana/kit';\nconst [vaultConfigPda] = await getProgramDerivedAddress({ programAddress, seeds: ['vault-config'] });",
      coreRefs: ["pda-schema", "accounts-authority"],
    },
    {
      stage: "2. Open User Position",
      purpose: "Bind per-user state to deterministic PDA for accounting and replay safety.",
      accounts: ["User Position PDA", "Vault Config PDA", "User signer"],
      authority: "User signer authorizes opening position; program owns position account data.",
      runtimeFlow:
        "Derive user position PDA from [vault, user] -> validate signer -> initialize position ledger with zero balance.",
      stateBefore: "User has no protocol position state.",
      stateAfter: "User position ledger exists with balance=0, nonce=0.",
      invariantChecks: ["Position PDA uniqueness per user", "Position owner == vault program"],
      failureIfRemoved: "Deposits cannot be safely attributed; replay/accounting ambiguity appears.",
      kitCode:
        "const [userPositionPda] = await getProgramDerivedAddress({ programAddress, seeds: ['position', userAddress] });",
      coreRefs: ["pda-schema", "rpc-observability"],
    },
    {
      stage: "3. Deposit Flow",
      purpose: "Move user tokens into program custody while incrementing user ledger deterministically.",
      accounts: ["User source token", "Vault token account", "User Position PDA"],
      authority: "User signer approves source movement; program authority signs vault receive CPI path.",
      runtimeFlow:
        "Validate deposit amount > 0 -> token CPI transfer user->vault -> increment user position balance -> commit.",
      stateBefore: "User tokens external to vault; position balance=N.",
      stateAfter: "Vault token balance increases; user position balance=N+deposit.",
      invariantChecks: ["Vault delta == position delta", "No negative or overflow balances"],
      failureIfRemoved: "Ledger and custody can drift, enabling phantom balances.",
      kitCode:
        "import { appendTransactionMessageInstructions } from '@solana/kit';\n// append deposit instruction with user source, vault token, position PDA accounts",
      coreRefs: ["tx-message-pipeline", "runtime-pipeline", "invariants-failures"],
    },
    {
      stage: "4. Withdraw Flow",
      purpose: "Release custody only for authorized user and only up to recorded position balance.",
      accounts: ["Vault token account", "User destination token", "User Position PDA", "User signer"],
      authority: "User signer + position ownership gate + program-derived authority for outbound token CPI.",
      runtimeFlow:
        "Validate user position >= withdraw amount -> decrement ledger -> token CPI transfer vault->user -> commit.",
      stateBefore: "Vault holds funds; user position balance=M.",
      stateAfter: "Vault decreases; user receives tokens; position balance=M-withdraw.",
      invariantChecks: ["Withdraw <= position balance", "Post-state balance non-negative", "Vault/position deltas mirror"],
      failureIfRemoved: "Unauthorized or overdraw withdrawals can drain vault.",
      kitCode:
        "import { signTransactionMessageWithSigners } from '@solana/kit';\nconst signedWithdraw = await signTransactionMessageWithSigners(withdrawMessage);",
      coreRefs: ["accounts-authority", "tx-message-pipeline", "invariants-failures"],
    },
    {
      stage: "5. Replay + Monitoring",
      purpose: "Ensure transition correctness is observable and replay-equivalent across validators.",
      accounts: ["Vault Config PDA", "Vault Token Account", "User Position PDA"],
      authority: "Read path; validator consensus enforces correctness.",
      runtimeFlow:
        "Fetch committed account snapshots -> decode balances -> verify custody/ledger consistency after each tx.",
      stateBefore: "Committed state exists but not yet audited.",
      stateAfter: "Observed and verified state snapshots for operational confidence.",
      invariantChecks: ["Vault aggregate >= sum(position balances) by design model", "Decoded fields match expected post-state"],
      failureIfRemoved: "Silent drift can persist until insolvency or exploit event.",
      kitCode:
        "const vaultAccount = await rpc.getAccountInfo(vaultTokenAddress).send();\nconst positionAccount = await rpc.getAccountInfo(userPositionPda).send();",
      coreRefs: ["rpc-observability", "runtime-pipeline"],
    },
  ] as VaultStep[],
};
