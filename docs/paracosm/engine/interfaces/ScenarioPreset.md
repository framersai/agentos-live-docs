# Interface: ScenarioPreset

Defined in: [apps/paracosm/src/engine/types.ts:238](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L238)

A product-level preset with pre-configured leaders, personnel, and starting state.

## Properties

### id

> **id**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:239](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L239)

***

### label

> **label**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:240](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L240)

***

### leaders?

> `optional` **leaders**: `object`[]

Defined in: [apps/paracosm/src/engine/types.ts:241](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L241)

#### archetype

> **archetype**: `string`

#### hexaco

> **hexaco**: `Record`\<`string`, `number`\>

#### instructions

> **instructions**: `string`

#### name

> **name**: `string`

***

### personnel?

> `optional` **personnel**: `object`[]

Defined in: [apps/paracosm/src/engine/types.ts:242](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L242)

#### age

> **age**: `number`

#### department

> **department**: `string`

#### featured

> **featured**: `boolean`

#### name

> **name**: `string`

#### role

> **role**: `string`

#### specialization

> **specialization**: `string`

***

### startingState?

> `optional` **startingState**: `Partial`\<[`WorldState`](WorldState.md)\>

Defined in: [apps/paracosm/src/engine/types.ts:243](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L243)
