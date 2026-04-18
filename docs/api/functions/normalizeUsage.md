# Function: normalizeUsage()

> **normalizeUsage**(`usage?`): [`CostAggregator`](../interfaces/CostAggregator.md) \| `undefined`

Defined in: [packages/agentos/src/orchestration/turn-planner/helpers.ts:7](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/turn-planner/helpers.ts#L7)

Normalises undefined cost fields so downstream consumers always receive a fully shaped usage object.

## Parameters

### usage?

[`CostAggregator`](../interfaces/CostAggregator.md)

## Returns

[`CostAggregator`](../interfaces/CostAggregator.md) \| `undefined`
