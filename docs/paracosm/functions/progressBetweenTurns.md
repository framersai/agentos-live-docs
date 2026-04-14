# Function: progressBetweenTurns()

> **progressBetweenTurns**(`state`, `yearDelta`, `turnRng`, `progressionHook?`): `object`

Defined in: [core/progression.ts:126](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/progression.ts#L126)

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
