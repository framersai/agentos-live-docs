# Interface: ActorConfig

Defined in: [apps/paracosm/src/engine/types.ts:358](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L358)

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

Defined in: [apps/paracosm/src/engine/types.ts:360](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L360)

***

### hexaco?

> `optional` **hexaco**: [`HexacoProfile`](../core/interfaces/HexacoProfile.md)

Defined in: [apps/paracosm/src/engine/types.ts:377](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L377)

Six-axis HEXACO personality profile. Optional in v0.9: callers
supplying `traitProfile` (e.g. ai-agent leaders) can omit this.
The runtime requires AT LEAST ONE of `hexaco` or `traitProfile`;
`normalizeActorConfig` throws a clear error if both are missing.
When both are supplied, `traitProfile` wins for cue translation +
drift; `hexaco` is preserved on the artifact for legacy display.

***

### instructions

> **instructions**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:386](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L386)

***

### name

> **name**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:359](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L359)

***

### traitProfile?

> `optional` **traitProfile**: [`TraitProfile`](TraitProfile.md)

Defined in: [apps/paracosm/src/engine/types.ts:385](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L385)

Pluggable trait profile naming a registered TraitModel and its
per-axis values. When set, this overrides the legacy `hexaco`
field for cue translation, drift, and prompt generation. When
omitted, the runtime synthesizes a profile from `hexaco` with
`modelId: 'hexaco'`.

***

### unit

> **unit**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:368](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L368)

The organizational unit / faction / org / team this leader
commands (e.g. "Station Alpha", "Engineering Org", "Player Faction").
Was `colony` pre-0.5.0; renamed for domain-agnostic semantics so
non-space scenarios (markets, game worlds, incident response) read
naturally instead of being named after a Mars heritage concept.
