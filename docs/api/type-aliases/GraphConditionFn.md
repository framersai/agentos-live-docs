# Type Alias: GraphConditionFn()

> **GraphConditionFn** = (`state`) => `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:97](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L97)

A TypeScript function that inspects `GraphState` and returns the id of the next node.
Used with `{ type: 'function' }` conditions so authors can express arbitrary routing logic.

## Parameters

### state

[`GraphState`](../interfaces/GraphState.md)

## Returns

`string`
