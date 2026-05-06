# Class: SeededRng

Defined in: [apps/paracosm/src/engine/core/rng.ts:5](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/rng.ts#L5)

Mulberry32: fast 32-bit seeded PRNG.
Deterministic: same seed always produces same sequence.

## Constructors

### Constructor

> **new SeededRng**(`seed`): `SeededRng`

Defined in: [apps/paracosm/src/engine/core/rng.ts:8](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/rng.ts#L8)

#### Parameters

##### seed

`number`

#### Returns

`SeededRng`

## Methods

### chance()

> **chance**(`probability`): `boolean`

Defined in: [apps/paracosm/src/engine/core/rng.ts:42](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/rng.ts#L42)

Returns true with the given probability (0-1).

#### Parameters

##### probability

`number`

#### Returns

`boolean`

***

### getState()

> **getState**(): `number`

Defined in: [apps/paracosm/src/engine/core/rng.ts:14](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/rng.ts#L14)

Current PRNG state, as a 32-bit integer. Captured into snapshots
 and restored via `fromState` for deterministic resume.

#### Returns

`number`

***

### int()

> **int**(`min`, `max`): `number`

Defined in: [apps/paracosm/src/engine/core/rng.ts:37](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/rng.ts#L37)

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

Defined in: [apps/paracosm/src/engine/core/rng.ts:29](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/rng.ts#L29)

Returns a float in [0, 1).

#### Returns

`number`

***

### pick()

> **pick**\<`T`\>(`arr`): `T`

Defined in: [apps/paracosm/src/engine/core/rng.ts:47](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/rng.ts#L47)

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

Defined in: [apps/paracosm/src/engine/core/rng.ts:52](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/rng.ts#L52)

Derives a child RNG for a specific turn (deterministic sub-stream).

#### Parameters

##### turn

`number`

#### Returns

`SeededRng`

***

### fromState()

> `static` **fromState**(`state`): `SeededRng`

Defined in: [apps/paracosm/src/engine/core/rng.ts:22](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/rng.ts#L22)

Construct a SeededRng positioned at a specific internal state.
 Different from the seed-based constructor: the returned RNG
 produces the same sequence as the source did AT THE MOMENT
 getState() was captured.

#### Parameters

##### state

`number`

#### Returns

`SeededRng`
