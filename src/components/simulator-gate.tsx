"use client";

import Link from "next/link";
import { RuntimeSimulator } from "@/components/runtime-simulator";
import { useProgressStore } from "@/lib/progress-store";
import { isSimulatorUnlocked, simulatorUnlockRequirement } from "@/lib/progression";
import { simulatorScenarios } from "@/lib/simulator-scenarios";
import { phases } from "@/lib/architecture";

export function SimulatorGate({ id }: { id: string }) {
  const completed = useProgressStore((s) => s.completedPhases);
  const scenario = simulatorScenarios[id];

  if (!scenario) {
    return <div className="panel">Unknown simulator.</div>;
  }

  const unlocked = isSimulatorUnlocked(completed, id);
  const required = simulatorUnlockRequirement[id];
  const requiredTitle = phases.find((p) => p.id === required)?.title ?? required;

  if (!unlocked) {
    return (
      <div className="panel">
        <h2 className="section-title">Simulator Locked</h2>
        <p className="section-copy mt-2">
          Complete phase: <strong>{requiredTitle}</strong> to unlock <strong>{scenario.title}</strong>.
        </p>
        <div className="mt-4">
          <Link className="term-chip" href={required ? `/learn/${required}` : "/"}>Go To Required Phase</Link>
        </div>
      </div>
    );
  }

  return <RuntimeSimulator scenario={scenario} />;
}
