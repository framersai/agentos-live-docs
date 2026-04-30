# Class: SharedServiceRegistry

Defined in: [packages/agentos/src/extensions/SharedServiceRegistry.ts:6](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/SharedServiceRegistry.ts#L6)

Thread-safe shared-service registry for extension lifecycle context.

## Implements

- [`ISharedServiceRegistry`](../interfaces/ISharedServiceRegistry.md)

## Constructors

### Constructor

> **new SharedServiceRegistry**(): `SharedServiceRegistry`

#### Returns

`SharedServiceRegistry`

## Methods

### getOrCreate()

> **getOrCreate**\<`T`\>(`serviceId`, `factory`, `options?`): `Promise`\<`T`\>

Defined in: [packages/agentos/src/extensions/SharedServiceRegistry.ts:12](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/SharedServiceRegistry.ts#L12)

Return an existing service or lazily create it once.

#### Type Parameters

##### T

`T`

#### Parameters

##### serviceId

`string`

##### factory

() => `T` \| `Promise`\<`T`\>

##### options?

[`SharedServiceOptions`](../interfaces/SharedServiceOptions.md)

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`ISharedServiceRegistry`](../interfaces/ISharedServiceRegistry.md).[`getOrCreate`](../interfaces/ISharedServiceRegistry.md#getorcreate)

***

### has()

> **has**(`serviceId`): `boolean`

Defined in: [packages/agentos/src/extensions/SharedServiceRegistry.ts:49](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/SharedServiceRegistry.ts#L49)

Return true when a service has already been initialized.

#### Parameters

##### serviceId

`string`

#### Returns

`boolean`

#### Implementation of

[`ISharedServiceRegistry`](../interfaces/ISharedServiceRegistry.md).[`has`](../interfaces/ISharedServiceRegistry.md#has)

***

### release()

> **release**(`serviceId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/SharedServiceRegistry.ts:53](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/SharedServiceRegistry.ts#L53)

Dispose a specific service if it exists.

#### Parameters

##### serviceId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ISharedServiceRegistry`](../interfaces/ISharedServiceRegistry.md).[`release`](../interfaces/ISharedServiceRegistry.md#release)

***

### releaseAll()

> **releaseAll**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/SharedServiceRegistry.ts:74](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/SharedServiceRegistry.ts#L74)

Dispose all registered services.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ISharedServiceRegistry`](../interfaces/ISharedServiceRegistry.md).[`releaseAll`](../interfaces/ISharedServiceRegistry.md#releaseall)
