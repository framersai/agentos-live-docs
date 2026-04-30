# Interface: ScenarioPreset

Defined in: [apps/paracosm/src/engine/types.ts:221](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L221)

A product-level preset with pre-configured leaders, personnel, and starting state.

## Properties

### id

> **id**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:222](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L222)

***

### label

> **label**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:223](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L223)

***

### leaders?

> `optional` **leaders**: `object`[]

Defined in: [apps/paracosm/src/engine/types.ts:224](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L224)

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

Defined in: [apps/paracosm/src/engine/types.ts:225](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L225)

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

Defined in: [apps/paracosm/src/engine/types.ts:226](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L226)
