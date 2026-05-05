# Function: axisIntensities()

> **axisIntensities**(`profile`, `model`): `object`[]

Defined in: [apps/paracosm/src/engine/trait-models/cue-translator.ts:86](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/cue-translator.ts#L86)

Per-axis intensity (|value - 0.5|), useful for picking the "most
polarized" axes when the model's axis count exceeds maxCues.

Currently unused by buildCueLine (which iterates in model order),
but exported for future use cases (e.g. dashboard sparkline
highlighting, prompt-budget-constrained cue selection).

## Parameters

### profile

[`TraitProfile`](../interfaces/TraitProfile.md)

### model

[`TraitModel`](../interfaces/TraitModel.md)

## Returns

`object`[]
