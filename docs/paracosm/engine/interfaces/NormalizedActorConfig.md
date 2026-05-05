# Interface: NormalizedActorConfig

Defined in: [apps/paracosm/src/engine/trait-models/normalize-leader.ts:41](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/normalize-leader.ts#L41)

An ActorConfig where `traitProfile` is guaranteed populated and
filled with the model's defaults for any omitted axis. The runtime
passes this shape downstream instead of the raw ActorConfig so
cue translation, drift, and prompt builders never have to handle
the missing-traitProfile branch.

## Extends

- [`ActorConfig`](ActorConfig.md)

## Properties

### archetype

> **archetype**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:352](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L352)

#### Inherited from

[`ActorConfig`](ActorConfig.md).[`archetype`](ActorConfig.md#archetype)

***

### ~~hexaco~~

> **hexaco**: [`HexacoProfile`](HexacoProfile.md)

Defined in: [apps/paracosm/src/engine/types.ts:373](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L373)

Six-axis HEXACO personality profile. Required for back-compat with
v0.7 callers; for non-HEXACO trait models (e.g. `ai-agent`), supply
a representative HEXACO snapshot AND set `traitProfile` to the
canonical model + traits the runtime should use. The
`normalizeActorConfig` helper at runtime synthesizes a
`traitProfile` from this field when `traitProfile` is omitted, so
existing leader configs continue to work unchanged.

#### Deprecated

since 0.8.0: prefer `traitProfile` for new code.
  Removal scheduled for 0.9.0.

#### Inherited from

[`ActorConfig`](ActorConfig.md).[`hexaco`](ActorConfig.md#hexaco)

***

### instructions

> **instructions**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:383](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L383)

#### Inherited from

[`ActorConfig`](ActorConfig.md).[`instructions`](ActorConfig.md#instructions)

***

### name

> **name**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:351](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L351)

#### Inherited from

[`ActorConfig`](ActorConfig.md).[`name`](ActorConfig.md#name)

***

### traitProfile

> **traitProfile**: [`TraitProfile`](TraitProfile.md)

Defined in: [apps/paracosm/src/engine/trait-models/normalize-leader.ts:42](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/normalize-leader.ts#L42)

Pluggable trait profile naming a registered TraitModel and its
per-axis values. When set, this overrides the legacy `hexaco`
field for cue translation, drift, and prompt generation. When
omitted, the runtime synthesizes a profile from `hexaco` with
`modelId: 'hexaco'`. See
`docs/superpowers/specs/2026-04-26-trait-model-generalization-design.md`.

#### Overrides

[`ActorConfig`](ActorConfig.md).[`traitProfile`](ActorConfig.md#traitprofile)

***

### unit

> **unit**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:360](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L360)

The organizational unit / faction / org / team this leader
commands (e.g. "Station Alpha", "Engineering Org", "Player Faction").
Was `colony` pre-0.5.0; renamed for domain-agnostic semantics so
non-space scenarios (markets, game worlds, incident response) read
naturally instead of being named after a Mars heritage concept.

#### Inherited from

[`ActorConfig`](ActorConfig.md).[`unit`](ActorConfig.md#unit)
