# Function: listPresetsByTrait()

> **listPresetsByTrait**(`trait`, `high`): `LeaderPreset`[]

Defined in: [apps/paracosm/src/engine/presets/index.ts:145](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/presets/index.ts#L145)

List all presets where the given HEXACO trait is above 0.7 (when
`high: true`) or below 0.3 (when `high: false`). Used by the preset
picker to group recommendations by trait emphasis.

## Parameters

### trait

keyof [`HexacoProfile`](../core/interfaces/HexacoProfile.md)

### high

`boolean`

## Returns

`LeaderPreset`[]
