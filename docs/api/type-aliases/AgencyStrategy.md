# Type Alias: AgencyStrategy

> **AgencyStrategy** = `"sequential"` \| `"parallel"` \| `"debate"` \| `"review-loop"` \| `"hierarchical"` \| `"graph"`

Defined in: [packages/agentos/src/api/types.ts:54](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types.ts#L54)

High-level orchestration strategy for multi-agent runs.

- `"sequential"` — agents are called one after another; output of each feeds the next.
- `"parallel"` — all agents are invoked concurrently; results are merged.
- `"debate"` — agents iteratively argue and refine a shared answer.
- `"review-loop"` — one agent produces output, another reviews and requests revisions.
- `"hierarchical"` — a coordinator agent dispatches sub-tasks to specialist agents.
- `"graph"` — explicit dependency DAG; agents run when all `dependsOn` predecessors complete.
