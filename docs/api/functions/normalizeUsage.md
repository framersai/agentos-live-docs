# Function: normalizeUsage()

> **normalizeUsage**(`usage?`): [`CostAggregator`](../interfaces/CostAggregator.md) \| `undefined`

Defined in: [packages/agentos/src/orchestration/turn-planner/helpers.ts:7](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/turn-planner/helpers.ts#L7)

Normalises undefined cost fields so downstream consumers always receive a fully shaped usage object.

## Parameters

### usage?

[`CostAggregator`](../interfaces/CostAggregator.md)

## Returns

[`CostAggregator`](../interfaces/CostAggregator.md) \| `undefined`
