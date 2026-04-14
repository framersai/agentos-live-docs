# Class: MultiRegistryLoader

Defined in: [packages/agentos/src/extensions/MultiRegistryLoader.ts:18](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/MultiRegistryLoader.ts#L18)

Loader that supports multiple registries (npm, GitHub, git, file, URL)

## Constructors

### Constructor

> **new MultiRegistryLoader**(`manager`, `config`): `MultiRegistryLoader`

Defined in: [packages/agentos/src/extensions/MultiRegistryLoader.ts:22](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/MultiRegistryLoader.ts#L22)

#### Parameters

##### manager

[`ExtensionManager`](ExtensionManager.md)

##### config

[`MultiRegistryConfig`](../interfaces/MultiRegistryConfig.md)

#### Returns

`MultiRegistryLoader`

## Methods

### clearCache()

> **clearCache**(): `void`

Defined in: [packages/agentos/src/extensions/MultiRegistryLoader.ts:208](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/MultiRegistryLoader.ts#L208)

Clear cache

#### Returns

`void`

***

### getCacheStats()

> **getCacheStats**(): `object`

Defined in: [packages/agentos/src/extensions/MultiRegistryLoader.ts:215](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/MultiRegistryLoader.ts#L215)

Get cache statistics

#### Returns

`object`

##### keys

> **keys**: `string`[]

##### size

> **size**: `number`

***

### loadExtension()

> **loadExtension**(`kind`, `extensionId`): `Promise`\<[`ExtensionPack`](../interfaces/ExtensionPack.md) \| `null`\>

Defined in: [packages/agentos/src/extensions/MultiRegistryLoader.ts:32](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/MultiRegistryLoader.ts#L32)

Load an extension of a specific kind from the appropriate registry

#### Parameters

##### kind

`string`

##### extensionId

`string`

#### Returns

`Promise`\<[`ExtensionPack`](../interfaces/ExtensionPack.md) \| `null`\>

***

### loadFromSource()

> **loadFromSource**(`source`, `resourceId`): `Promise`\<[`ExtensionPack`](../interfaces/ExtensionPack.md) \| `null`\>

Defined in: [packages/agentos/src/extensions/MultiRegistryLoader.ts:48](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/MultiRegistryLoader.ts#L48)

Load from a specific registry source

#### Parameters

##### source

[`RegistrySource`](../interfaces/RegistrySource.md)

##### resourceId

`string`

#### Returns

`Promise`\<[`ExtensionPack`](../interfaces/ExtensionPack.md) \| `null`\>
