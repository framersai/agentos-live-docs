# Type Alias: GraphConditionExpr

> **GraphConditionExpr** = `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:104](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L104)

A DSL expression string evaluated by the runtime's condition interpreter.
Expressions may reference `state.*` fields using dot-notation.
Example: `"state.scratch.confidence > 0.8 ? 'approve' : 'review'"`
