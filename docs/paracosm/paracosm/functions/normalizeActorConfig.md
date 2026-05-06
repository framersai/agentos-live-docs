# Function: normalizeActorConfig()

> **normalizeActorConfig**(`leader`, `options?`): `NormalizedActorConfig`

Defined in: [apps/paracosm/src/engine/trait-models/normalize-leader.ts:60](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/trait-models/normalize-leader.ts#L60)

Normalize an ActorConfig so `traitProfile` is guaranteed populated
and every axis declared by the chosen model has a value (defaults
fill omissions). Throws `UnknownTraitModelError` when
`traitProfile.modelId` references an unregistered model.

## Parameters

### leader

[`ActorConfig`](../interfaces/ActorConfig.md)

### options?

`NormalizeOptions` = `{}`

## Returns

`NormalizedActorConfig`
