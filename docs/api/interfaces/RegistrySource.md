# Interface: RegistrySource

Defined in: [packages/agentos/src/extensions/RegistryConfig.ts:18](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/RegistryConfig.ts#L18)

Configuration for a single registry source

## Properties

### autoInstall?

> `optional` **autoInstall**: `boolean`

Defined in: [packages/agentos/src/extensions/RegistryConfig.ts:38](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/RegistryConfig.ts#L38)

Whether to auto-install from npm if not present

***

### branch?

> `optional` **branch**: `string`

Defined in: [packages/agentos/src/extensions/RegistryConfig.ts:26](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/RegistryConfig.ts#L26)

Optional branch/tag for git sources

***

### cacheDuration?

> `optional` **cacheDuration**: `number`

Defined in: [packages/agentos/src/extensions/RegistryConfig.ts:35](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/RegistryConfig.ts#L35)

Cache duration in milliseconds (default: 1 hour)

***

### location

> **location**: `string`

Defined in: [packages/agentos/src/extensions/RegistryConfig.ts:23](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/RegistryConfig.ts#L23)

Location (npm package name, GitHub repo, git URL, file path, or HTTP URL)

***

### token?

> `optional` **token**: `string`

Defined in: [packages/agentos/src/extensions/RegistryConfig.ts:29](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/RegistryConfig.ts#L29)

Optional authentication token for private sources

***

### type

> **type**: [`RegistrySourceType`](../type-aliases/RegistrySourceType.md)

Defined in: [packages/agentos/src/extensions/RegistryConfig.ts:20](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/RegistryConfig.ts#L20)

Type of registry source

***

### verified?

> `optional` **verified**: `boolean`

Defined in: [packages/agentos/src/extensions/RegistryConfig.ts:32](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/RegistryConfig.ts#L32)

Whether this is a verified/trusted source
