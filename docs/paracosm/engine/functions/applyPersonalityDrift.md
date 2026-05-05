# Function: applyPersonalityDrift()

> **applyPersonalityDrift**(`colonists`, `commanderHexaco`, `turnOutcome`, `timeDelta`, `turn`, `time`): `void`

Defined in: [apps/paracosm/src/engine/core/progression.ts:76](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/progression.ts#L76)

Apply personality drift to all promoted colonists. Deterministic from inputs.
Three forces: leader pull, role pull, outcome pull.

## Parameters

### colonists

[`Agent`](../interfaces/Agent.md)[]

### commanderHexaco

[`HexacoProfile`](../interfaces/HexacoProfile.md)

### turnOutcome

[`TurnOutcome`](../type-aliases/TurnOutcome.md) | `null`

### timeDelta

`number`

### turn

`number`

### time

`number`

## Returns

`void`
