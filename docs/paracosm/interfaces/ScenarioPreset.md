# Interface: ScenarioPreset

Defined in: [types.ts:214](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L214)

A product-level preset with pre-configured leaders, personnel, and starting state.

## Properties

### id

> **id**: `string`

Defined in: [types.ts:215](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L215)

***

### label

> **label**: `string`

Defined in: [types.ts:216](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L216)

***

### leaders?

> `optional` **leaders**: `object`[]

Defined in: [types.ts:217](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L217)

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

Defined in: [types.ts:218](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L218)

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

Defined in: [types.ts:219](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L219)
