# Function: classifyOutcomeById()

> **classifyOutcomeById**(`selectedOptionId`, `options`, `riskSuccessProbability`, `colony`, `rng`): [`TurnOutcome`](../type-aliases/TurnOutcome.md)

Defined in: [core/progression.ts:179](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/core/progression.ts#L179)

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
