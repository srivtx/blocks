# Protocol Architecture Lab - Information Architecture

## Source Of Truth
This architecture is derived from the provided research specification and encodes a single pedagogy:
- architecture before code
- constraint-driven reasoning
- runtime and validator mental simulation
- state-transition thinking across all lessons and simulators

## Sitemap
- / (Mission + learning map + systems graph)
- /learn/[phase] (Concept studio with causal chain + tradeoffs + runtime internals)
- /simulators/[id] (Execution-focused visual simulators)
- /architecture/[topic] (Animated architecture walkthroughs)
- /glossary/[term] (Constraint-context definitions, not isolated terms)
- /tracks/protocol-engineer (Adaptive progression through all phases)

## Learning Progression
1. Foundations Of Computation And State
2. Distributed Systems Constraints
3. Cryptographic Trust Construction
4. Bitcoin As Minimal State Machine
5. Ethereum As Generalized Execution
6. Solana As High-Performance Runtime
7. Runtime Internals And Validator Pipeline
8. PDA And Authority Derivation
9. DeFi As Composed State Machines
10. Advanced Protocol Architecture

Unlock logic:
- each phase unlocks when the learner demonstrates causal reasoning on previous constraints
- completion includes architecture narrative, execution timeline understanding, and state-transition checks

## Component Hierarchy
- AppShell
- LearningMap
- PhaseCards
- CausalLensPanel (problem -> failure -> constraint -> tradeoff)
- RuntimeFlowTimeline
- ValidatorPipelineDiagram
- StateTransitionViewer
- OwnershipAndAuthorityPanel
- SimulatorLauncher
- GlossaryOverlay

## Visualization Engine Architecture
- Simulation domain model (pure deterministic state reducers)
- Timeline engine (step, rewind, replay)
- Renderer adapters
  - diagram renderer
  - runtime pipeline renderer
  - ownership graph renderer
- Event narrative layer (mentor explanations per state transition)

## Lesson System
Each lesson is a structured object:
- prompt context
- problem statement
- predecessor failure mode
- forcing constraint
- resulting design
- runtime internals
- deterministic guarantees
- breakage-if-removed analysis
- bridge to next lesson

## Simulator Architecture
- Transaction flow simulator
- Validator execution simulator
- Account ownership simulator
- Fork and consensus simulator
- PDA derivation simulator
- CPI call stack simulator
- Block production simulator
- Parallel execution simulator

All simulators expose:
- current state snapshot
- event log
- actor responsibilities (user, leader, validator, runtime)
- authorization checks
- deterministic/indeterministic boundaries

## Animation System
- Meaningful animations only:
  - flow progression
  - state updates
  - ownership handoffs
  - consensus convergence
- Timing tiers:
  - 120-180ms micro feedback
  - 300-500ms state transition reveal
  - 700-1200ms execution storyline reveals

## Content Pipeline
- MDX lesson content with strict frontmatter schema
- compile-time validation of required reasoning fields
- glossary extraction + concept dependency graph
- simulator scenario JSON loaded into deterministic reducers

## Core Data Structures
- Phase
- Lesson
- CausalChain
- RuntimeActor
- StateTransition
- SimulatorScenario
- GlossaryTerm
- ArchitectureNode / ArchitectureEdge
