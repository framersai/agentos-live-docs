# Type Alias: GraphConditionFn()

> **GraphConditionFn** = (`state`) => `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:97](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L97)

A TypeScript function that inspects `GraphState` and returns the id of the next node.
Used with `{ type: 'function' }` conditions so authors can express arbitrary routing logic.

## Parameters

### state

[`GraphState`](../interfaces/GraphState.md)

## Returns

`string`
