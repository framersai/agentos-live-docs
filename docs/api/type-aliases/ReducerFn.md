# Type Alias: ReducerFn()

> **ReducerFn** = (`existing`, `incoming`) => `unknown`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:595](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L595)

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
