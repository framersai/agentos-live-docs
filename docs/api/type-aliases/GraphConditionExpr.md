# Type Alias: GraphConditionExpr

> **GraphConditionExpr** = `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:104](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/ir/types.ts#L104)

A DSL expression string evaluated by the runtime's condition interpreter.
Expressions may reference `state.*` fields using dot-notation.
Example: `"state.scratch.confidence > 0.8 ? 'approve' : 'review'"`
