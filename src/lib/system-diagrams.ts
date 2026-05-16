export type DiagramTopic = {
  id: string;
  title: string;
  why: string;
  nodes: { id: string; label: string; x: number; y: number }[];
  edges: { source: string; target: string }[];
};

export const diagramTopics: Record<string, DiagramTopic> = {
  validators: {
    id: "validators",
    title: "Validator Architecture",
    why: "Validators independently verify and replay to converge on canonical state.",
    nodes: [
      { id: "ingress", label: "Ingress", x: 0, y: 60 },
      { id: "sig", label: "SigVerify", x: 180, y: 60 },
      { id: "exec", label: "Execution", x: 360, y: 60 },
      { id: "vote", label: "Vote", x: 540, y: 60 },
    ],
    edges: [{ source: "ingress", target: "sig" }, { source: "sig", target: "exec" }, { source: "exec", target: "vote" }],
  },
  poh: {
    id: "poh",
    title: "Proof Of History Flow",
    why: "PoH creates a verifiable temporal ordering signal for high-throughput sequencing.",
    nodes: [
      { id: "ticks", label: "Ticks", x: 0, y: 60 },
      { id: "entries", label: "Entries", x: 200, y: 60 },
      { id: "slot", label: "Slot", x: 400, y: 60 },
      { id: "replay", label: "Replay", x: 600, y: 60 },
    ],
    edges: [{ source: "ticks", target: "entries" }, { source: "entries", target: "slot" }, { source: "slot", target: "replay" }],
  },
  sealevel: {
    id: "sealevel",
    title: "Sealevel Parallelization",
    why: "Declared account read/write sets enable deterministic concurrency.",
    nodes: [
      { id: "txset", label: "Tx Set", x: 0, y: 60 },
      { id: "scan", label: "Conflict Scan", x: 190, y: 60 },
      { id: "lanes", label: "Lanes", x: 380, y: 20 },
      { id: "locks", label: "Locks", x: 380, y: 110 },
      { id: "commit", label: "Commit", x: 600, y: 60 },
    ],
    edges: [{ source: "txset", target: "scan" }, { source: "scan", target: "lanes" }, { source: "scan", target: "locks" }, { source: "lanes", target: "commit" }, { source: "locks", target: "commit" }],
  },
  leader: {
    id: "leader",
    title: "Leader Scheduling",
    why: "Rotating leader schedule spreads block production responsibility across validators.",
    nodes: [
      { id: "schedule", label: "Schedule", x: 0, y: 60 },
      { id: "leader", label: "Active Leader", x: 220, y: 60 },
      { id: "produce", label: "Produce Block", x: 440, y: 60 },
      { id: "handoff", label: "Next Leader", x: 660, y: 60 },
    ],
    edges: [{ source: "schedule", target: "leader" }, { source: "leader", target: "produce" }, { source: "produce", target: "handoff" }],
  },
};
