# Class: ExtensionLoader

Defined in: [packages/agentos/src/extensions/ExtensionLoader.ts:57](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionLoader.ts#L57)

Loads and manages extensions from various sources

## Constructors

### Constructor

> **new ExtensionLoader**(`manager`, `config?`): `ExtensionLoader`

Defined in: [packages/agentos/src/extensions/ExtensionLoader.ts:62](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionLoader.ts#L62)

#### Parameters

##### manager

[`ExtensionManager`](ExtensionManager.md)

##### config?

`ExtensionLoaderConfig` = `{}`

#### Returns

`ExtensionLoader`

## Methods

### getAvailableTools()

> **getAvailableTools**(): `object`[]

Defined in: [packages/agentos/src/extensions/ExtensionLoader.ts:340](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionLoader.ts#L340)

Get available tools from all loaded extensions

#### Returns

`object`[]

***

### getExtensionMetadata()

> **getExtensionMetadata**(): `Map`\<`string`, `ExtensionMetadata`\>

Defined in: [packages/agentos/src/extensions/ExtensionLoader.ts:333](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionLoader.ts#L333)

Get extension metadata

#### Returns

`Map`\<`string`, `ExtensionMetadata`\>

***

### getLoadedExtensions()

> **getLoadedExtensions**(): `Map`\<`string`, [`ExtensionPack`](../interfaces/ExtensionPack.md)\>

Defined in: [packages/agentos/src/extensions/ExtensionLoader.ts:326](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionLoader.ts#L326)

Get loaded extensions

#### Returns

`Map`\<`string`, [`ExtensionPack`](../interfaces/ExtensionPack.md)\>

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/ExtensionLoader.ts:82](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionLoader.ts#L82)

Initialize and load all configured extensions

#### Returns

`Promise`\<`void`\>

***

### loadExtension()

> **loadExtension**(`packageName`): `Promise`\<[`ExtensionPack`](../interfaces/ExtensionPack.md) \| `null`\>

Defined in: [packages/agentos/src/extensions/ExtensionLoader.ts:193](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionLoader.ts#L193)

Load a specific extension

#### Parameters

##### packageName

`string`

#### Returns

`Promise`\<[`ExtensionPack`](../interfaces/ExtensionPack.md) \| `null`\>

***

### reload()

> **reload**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/ExtensionLoader.ts:368](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionLoader.ts#L368)

Reload all extensions

#### Returns

`Promise`\<`void`\>

***

### searchNpmExtensions()

> **searchNpmExtensions**(`query?`): `Promise`\<`ExtensionMetadata`[]\>

Defined in: [packages/agentos/src/extensions/ExtensionLoader.ts:286](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/ExtensionLoader.ts#L286)

Search npm for AgentOS extensions

#### Parameters

##### query?

`string`

#### Returns

`Promise`\<`ExtensionMetadata`[]\>
