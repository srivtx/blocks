"use client";

import { useEffect, useMemo } from "react";
import ReactFlow, { Background, Controls, MarkerType, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";
import { useSimulationStore, buildCurrentState } from "@/lib/simulation-store";
import type { SimulatorScenario } from "@/lib/simulator-scenarios";

type RuntimeSimulatorProps = {
  scenario: SimulatorScenario;
};

export function RuntimeSimulator({ scenario }: RuntimeSimulatorProps) {
  const { pointer, stepForward, stepBack, reset, setPlaying, playing, loadScenario } = useSimulationStore();

  useEffect(() => {
    loadScenario(scenario.events, scenario.baseState);
  }, [scenario, loadScenario]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      const state = useSimulationStore.getState();
      if (state.pointer >= state.events.length) {
        state.setPlaying(false);
        return;
      }
      state.stepForward();
    }, 900);
    return () => clearInterval(timer);
  }, [playing]);

  const current = useMemo(
    () => buildCurrentState(scenario.baseState, scenario.events, pointer),
    [scenario, pointer],
  );
  const currentEvent = pointer === 0 ? null : scenario.events[pointer - 1];

  const nodes: Node[] = scenario.nodes.map((n) => ({
    id: n.id,
    position: { x: n.x, y: n.y },
    data: { label: n.label },
    style: nodeStyle,
  }));

  const edges: Edge[] = scenario.flowEdges.map((edge) =>
    flowEdge(edge.source, edge.target, pointer >= edge.activateAtStep),
  );

  return (
    <div className="panel">
      <h2 className="section-title">{scenario.title}</h2>
      <p className="section-copy">{scenario.focus}</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="lens-item">
          <p className="lens-question">Why this mechanism exists</p>
          <p className="lens-answer">{scenario.whyThisExists}</p>
        </div>
        <div className="lens-item">
          <p className="lens-question">Deterministic boundary</p>
          <p className="lens-answer">{scenario.deterministicBoundary}</p>
        </div>
      </div>

      <div className="mt-4 h-[230px] rounded-xl border border-[var(--line)] bg-[rgba(8,20,35,0.65)]">
        <ReactFlow fitView nodes={nodes} edges={edges} proOptions={{ hideAttribution: true }}>
          <Background />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button className="term-chip" type="button" onClick={stepBack}>Back</button>
        <button className="term-chip" type="button" onClick={stepForward}>Step</button>
        <button className="term-chip" type="button" onClick={() => setPlaying(!playing)}>{playing ? "Pause" : "Play"}</button>
        <button className="term-chip" type="button" onClick={reset}>Reset</button>
        <span className="phase-order self-center">Step {pointer}/{scenario.events.length}</span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="lens-item">
          <p className="lens-question">Current runtime event</p>
          <p className="lens-answer">{currentEvent ? `${currentEvent.stage}: ${currentEvent.detail}` : "Awaiting first transition."}</p>
        </div>
        <div className="lens-item">
          <p className="lens-question">State snapshot</p>
          <p className="lens-answer">{Object.entries(current).map(([k, v]) => `${k}=${v}`).join(" | ")}</p>
        </div>
      </div>
    </div>
  );
}

const nodeStyle = {
  border: "1px solid rgba(124,212,255,.55)",
  color: "#eaf3ff",
  borderRadius: "10px",
  background: "rgba(7,17,30,.9)",
  fontSize: 12,
  padding: 8,
};

function flowEdge(source: string, target: string, active: boolean): Edge {
  return {
    id: `${source}-${target}`,
    source,
    target,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: {
      stroke: active ? "#7cd4ff" : "#47607e",
      strokeWidth: active ? 2.4 : 1.2,
    },
    animated: active,
  };
}
