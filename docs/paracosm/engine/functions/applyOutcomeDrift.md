# Function: applyOutcomeDrift()

> **applyOutcomeDrift**(`profile`, `model`, `ctx`): [`TraitProfile`](../interfaces/TraitProfile.md)

Defined in: [apps/paracosm/src/engine/trait-models/drift.ts:68](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/drift.ts#L68)

Apply outcome-reinforcement drift to a profile in place. Returns a
new TraitProfile (same modelId) with the deltas applied + clamped.

## Parameters

### profile

[`TraitProfile`](../interfaces/TraitProfile.md)

### model

[`TraitModel`](../interfaces/TraitModel.md)

### ctx

`DriftOutcomeContext`

## Returns

[`TraitProfile`](../interfaces/TraitProfile.md)
