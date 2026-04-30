# Function: progressBetweenTurns()

> **progressBetweenTurns**(`state`, `yearDelta`, `turnRng`, `progressionHook?`): `object`

Defined in: [apps/paracosm/src/engine/core/progression.ts:207](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/progression.ts#L207)

Run all between-turn progression: aging, mortality, births, careers,
health degradation, resource production. All deterministic from seed.

## Parameters

### state

[`SimulationState`](../interfaces/SimulationState.md)

### yearDelta

`number`

### turnRng

[`SeededRng`](../classes/SeededRng.md)

### progressionHook?

(`ctx`) => `void`

## Returns

`object`

### events

> **events**: [`TurnEvent`](../interfaces/TurnEvent.md)[]

### state

> **state**: [`SimulationState`](../interfaces/SimulationState.md)
