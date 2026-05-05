# Type Alias: GraphCondition

> **GraphCondition** = \{ `description?`: `string`; `fn`: [`GraphConditionFn`](GraphConditionFn.md); `type`: `"function"`; \} \| \{ `expr`: [`GraphConditionExpr`](GraphConditionExpr.md); `type`: `"expression"`; \}

Defined in: [packages/agentos/src/orchestration/ir/types.ts:112](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/ir/types.ts#L112)

Discriminated union for all routing predicates supported by graph edges.

- `{ type: 'function' }` — calls a runtime-registered TypeScript function.
- `{ type: 'expression' }` — evaluates a sandboxed DSL string.
