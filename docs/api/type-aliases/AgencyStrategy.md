# Type Alias: AgencyStrategy

> **AgencyStrategy** = `"sequential"` \| `"parallel"` \| `"debate"` \| `"review-loop"` \| `"hierarchical"` \| `"graph"`

Defined in: [packages/agentos/src/api/types.ts:54](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L54)

High-level orchestration strategy for multi-agent runs.

- `"sequential"` — agents are called one after another; output of each feeds the next.
- `"parallel"` — all agents are invoked concurrently; results are merged.
- `"debate"` — agents iteratively argue and refine a shared answer.
- `"review-loop"` — one agent produces output, another reviews and requests revisions.
- `"hierarchical"` — a coordinator agent dispatches sub-tasks to specialist agents.
- `"graph"` — explicit dependency DAG; agents run when all `dependsOn` predecessors complete.
