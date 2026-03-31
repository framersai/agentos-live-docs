# Function: normalizeUsage()

> **normalizeUsage**(`usage?`): [`CostAggregator`](../interfaces/CostAggregator.md) \| `undefined`

Defined in: [packages/agentos/src/orchestration/turn-planner/helpers.ts:7](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/turn-planner/helpers.ts#L7)

Normalises undefined cost fields so downstream consumers always receive a fully shaped usage object.

## Parameters

### usage?

[`CostAggregator`](../interfaces/CostAggregator.md)

## Returns

[`CostAggregator`](../interfaces/CostAggregator.md) \| `undefined`
