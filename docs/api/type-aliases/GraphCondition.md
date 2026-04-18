# Type Alias: GraphCondition

> **GraphCondition** = \{ `description?`: `string`; `fn`: [`GraphConditionFn`](GraphConditionFn.md); `type`: `"function"`; \} \| \{ `expr`: [`GraphConditionExpr`](GraphConditionExpr.md); `type`: `"expression"`; \}

Defined in: [packages/agentos/src/orchestration/ir/types.ts:112](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/ir/types.ts#L112)

Discriminated union for all routing predicates supported by graph edges.

- `{ type: 'function' }` — calls a runtime-registered TypeScript function.
- `{ type: 'expression' }` — evaluates a sandboxed DSL string.
