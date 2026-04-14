# Interface: ProgressionHookContext

Defined in: [types.ts:227](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L227)

Context passed to the scenario progression hook during between-turn advancement.

## Properties

### agents

> **agents**: [`Agent`](Agent.md)[]

Defined in: [types.ts:229](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L229)

All agents (mutable: the hook modifies health fields in place)

***

### rng

> **rng**: `object`

Defined in: [types.ts:235](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L235)

Seeded RNG for deterministic random operations

#### chance()

> **chance**(`probability`): `boolean`

##### Parameters

###### probability

`number`

##### Returns

`boolean`

#### int()

> **int**(`min`, `max`): `number`

##### Parameters

###### min

`number`

###### max

`number`

##### Returns

`number`

#### next()

> **next**(): `number`

##### Returns

`number`

#### pick()

> **pick**\<`T`\>(`arr`): `T`

##### Type Parameters

###### T

`T`

##### Parameters

###### arr

readonly `T`[]

##### Returns

`T`

***

### startYear

> **startYear**: `number`

Defined in: [types.ts:233](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L233)

***

### turn

> **turn**: `number`

Defined in: [types.ts:232](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L232)

***

### year

> **year**: `number`

Defined in: [types.ts:231](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L231)

***

### yearDelta

> **yearDelta**: `number`

Defined in: [types.ts:230](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L230)
