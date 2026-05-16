"use client";

import ReactFlow, { Background, Controls, MarkerType, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";
import type { DiagramTopic } from "@/lib/system-diagrams";

export function DiagramView({ model }: { model: DiagramTopic }) {
  const nodes: Node[] = model.nodes.map((n) => ({
    id: n.id,
    position: { x: n.x, y: n.y },
    data: { label: n.label },
    style: {
      border: "1px solid rgba(124,212,255,.55)",
      color: "#eaf3ff",
      borderRadius: "10px",
      background: "rgba(7,17,30,.9)",
      fontSize: 12,
      padding: 8,
    },
  }));

  const edges: Edge[] = model.edges.map((e, i) => ({
    id: `${e.source}-${e.target}-${i}`,
    source: e.source,
    target: e.target,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  }));

  return (
    <div className="mt-4 h-[260px] rounded-xl border border-[var(--line)] bg-[rgba(8,20,35,0.65)]">
      <ReactFlow fitView nodes={nodes} edges={edges} proOptions={{ hideAttribution: true }}>
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
