# Function: classifyOutcomeById()

> **classifyOutcomeById**(`selectedOptionId`, `options`, `riskSuccessProbability`, `colony`, `rng`): [`TurnOutcome`](../type-aliases/TurnOutcome.md)

Defined in: [core/progression.ts:98](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/progression.ts#L98)

Classify turn outcome using structured option ID.
Preferred over text-based classifyOutcome.

## Parameters

### selectedOptionId

`string`

### options

`object`[]

### riskSuccessProbability

`number`

### colony

[`WorldSystems`](../interfaces/WorldSystems.md)

### rng

[`SeededRng`](../classes/SeededRng.md)

## Returns

[`TurnOutcome`](../type-aliases/TurnOutcome.md)
