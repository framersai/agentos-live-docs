# Function: applyPersonalityDrift()

> **applyPersonalityDrift**(`colonists`, `commanderHexaco`, `turnOutcome`, `yearDelta`, `turn`, `year`): `void`

Defined in: [core/progression.ts:20](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/progression.ts#L20)

Apply personality drift to all promoted colonists. Deterministic from inputs.
Three forces: leader pull, role pull, outcome pull.

## Parameters

### colonists

[`Agent`](../interfaces/Agent.md)[]

### commanderHexaco

[`HexacoProfile`](../interfaces/HexacoProfile.md)

### turnOutcome

[`TurnOutcome`](../type-aliases/TurnOutcome.md) | `null`

### yearDelta

`number`

### turn

`number`

### year

`number`

## Returns

`void`
