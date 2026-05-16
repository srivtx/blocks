export const defiCaseStudies = [
  {
    id: "amm",
    title: "AMM Swap State Machine",
    architecture: "Pool reserves, LP shares, fee vault, and user token accounts form the state topology.",
    runtimeFlow: "User swap instruction -> pool authority checks -> reserve mutation -> fee accounting -> invariant verification -> commit.",
    invariants: ["x*y increases or stays bounded by fee model", "pool reserve balances remain non-negative", "LP share supply math remains consistent"],
    failureMode: "If invariant checks are skipped post-CPI, silent value leakage can occur via reserve drift.",
  },
  {
    id: "lending",
    title: "Lending Market Health Model",
    architecture: "Obligation accounts, collateral vaults, debt mint state, oracle snapshots.",
    runtimeFlow: "Deposit collateral -> update obligation health -> borrow path checks LTV -> mint debt -> periodic health recompute.",
    invariants: ["health factor above liquidation threshold on borrow", "oracle freshness window enforced", "vault and debt accounting remain balanced"],
    failureMode: "If oracle freshness checks are removed, stale prices can allow undercollateralized borrowing.",
  },
  {
    id: "liquidation",
    title: "Liquidation Cascade Control",
    architecture: "Liquidator authority, seized collateral routes, bad-debt settlement accounts.",
    runtimeFlow: "Detect unhealthy obligation -> validate liquidation authority -> seize collateral -> repay debt slice -> settle protocol fees.",
    invariants: ["liquidation bonus bounded", "debt reduction matches seized value bounds", "post-liquidation health improves or closes"],
    failureMode: "Without bounded liquidation math, cascading insolvency can spread across shared liquidity pools.",
  },
];
