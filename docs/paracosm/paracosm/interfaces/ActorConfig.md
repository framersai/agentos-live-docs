# Interface: ActorConfig

Defined in: [apps/paracosm/src/engine/types.ts:350](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L350)

Configuration for a simulation actor — the swappable decision-making
entity that runs each parallel counterfactual. Was `ActorConfig` in
0.7.x; renamed in 0.8.0 to match the user-facing terminology
(`scenario.labels.actorNoun` selects the per-domain label like
"commander" / "mayor" / "release director").

The legacy `ActorConfig` name is exported below as a `@deprecated`
type alias so 0.7.x callers compile unchanged. Drop in 1.0.

## Properties

### archetype

> **archetype**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:352](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L352)

***

### hexaco?

> `optional` **hexaco**: [`HexacoProfile`](../core/interfaces/HexacoProfile.md)

Defined in: [apps/paracosm/src/engine/types.ts:369](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L369)

Six-axis HEXACO personality profile. Optional in v0.9: callers
supplying `traitProfile` (e.g. ai-agent leaders) can omit this.
The runtime requires AT LEAST ONE of `hexaco` or `traitProfile`;
`normalizeActorConfig` throws a clear error if both are missing.
When both are supplied, `traitProfile` wins for cue translation +
drift; `hexaco` is preserved on the artifact for legacy display.

***

### instructions

> **instructions**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:378](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L378)

***

### name

> **name**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:351](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L351)

***

### traitProfile?

> `optional` **traitProfile**: [`TraitProfile`](TraitProfile.md)

Defined in: [apps/paracosm/src/engine/types.ts:377](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L377)

Pluggable trait profile naming a registered TraitModel and its
per-axis values. When set, this overrides the legacy `hexaco`
field for cue translation, drift, and prompt generation. When
omitted, the runtime synthesizes a profile from `hexaco` with
`modelId: 'hexaco'`.

***

### unit

> **unit**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:360](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L360)

The organizational unit / faction / org / team this leader
commands (e.g. "Station Alpha", "Engineering Org", "Player Faction").
Was `colony` pre-0.5.0; renamed for domain-agnostic semantics so
non-space scenarios (markets, game worlds, incident response) read
naturally instead of being named after a Mars heritage concept.
