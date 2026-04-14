# Function: classifyOutcome()

> **classifyOutcome**(`decisionText`, `riskyOption`, `riskSuccessProbability`, `colony`, `rng`): [`TurnOutcome`](../type-aliases/TurnOutcome.md)

Defined in: [core/progression.ts:71](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/progression.ts#L71)

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
