# Function: classifyOutcomeById()

> **classifyOutcomeById**(`selectedOptionId`, `options`, `riskSuccessProbability`, `colony`, `rng`): [`TurnOutcome`](../type-aliases/TurnOutcome.md)

Defined in: [engine/core/progression.ts:179](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/progression.ts#L179)

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
