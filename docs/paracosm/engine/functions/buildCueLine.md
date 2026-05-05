# Function: buildCueLine()

> **buildCueLine**(`profile`, `model`, `options?`): `string`

Defined in: [apps/paracosm/src/engine/trait-models/cue-translator.ts:35](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/cue-translator.ts#L35)

Build a single-line cue string, e.g.
"Your inner voice: you feel events in your body before words;
 you look for what this moment makes possible."

Empty string when no axis is polarized into a low / high zone (every
value sits in mid).

## Parameters

### profile

[`TraitProfile`](../interfaces/TraitProfile.md)

### model

[`TraitModel`](../interfaces/TraitModel.md)

### options?

`CuesOptions` = `{}`

## Returns

`string`
