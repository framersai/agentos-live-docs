# Interface: SharedServiceOptions

Defined in: [packages/agentos/src/extensions/ISharedServiceRegistry.ts:4](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/ISharedServiceRegistry.ts#L4)

Cleanup and discovery metadata for a shared service.

## Properties

### dispose()?

> `optional` **dispose**: (`instance`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/ISharedServiceRegistry.ts:8](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/ISharedServiceRegistry.ts#L8)

Cleanup callback invoked when the service is released.

#### Parameters

##### instance

`unknown`

#### Returns

`void` \| `Promise`\<`void`\>

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [packages/agentos/src/extensions/ISharedServiceRegistry.ts:12](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/ISharedServiceRegistry.ts#L12)

Optional tags describing the service for diagnostics or tooling.
