# Class: TraitModelRegistry

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:154](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/trait-models/index.ts#L154)

In-memory map of TraitModel by id. The runtime singleton lives at
`traitModelRegistry`; tests and isolated callers can construct
their own via `new TraitModelRegistry()`.

## Constructors

### Constructor

> **new TraitModelRegistry**(): `TraitModelRegistry`

#### Returns

`TraitModelRegistry`

## Methods

### get()

> **get**(`modelId`): `TraitModel` \| `undefined`

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:173](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/trait-models/index.ts#L173)

Return the model or `undefined` if not registered.

#### Parameters

##### modelId

`string`

#### Returns

`TraitModel` \| `undefined`

***

### list()

> **list**(): `TraitModel`[]

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:185](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/trait-models/index.ts#L185)

All registered models in registration order.

#### Returns

`TraitModel`[]

***

### register()

> **register**(`model`): `void`

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:161](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/trait-models/index.ts#L161)

Register a model. Throws if a model with the same id is already
registered (registration-time-only; no live re-binding).

#### Parameters

##### model

`TraitModel`

#### Returns

`void`

***

### require()

> **require**(`modelId`): `TraitModel`

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:178](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/trait-models/index.ts#L178)

Return the model or throw `UnknownTraitModelError`.

#### Parameters

##### modelId

`string`

#### Returns

`TraitModel`
