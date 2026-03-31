# Type Alias: GraphConditionExpr

> **GraphConditionExpr** = `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:98](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L98)

A DSL expression string evaluated by the runtime's condition interpreter.
Expressions may reference `state.*` fields using dot-notation.
Example: `"state.scratch.confidence > 0.8 ? 'approve' : 'review'"`
