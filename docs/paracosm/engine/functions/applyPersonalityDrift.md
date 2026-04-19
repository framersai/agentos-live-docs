# Function: applyPersonalityDrift()

> **applyPersonalityDrift**(`colonists`, `commanderHexaco`, `turnOutcome`, `yearDelta`, `turn`, `year`): `void`

Defined in: [engine/core/progression.ts:76](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/progression.ts#L76)

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
