export type CaseStep = {
  stage: string;
  actor: string;
  action: string;
  stateDelta: string;
  invariantsChecked: string[];
  ifRemovedBreakage: string;
};

export type DefiCaseStudy = {
  id: string;
  title: string;
  architecture: string;
  runtimeFlow: string;
  invariants: string[];
  failureMode: string;
  accountsInvolved: string[];
  authorityModel: string;
  steps: CaseStep[];
};

export const defiCaseStudies: DefiCaseStudy[] = [
  {
    id: "amm",
    title: "AMM Swap State Machine",
    architecture: "Pool reserves, LP shares, fee vault, and user token accounts form the state topology.",
    runtimeFlow: "User swap instruction -> pool authority checks -> reserve mutation -> fee accounting -> invariant verification -> commit.",
    invariants: ["x*y increases or stays bounded by fee model", "pool reserve balances remain non-negative", "LP share supply math remains consistent"],
    failureMode: "If invariant checks are skipped post-CPI, silent value leakage can occur via reserve drift.",
    accountsInvolved: ["User source token", "User destination token", "Pool reserve A", "Pool reserve B", "Fee vault", "Pool config PDA"],
    authorityModel: "Pool program owns reserves; swap executes only when signer authority and pool config constraints pass.",
    steps: [
      {
        stage: "1. Instruction Ingress",
        actor: "User + Runtime",
        action: "User submits swap instruction with source/destination accounts and minimum output constraint.",
        stateDelta: "No committed change yet. Transaction enters execution pipeline.",
        invariantsChecked: ["Required signer present", "Account ownership is valid"],
        ifRemovedBreakage: "Unauthorized actors could craft mutable state requests.",
      },
      {
        stage: "2. Pool Authority Gate",
        actor: "AMM Program",
        action: "Program verifies pool config PDA, token vault ownership, and fee parameters.",
        stateDelta: "No reserve mutation yet; execution continues only if authority checks pass.",
        invariantsChecked: ["Vault owner matches program", "Fee parameters within protocol bounds"],
        ifRemovedBreakage: "Malicious vault redirection or invalid fee model injection.",
      },
      {
        stage: "3. Quote And Slippage Check",
        actor: "AMM Program",
        action: "Program computes expected output using invariant math and compares with user min-out.",
        stateDelta: "Derived output amount stored in execution context.",
        invariantsChecked: ["Output >= min-out", "Invariant formula uses current reserves"],
        ifRemovedBreakage: "Users can receive worse-than-promised execution without protection.",
      },
      {
        stage: "4. Reserve Mutation",
        actor: "Runtime + Token Program via CPI",
        action: "Token CPIs move input into reserve and output to user destination account.",
        stateDelta: "Pool reserve A increases, reserve B decreases, user balances update.",
        invariantsChecked: ["Transfer authority is valid", "Token account mints match expected pool pair"],
        ifRemovedBreakage: "Incorrect token flows or unauthorized transfer path.",
      },
      {
        stage: "5. Fee Accounting",
        actor: "AMM Program",
        action: "Protocol fee is carved from input/output path and credited to fee vault.",
        stateDelta: "Fee vault balance increments; net user output finalized.",
        invariantsChecked: ["Fee <= configured max", "Fee vault account is canonical"],
        ifRemovedBreakage: "Protocol economics drift; fee capture can be bypassed.",
      },
      {
        stage: "6. Post-State Invariant Check + Commit",
        actor: "AMM Program + Validator",
        action: "Program re-checks invariant envelope and runtime commits resulting state.",
        stateDelta: "Canonical state transitions to next reserve snapshot.",
        invariantsChecked: ["Reserve product envelope holds", "No negative balances"],
        ifRemovedBreakage: "Silent reserve drift accumulates and pool solvency degrades.",
      },
    ],
  },
  {
    id: "lending",
    title: "Lending Market Health Model",
    architecture: "Obligation accounts, collateral vaults, debt mint state, oracle snapshots.",
    runtimeFlow: "Deposit collateral -> update obligation health -> borrow path checks LTV -> mint debt -> periodic health recompute.",
    invariants: ["health factor above liquidation threshold on borrow", "oracle freshness window enforced", "vault and debt accounting remain balanced"],
    failureMode: "If oracle freshness checks are removed, stale prices can allow undercollateralized borrowing.",
    accountsInvolved: ["User collateral account", "Collateral vault", "Obligation account", "Debt mint", "Oracle price account"],
    authorityModel: "Lending program controls vault and obligation mutation; borrow rights depend on live health checks.",
    steps: [
      { stage: "1. Collateral Deposit", actor: "User + Lending Program", action: "User deposits collateral into protocol vault and updates obligation account.", stateDelta: "Vault collateral increases; obligation collateral ledger increments.", invariantsChecked: ["Collateral mint matches market", "User signer authorized"], ifRemovedBreakage: "Spoofed collateral deposits and inconsistent obligation state." },
      { stage: "2. Oracle Snapshot Validation", actor: "Lending Program", action: "Program verifies oracle freshness and trusted feed source.", stateDelta: "Live price snapshot loaded for health computation.", invariantsChecked: ["Price slot freshness", "Oracle account ownership"], ifRemovedBreakage: "Stale or spoofed prices allow toxic borrow positions." },
      { stage: "3. Health Factor Computation", actor: "Lending Program", action: "Program computes collateral value vs debt and enforces LTV ceilings.", stateDelta: "Borrow limit value computed in execution context.", invariantsChecked: ["Health factor > threshold", "Borrow amount <= allowed limit"], ifRemovedBreakage: "Undercollateralized debt can be minted." },
      { stage: "4. Debt Mint CPI", actor: "Runtime + Debt Mint Program", action: "If checks pass, debt tokens are minted to user borrow account.", stateDelta: "User debt balance increases; protocol debt supply updates.", invariantsChecked: ["Mint authority is canonical", "Debt accounting consistency"], ifRemovedBreakage: "Unauthorized debt creation or debt supply drift." },
      { stage: "5. Obligation State Update", actor: "Lending Program", action: "Obligation debt ledger and timestamps update post-borrow.", stateDelta: "Obligation now tracks increased liability and health margin.", invariantsChecked: ["Ledger deltas balance", "Obligation account owner is correct"], ifRemovedBreakage: "Protocol cannot correctly evaluate liquidation thresholds." },
      { stage: "6. Commit + Monitoring Baseline", actor: "Validator Runtime", action: "State commits and next health recompute baseline is established.", stateDelta: "Canonical debt/collateral state advanced.", invariantsChecked: ["Vault-to-debt consistency", "Post-borrow health remains valid"], ifRemovedBreakage: "Delayed insolvency detection and cascading bad debt." },
    ],
  },
  {
    id: "liquidation",
    title: "Liquidation Cascade Control",
    architecture: "Liquidator authority, seized collateral routes, bad-debt settlement accounts.",
    runtimeFlow: "Detect unhealthy obligation -> validate liquidation authority -> seize collateral -> repay debt slice -> settle protocol fees.",
    invariants: ["liquidation bonus bounded", "debt reduction matches seized value bounds", "post-liquidation health improves or closes"],
    failureMode: "Without bounded liquidation math, cascading insolvency can spread across shared liquidity pools.",
    accountsInvolved: ["Unhealthy obligation", "Collateral vault", "Debt reserve", "Liquidator repay account", "Protocol fee vault"],
    authorityModel: "Liquidation path is constrained by obligation health, capped bonus rules, and deterministic debt settlement ordering.",
    steps: [
      { stage: "1. Unhealthy Position Detection", actor: "Lending Program", action: "Program recomputes obligation health and flags below-threshold position.", stateDelta: "Obligation marked eligible for liquidation path.", invariantsChecked: ["Health factor below trigger", "Oracle freshness still valid"], ifRemovedBreakage: "Healthy users could be liquidated or unhealthy users skipped." },
      { stage: "2. Liquidator Authorization", actor: "Runtime + Program", action: "Program validates liquidator signer and repay account constraints.", stateDelta: "Liquidation context initialized with authorized actor.", invariantsChecked: ["Liquidator signer present", "Repay asset matches debt market"], ifRemovedBreakage: "Unauthorized actors could seize collateral." },
      { stage: "3. Debt Repay Slice", actor: "Token Program via CPI", action: "Liquidator repays capped debt portion into reserve.", stateDelta: "Debt principal decreases for target obligation.", invariantsChecked: ["Repay amount within protocol caps", "Debt reserve account integrity"], ifRemovedBreakage: "Over-repayment/under-repayment exploits distort accounting." },
      { stage: "4. Collateral Seizure", actor: "Lending Program + Token CPI", action: "Collateral is transferred to liquidator under bounded bonus math.", stateDelta: "Obligation collateral decreases; liquidator collateral increases.", invariantsChecked: ["Bonus within configured range", "Seized value maps to repaid debt"], ifRemovedBreakage: "Predatory over-seizure drains protocol users." },
      { stage: "5. Fee And Settlement", actor: "Lending Program", action: "Protocol fee component is routed to fee vault and ledgers updated.", stateDelta: "Fee vault increments; obligation ledger reflects new debt/collateral.", invariantsChecked: ["Settlement balances net out", "Fee routing account is canonical"], ifRemovedBreakage: "Protocol accounting gaps accumulate hidden insolvency." },
      { stage: "6. Post-Liquidation Health Recompute", actor: "Validator Runtime", action: "Program recomputes obligation health; either exits risk zone or remains partially open.", stateDelta: "Canonical obligation state committed with new risk profile.", invariantsChecked: ["Health improves or position is closed", "No negative vault balances"], ifRemovedBreakage: "Cascading unresolved toxic debt across markets." },
    ],
  },
];
