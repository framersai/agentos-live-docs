# Interface: TraitAxis

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:35](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L35)

One axis of a trait model. Axes are fixed at registration; the
registry is registration-time-only.

## Properties

### description

> **description**: `string`

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:41](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L41)

One-sentence description of what the axis measures.

***

### highPole?

> `optional` **highPole**: `string`

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:45](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L45)

Optional short label for the high pole (UI tooltip).

***

### id

> **id**: `string`

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:37](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L37)

kebab-case stable id used in serialization.

***

### label

> **label**: `string`

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:39](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L39)

Human-readable label for UI.

***

### lowPole?

> `optional` **lowPole**: `string`

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:43](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L43)

Optional short label for the low pole (UI tooltip).
