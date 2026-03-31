# Interface: ISharedServiceRegistry

Defined in: [packages/agentos/src/extensions/ISharedServiceRegistry.ts:18](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/ISharedServiceRegistry.ts#L18)

Registry for sharing heavyweight service instances across extensions.

## Methods

### getOrCreate()

> **getOrCreate**\<`T`\>(`serviceId`, `factory`, `options?`): `Promise`\<`T`\>

Defined in: [packages/agentos/src/extensions/ISharedServiceRegistry.ts:22](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/ISharedServiceRegistry.ts#L22)

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

[`SharedServiceOptions`](SharedServiceOptions.md)

#### Returns

`Promise`\<`T`\>

***

### has()

> **has**(`serviceId`): `boolean`

Defined in: [packages/agentos/src/extensions/ISharedServiceRegistry.ts:31](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/ISharedServiceRegistry.ts#L31)

Return true when a service has already been initialized.

#### Parameters

##### serviceId

`string`

#### Returns

`boolean`

***

### release()

> **release**(`serviceId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/ISharedServiceRegistry.ts:36](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/ISharedServiceRegistry.ts#L36)

Dispose a specific service if it exists.

#### Parameters

##### serviceId

`string`

#### Returns

`Promise`\<`void`\>

***

### releaseAll()

> **releaseAll**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/ISharedServiceRegistry.ts:41](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/ISharedServiceRegistry.ts#L41)

Dispose all registered services.

#### Returns

`Promise`\<`void`\>
