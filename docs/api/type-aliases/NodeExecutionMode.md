# Type Alias: NodeExecutionMode

> **NodeExecutionMode** = `"single_turn"` \| `"react_bounded"` \| `"planner_controlled"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:35](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/ir/types.ts#L35)

Controls how many LLM turns a node may consume per invocation.

- `single_turn`        — exactly one prompt/response pair; deterministic cost.
- `react_bounded`      — ReAct-style tool-use loop capped by `maxInternalIterations`.
- `planner_controlled` — the orchestrating planner decides when the node is "done".
