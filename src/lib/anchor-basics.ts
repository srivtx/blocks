export type AnchorModule = {
  id: string;
  title: string;
  why: string;
  architectureBeforeCode: string[];
  whatAnchorAdds: string[];
  runtimeReality: string[];
  codeSketch: string;
};

export const anchorBasics: AnchorModule[] = [
  {
    id: "anchor-why",
    title: "Why Anchor Exists",
    why:
      "Writing raw Solana program boilerplate repeatedly is error-prone. Anchor standardizes account validation, instruction decoding, and client generation.",
    architectureBeforeCode: [
      "Define state model first (accounts, authority, invariants).",
      "Define instruction lifecycle and constraints.",
      "Only then map to framework constructs.",
    ],
    whatAnchorAdds: [
      "Account context structs with constraints",
      "IDL generation for client interoperability",
      "Safer instruction/account validation patterns",
    ],
    runtimeReality: [
      "Anchor does not replace runtime rules; it compiles to runtime-enforced Solana semantics.",
      "Wrong architecture still fails even with perfect Anchor syntax.",
    ],
    codeSketch:
      "#[derive(Accounts)]\npub struct Deposit<'info> {\n  #[account(mut)]\n  pub user: Signer<'info>,\n  #[account(mut, seeds=[b\"position\", user.key().as_ref()], bump)]\n  pub position: Account<'info, Position>,\n}",
  },
  {
    id: "anchor-accounts",
    title: "Anchor Account Constraints",
    why:
      "Constraints express architecture intent (owner, seeds, mutability, signer) in one explicit validation layer.",
    architectureBeforeCode: [
      "List which accounts must be mutable vs read-only.",
      "List authority requirements per instruction.",
      "List PDA seed schema and bump policy.",
    ],
    whatAnchorAdds: [
      "Declarative checks for seeds/bump/signer/owner",
      "Cleaner error surface than ad-hoc manual checks",
    ],
    runtimeReality: [
      "Constraints execute before business logic, protecting state-transition path.",
      "Constraint gaps become exploitable architecture gaps.",
    ],
    codeSketch:
      "#[account(mut, has_one = authority)]\npub vault: Account<'info, Vault>;\n#[account(signer)]\npub authority: AccountInfo<'info>;",
  },
  {
    id: "anchor-cpi",
    title: "Anchor CPI Patterns",
    why:
      "Most protocols need composability; CPI must preserve authority scope and invariant boundaries.",
    architectureBeforeCode: [
      "Define what authority is delegated and where it stops.",
      "Define pre/post invariant checks across nested calls.",
    ],
    whatAnchorAdds: [
      "Typed CPI account wrappers",
      "Cleaner invoke flows with less serialization boilerplate",
    ],
    runtimeReality: [
      "Nested calls still obey runtime owner/signer rules.",
      "Post-CPI invariant checks remain your responsibility.",
    ],
    codeSketch:
      "let cpi_ctx = CpiContext::new(token_program.to_account_info(), transfer_accounts);\ntoken::transfer(cpi_ctx, amount)?;\nassert_invariants(&ctx.accounts)?;",
  },
  {
    id: "anchor-kit-side-by-side",
    title: "Anchor + Solana Kit Side By Side",
    why:
      "Engineers need both: on-chain architecture enforcement and robust client-side transaction orchestration.",
    architectureBeforeCode: [
      "Anchor: enforce account/instruction constraints on-chain.",
      "Kit: construct/send/observe transactions with explicit account metas and commitment choices.",
    ],
    whatAnchorAdds: [
      "On-chain safety ergonomics",
      "IDL-driven structure",
    ],
    runtimeReality: [
      "Kit-side mistakes in account metas can still break runtime expectations.",
      "Anchor-side mistakes in constraints can still allow unsafe transitions.",
    ],
    codeSketch:
      "// Kit client sends instruction built against Anchor IDL semantics\nconst signed = await signTransactionMessageWithSigners(message);\nawait sendAndConfirm(signed, { commitment: 'confirmed' });",
  },
];
