# Type Alias: ReducerFn()

> **ReducerFn** = (`existing`, `incoming`) => `unknown`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:582](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/ir/types.ts#L582)

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
