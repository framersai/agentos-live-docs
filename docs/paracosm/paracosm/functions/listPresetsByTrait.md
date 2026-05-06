# Function: listPresetsByTrait()

> **listPresetsByTrait**(`trait`, `high`): `LeaderPreset`[]

Defined in: [apps/paracosm/src/engine/leader-presets.ts:145](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/leader-presets.ts#L145)

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
