# Function: pickCues()

> **pickCues**(`profile`, `model`, `options?`): `string`[]

Defined in: [apps/paracosm/src/engine/trait-models/cue-translator.ts:58](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/cue-translator.ts#L58)

Return the ordered list of cue strings for a profile under a model.

Selection: iterate axes in model-defined order; for each axis whose
value sits in 'low' or 'high' (i.e. polarized past 0.35 / 0.65),
emit the model's registered cue string for that zone. Mid-zone
values contribute no cue. Cap at `maxCues` (default 6).

The iteration order is stable across runs given the same profile,
so recurring trait combinations produce consistent prose order
across agents in a single simulation.

## Parameters

### profile

[`TraitProfile`](../interfaces/TraitProfile.md)

### model

[`TraitModel`](../interfaces/TraitModel.md)

### options?

`CuesOptions` = `{}`

## Returns

`string`[]
