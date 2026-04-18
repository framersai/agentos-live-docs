# Function: progressBetweenTurns()

> **progressBetweenTurns**(`state`, `yearDelta`, `turnRng`, `progressionHook?`): `object`

Defined in: [core/progression.ts:207](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/core/progression.ts#L207)

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
