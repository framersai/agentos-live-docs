# Function: classifyOutcome()

> **classifyOutcome**(`decisionText`, `riskyOption`, `riskSuccessProbability`, `colony`, `rng`): [`TurnOutcome`](../type-aliases/TurnOutcome.md)

Defined in: [core/progression.ts:152](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/core/progression.ts#L152)

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
