# Function: traitZone()

> **traitZone**(`value`): `"low"` \| `"mid"` \| `"high"`

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:262](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L262)

Compute the zone for a trait value: 'low' when <= 0.35, 'high' when
>= 0.65, 'mid' otherwise. Used by the cue translator.

## Parameters

### value

`number`

## Returns

`"low"` \| `"mid"` \| `"high"`
