# Function: progressBetweenTurns()

> **progressBetweenTurns**(`state`, `yearDelta`, `turnRng`, `progressionHook?`): `object`

Defined in: [engine/core/progression.ts:207](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/progression.ts#L207)

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
