# Function: normalizeUsage()

> **normalizeUsage**(`usage?`): [`CostAggregator`](../interfaces/CostAggregator.md) \| `undefined`

Defined in: [packages/agentos/src/orchestration/turn-planner/helpers.ts:7](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/turn-planner/helpers.ts#L7)

Normalises undefined cost fields so downstream consumers always receive a fully shaped usage object.

## Parameters

### usage?

[`CostAggregator`](../interfaces/CostAggregator.md)

## Returns

[`CostAggregator`](../interfaces/CostAggregator.md) \| `undefined`
