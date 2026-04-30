# Function: classifyOutcomeById()

> **classifyOutcomeById**(`selectedOptionId`, `options`, `riskSuccessProbability`, `colony`, `rng`): [`TurnOutcome`](../type-aliases/TurnOutcome.md)

Defined in: [apps/paracosm/src/engine/core/progression.ts:179](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/progression.ts#L179)

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
