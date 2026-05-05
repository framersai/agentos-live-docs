# Function: normalizeActorConfig()

> **normalizeActorConfig**(`leader`, `options?`): [`NormalizedActorConfig`](../interfaces/NormalizedActorConfig.md)

Defined in: [apps/paracosm/src/engine/trait-models/normalize-leader.ts:60](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/normalize-leader.ts#L60)

Normalize an ActorConfig so `traitProfile` is guaranteed populated
and every axis declared by the chosen model has a value (defaults
fill omissions). Throws `UnknownTraitModelError` when
`traitProfile.modelId` references an unregistered model.

## Parameters

### leader

[`ActorConfig`](../interfaces/ActorConfig.md)

### options?

[`NormalizeOptions`](../interfaces/NormalizeOptions.md) = `{}`

## Returns

[`NormalizedActorConfig`](../interfaces/NormalizedActorConfig.md)
