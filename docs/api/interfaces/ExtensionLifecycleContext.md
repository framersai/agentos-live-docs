# Interface: ExtensionLifecycleContext

Defined in: [packages/agentos/src/extensions/types.ts:51](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L51)

Context object passed to lifecycle hooks when descriptors are activated or
deactivated. Additional properties can be added as the extension runtime
evolves.

## Extended by

- [`ExtensionContext`](ExtensionContext.md)

## Properties

### getSecret()?

> `optional` **getSecret**: (`secretId`) => `string` \| `undefined`

Defined in: [packages/agentos/src/extensions/types.ts:57](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L57)

Resolves a secret value registered with AgentOS / the host application.
Returns `undefined` when a secret is not configured.

#### Parameters

##### secretId

`string`

#### Returns

`string` \| `undefined`

***

### logger?

> `optional` **logger**: [`ILogger`](ILogger.md)

Defined in: [packages/agentos/src/extensions/types.ts:52](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L52)

***

### services?

> `optional` **services**: [`ISharedServiceRegistry`](ISharedServiceRegistry.md)

Defined in: [packages/agentos/src/extensions/types.ts:61](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L61)

Shared singleton registry for lazy-loading heavyweight extension services.
