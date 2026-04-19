# Class: SeededRng

Defined in: [engine/core/rng.ts:5](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/rng.ts#L5)

Mulberry32 — fast 32-bit seeded PRNG.
Deterministic: same seed always produces same sequence.

## Constructors

### Constructor

> **new SeededRng**(`seed`): `SeededRng`

Defined in: [engine/core/rng.ts:8](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/rng.ts#L8)

#### Parameters

##### seed

`number`

#### Returns

`SeededRng`

## Methods

### chance()

> **chance**(`probability`): `boolean`

Defined in: [engine/core/rng.ts:26](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/rng.ts#L26)

Returns true with the given probability (0-1).

#### Parameters

##### probability

`number`

#### Returns

`boolean`

***

### int()

> **int**(`min`, `max`): `number`

Defined in: [engine/core/rng.ts:21](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/rng.ts#L21)

Returns an integer in [min, max] inclusive.

#### Parameters

##### min

`number`

##### max

`number`

#### Returns

`number`

***

### next()

> **next**(): `number`

Defined in: [engine/core/rng.ts:13](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/rng.ts#L13)

Returns a float in [0, 1).

#### Returns

`number`

***

### pick()

> **pick**\<`T`\>(`arr`): `T`

Defined in: [engine/core/rng.ts:31](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/rng.ts#L31)

Picks a random element from an array.

#### Type Parameters

##### T

`T`

#### Parameters

##### arr

readonly `T`[]

#### Returns

`T`

***

### turnSeed()

> **turnSeed**(`turn`): `SeededRng`

Defined in: [engine/core/rng.ts:36](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/rng.ts#L36)

Derives a child RNG for a specific turn (deterministic sub-stream).

#### Parameters

##### turn

`number`

#### Returns

`SeededRng`
