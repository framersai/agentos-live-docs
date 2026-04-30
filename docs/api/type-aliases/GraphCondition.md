# Type Alias: GraphCondition

> **GraphCondition** = \{ `description?`: `string`; `fn`: [`GraphConditionFn`](GraphConditionFn.md); `type`: `"function"`; \} \| \{ `expr`: [`GraphConditionExpr`](GraphConditionExpr.md); `type`: `"expression"`; \}

Defined in: [packages/agentos/src/orchestration/ir/types.ts:112](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/ir/types.ts#L112)

Discriminated union for all routing predicates supported by graph edges.

- `{ type: 'function' }` — calls a runtime-registered TypeScript function.
- `{ type: 'expression' }` — evaluates a sandboxed DSL string.
