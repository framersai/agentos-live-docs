# Function: applyPersonalityDrift()

> **applyPersonalityDrift**(`colonists`, `commanderHexaco`, `turnOutcome`, `yearDelta`, `turn`, `year`): `void`

Defined in: [core/progression.ts:76](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/core/progression.ts#L76)

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
