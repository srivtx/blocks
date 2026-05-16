"use client";

import { glossary } from "@/lib/architecture";

export function GlossaryInline({ text }: { text: string }) {
  let rendered = text;
  for (const term of glossary) {
    const safe = term.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${safe}\\b`, "g");
    rendered = rendered.replace(
      re,
      `[[${term.term}::${term.explanation} | Why: ${term.whyItExists}]]`,
    );
  }

  const parts = rendered.split(/(\[\[[^\]]+\]\])/g).filter(Boolean);

  return (
    <p className="lesson-copy">
      {parts.map((part, idx) => {
        if (!part.startsWith("[[") || !part.endsWith("]]")) return <span key={idx}>{part}</span>;
        const body = part.slice(2, -2);
        const [label, tip] = body.split("::");
        return (
          <span key={idx} className="term-inline" title={tip}>
            {label}
          </span>
        );
      })}
    </p>
  );
}
