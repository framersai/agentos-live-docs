# Interface: ExtensionLifecycleContext

Defined in: [packages/agentos/src/extensions/types.ts:51](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/types.ts#L51)

Context object passed to lifecycle hooks when descriptors are activated or
deactivated. Additional properties can be added as the extension runtime
evolves.

## Extended by

- [`ExtensionContext`](ExtensionContext.md)

## Properties

### getSecret()?

> `optional` **getSecret**: (`secretId`) => `string` \| `undefined`

Defined in: [packages/agentos/src/extensions/types.ts:57](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/types.ts#L57)

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

Defined in: [packages/agentos/src/extensions/types.ts:52](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/types.ts#L52)

***

### services?

> `optional` **services**: [`ISharedServiceRegistry`](ISharedServiceRegistry.md)

Defined in: [packages/agentos/src/extensions/types.ts:61](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/types.ts#L61)

Shared singleton registry for lazy-loading heavyweight extension services.
