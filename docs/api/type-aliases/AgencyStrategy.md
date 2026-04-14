# Type Alias: AgencyStrategy

> **AgencyStrategy** = `"sequential"` \| `"parallel"` \| `"debate"` \| `"review-loop"` \| `"hierarchical"` \| `"graph"`

Defined in: [packages/agentos/src/api/types.ts:54](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L54)

High-level orchestration strategy for multi-agent runs.

- `"sequential"` — agents are called one after another; output of each feeds the next.
- `"parallel"` — all agents are invoked concurrently; results are merged.
- `"debate"` — agents iteratively argue and refine a shared answer.
- `"review-loop"` — one agent produces output, another reviews and requests revisions.
- `"hierarchical"` — a coordinator agent dispatches sub-tasks to specialist agents.
- `"graph"` — explicit dependency DAG; agents run when all `dependsOn` predecessors complete.
