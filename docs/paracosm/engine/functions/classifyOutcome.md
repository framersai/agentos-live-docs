# Function: classifyOutcome()

> **classifyOutcome**(`decisionText`, `riskyOption`, `riskSuccessProbability`, `colony`, `rng`): [`TurnOutcome`](../type-aliases/TurnOutcome.md)

Defined in: [apps/paracosm/src/engine/core/progression.ts:152](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/progression.ts#L152)

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
