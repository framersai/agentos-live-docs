# Function: normalizeUsage()

> **normalizeUsage**(`usage?`): [`CostAggregator`](../interfaces/CostAggregator.md) \| `undefined`

Defined in: [packages/agentos/src/orchestration/turn-planner/helpers.ts:7](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/turn-planner/helpers.ts#L7)

Normalises undefined cost fields so downstream consumers always receive a fully shaped usage object.

## Parameters

### usage?

[`CostAggregator`](../interfaces/CostAggregator.md)

## Returns

[`CostAggregator`](../interfaces/CostAggregator.md) \| `undefined`
