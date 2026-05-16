import type { AnchorModule } from "@/lib/anchor-basics";

export function AnchorModulePlayer({ module }: { module: AnchorModule }) {
  return (
    <article className="lens-item">
      <p className="lens-question">{module.title}</p>
      <p className="lesson-copy mt-1"><strong>Why:</strong> {module.why}</p>

      <div className="term-panel mt-3">
        <p className="phase-title">Architecture Before Code</p>
        <ul className="list-disc pl-5 text-sm text-slate-200">
          {module.architectureBeforeCode.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>

      <div className="term-panel mt-3">
        <p className="phase-title">What Anchor Adds</p>
        <ul className="list-disc pl-5 text-sm text-slate-200">
          {module.whatAnchorAdds.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>

      <div className="term-panel mt-3">
        <p className="phase-title">Runtime Reality</p>
        <ul className="list-disc pl-5 text-sm text-slate-200">
          {module.runtimeReality.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>

      <pre className="mt-3 overflow-x-auto rounded-md border border-[var(--line)] bg-[rgba(2,10,20,0.95)] p-3 text-xs text-slate-100">
        <code>{module.codeSketch}</code>
      </pre>
    </article>
  );
}
