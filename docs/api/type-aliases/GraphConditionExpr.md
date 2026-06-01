# Type Alias: GraphConditionExpr

> **GraphConditionExpr** = `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:104](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L104)

A DSL expression string evaluated by the runtime's condition interpreter.
Expressions may reference `state.*` fields using dot-notation.
Example: `"state.scratch.confidence > 0.8 ? 'approve' : 'review'"`
