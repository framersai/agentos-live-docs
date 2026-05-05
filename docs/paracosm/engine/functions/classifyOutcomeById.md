# Function: classifyOutcomeById()

> **classifyOutcomeById**(`selectedOptionId`, `options`, `riskSuccessProbability`, `metrics`, `rng`): [`TurnOutcome`](../type-aliases/TurnOutcome.md)

Defined in: [apps/paracosm/src/engine/core/progression.ts:179](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/progression.ts#L179)

Classify turn outcome using structured option ID.
Preferred over text-based classifyOutcome.

## Parameters

### selectedOptionId

`string`

### options

`object`[]

### riskSuccessProbability

`number`

### metrics

[`WorldMetrics`](../interfaces/WorldMetrics.md)

### rng

[`SeededRng`](../classes/SeededRng.md)

## Returns

[`TurnOutcome`](../type-aliases/TurnOutcome.md)
