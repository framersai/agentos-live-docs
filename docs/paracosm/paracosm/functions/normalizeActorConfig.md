# Function: normalizeActorConfig()

> **normalizeActorConfig**(`leader`, `options?`): `NormalizedActorConfig`

Defined in: [apps/paracosm/src/engine/traits/normalize-leader.ts:60](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/traits/normalize-leader.ts#L60)

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
