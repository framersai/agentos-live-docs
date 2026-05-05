# Function: classifyOutcome()

> **classifyOutcome**(`decisionText`, `riskyOption`, `riskSuccessProbability`, `metrics`, `rng`): [`TurnOutcome`](../type-aliases/TurnOutcome.md)

Defined in: [apps/paracosm/src/engine/core/progression.ts:152](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/progression.ts#L152)

Classify turn outcome as risky/conservative success/failure.
Deterministic from seed + decision text.

## Parameters

### decisionText

`string`

### riskyOption

`string`

### riskSuccessProbability

`number`

### metrics

[`WorldMetrics`](../interfaces/WorldMetrics.md)

### rng

[`SeededRng`](../classes/SeededRng.md)

## Returns

[`TurnOutcome`](../type-aliases/TurnOutcome.md)
