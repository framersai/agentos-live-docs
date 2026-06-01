# Class: TraitModelRegistry

Defined in: [apps/paracosm/src/engine/traits/index.ts:154](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/traits/index.ts#L154)

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

Defined in: [apps/paracosm/src/engine/traits/index.ts:173](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/traits/index.ts#L173)

Return the model or `undefined` if not registered.

#### Parameters

##### modelId

`string`

#### Returns

`TraitModel` \| `undefined`

***

### list()

> **list**(): `TraitModel`[]

Defined in: [apps/paracosm/src/engine/traits/index.ts:185](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/traits/index.ts#L185)

All registered models in registration order.

#### Returns

`TraitModel`[]

***

### register()

> **register**(`model`): `void`

Defined in: [apps/paracosm/src/engine/traits/index.ts:161](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/traits/index.ts#L161)

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

Defined in: [apps/paracosm/src/engine/traits/index.ts:178](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/traits/index.ts#L178)

Return the model or throw `UnknownTraitModelError`.

#### Parameters

##### modelId

`string`

#### Returns

`TraitModel`
