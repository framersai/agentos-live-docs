# Interface: ProgressionHookContext

Defined in: [engine/types.ts:234](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L234)

Context passed to the scenario progression hook during between-turn advancement.

## Properties

### agents

> **agents**: [`Agent`](Agent.md)[]

Defined in: [engine/types.ts:236](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L236)

All agents (mutable: the hook modifies health fields in place)

***

### rng

> **rng**: `object`

Defined in: [engine/types.ts:242](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L242)

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

Defined in: [engine/types.ts:240](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L240)

***

### turn

> **turn**: `number`

Defined in: [engine/types.ts:239](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L239)

***

### year

> **year**: `number`

Defined in: [engine/types.ts:238](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L238)

***

### yearDelta

> **yearDelta**: `number`

Defined in: [engine/types.ts:237](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L237)
