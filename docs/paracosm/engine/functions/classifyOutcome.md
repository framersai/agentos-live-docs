# Function: classifyOutcome()

> **classifyOutcome**(`decisionText`, `riskyOption`, `riskSuccessProbability`, `colony`, `rng`): [`TurnOutcome`](../type-aliases/TurnOutcome.md)

Defined in: [engine/core/progression.ts:152](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/progression.ts#L152)

Classify turn outcome as risky/conservative success/failure.
Deterministic from seed + decision text.

## Parameters

### decisionText

`string`

### riskyOption

`string`

### riskSuccessProbability

`number`

### colony

[`WorldSystems`](../interfaces/WorldSystems.md)

### rng

[`SeededRng`](../classes/SeededRng.md)

## Returns

[`TurnOutcome`](../type-aliases/TurnOutcome.md)
