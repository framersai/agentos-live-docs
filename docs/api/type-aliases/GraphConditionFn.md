# Type Alias: GraphConditionFn()

> **GraphConditionFn** = (`state`) => `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:97](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/ir/types.ts#L97)

A TypeScript function that inspects `GraphState` and returns the id of the next node.
Used with `{ type: 'function' }` conditions so authors can express arbitrary routing logic.

## Parameters

### state

[`GraphState`](../interfaces/GraphState.md)

## Returns

`string`
