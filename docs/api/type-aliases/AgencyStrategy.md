# Type Alias: AgencyStrategy

> **AgencyStrategy** = `"sequential"` \| `"parallel"` \| `"debate"` \| `"review-loop"` \| `"hierarchical"` \| `"graph"`

Defined in: [packages/agentos/src/api/types.ts:54](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L54)

High-level orchestration strategy for multi-agent runs.

- `"sequential"` — agents are called one after another; output of each feeds the next.
- `"parallel"` — all agents are invoked concurrently; results are merged.
- `"debate"` — agents iteratively argue and refine a shared answer.
- `"review-loop"` — one agent produces output, another reviews and requests revisions.
- `"hierarchical"` — a coordinator agent dispatches sub-tasks to specialist agents.
- `"graph"` — explicit dependency DAG; agents run when all `dependsOn` predecessors complete.
