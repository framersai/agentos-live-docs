# Function: applyPersonalityDrift()

> **applyPersonalityDrift**(`colonists`, `commanderHexaco`, `turnOutcome`, `yearDelta`, `turn`, `year`): `void`

Defined in: [apps/paracosm/src/engine/core/progression.ts:76](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/progression.ts#L76)

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
