# Function: progressBetweenTurns()

> **progressBetweenTurns**(`state`, `timeDelta`, `turnRng`, `progressionHook?`): `object`

Defined in: [apps/paracosm/src/engine/core/progression.ts:207](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/progression.ts#L207)

Run all between-turn progression: aging, mortality, births, careers,
health degradation, resource production. All deterministic from seed.

## Parameters

### state

[`SimulationState`](../interfaces/SimulationState.md)

### timeDelta

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
