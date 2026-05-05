# Type Alias: ReducerFn()

> **ReducerFn** = (`existing`, `incoming`) => `unknown`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:595](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/ir/types.ts#L595)

Custom reducer function for a single state field.

## Parameters

### existing

`unknown`

The current field value held in `GraphState`.

### incoming

`unknown`

The new value emitted by the most recently completed node.

## Returns

`unknown`

The merged value to store back into `GraphState`.
