# Interface: ProgressionHookContext

Defined in: [apps/paracosm/src/engine/types.ts:251](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L251)

Context passed to the scenario progression hook during between-turn advancement.

## Properties

### agents

> **agents**: [`Agent`](Agent.md)[]

Defined in: [apps/paracosm/src/engine/types.ts:253](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L253)

All agents (mutable: the hook modifies health fields in place)

***

### rng

> **rng**: `object`

Defined in: [apps/paracosm/src/engine/types.ts:259](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L259)

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

### startTime

> **startTime**: `number`

Defined in: [apps/paracosm/src/engine/types.ts:257](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L257)

***

### time

> **time**: `number`

Defined in: [apps/paracosm/src/engine/types.ts:255](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L255)

***

### timeDelta

> **timeDelta**: `number`

Defined in: [apps/paracosm/src/engine/types.ts:254](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L254)

***

### turn

> **turn**: `number`

Defined in: [apps/paracosm/src/engine/types.ts:256](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L256)
