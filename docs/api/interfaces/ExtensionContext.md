# Interface: ExtensionContext\<TOptions\>

Defined in: [packages/agentos/src/extensions/types.ts:71](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L71)

Context passed to extension-pack factory helpers (e.g. `createExtensionPack()`).

AgentOS itself loads packs via manifest factories; this type exists to provide
a common shape for extension packages that expose a `createExtensionPack(context)`
function for direct, programmatic consumption.

## Extends

- [`ExtensionLifecycleContext`](ExtensionLifecycleContext.md)

## Type Parameters

### TOptions

`TOptions` = `Record`\<`string`, `unknown`\>

## Properties

### getSecret()?

> `optional` **getSecret**: (`secretId`) => `string` \| `undefined`

Defined in: [packages/agentos/src/extensions/types.ts:57](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L57)

Resolves a secret value registered with AgentOS / the host application.
Returns `undefined` when a secret is not configured.

#### Parameters

##### secretId

`string`

#### Returns

`string` \| `undefined`

#### Inherited from

[`ExtensionLifecycleContext`](ExtensionLifecycleContext.md).[`getSecret`](ExtensionLifecycleContext.md#getsecret)

***

### logger?

> `optional` **logger**: [`ILogger`](ILogger.md)

Defined in: [packages/agentos/src/extensions/types.ts:52](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L52)

#### Inherited from

[`ExtensionLifecycleContext`](ExtensionLifecycleContext.md).[`logger`](ExtensionLifecycleContext.md#logger)

***

### onActivate()?

> `optional` **onActivate**: () => `void` \| `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/types.ts:74](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L74)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onDeactivate()?

> `optional` **onDeactivate**: () => `void` \| `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/types.ts:75](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L75)

#### Returns

`void` \| `Promise`\<`void`\>

***

### options?

> `optional` **options**: `TOptions`

Defined in: [packages/agentos/src/extensions/types.ts:73](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L73)

***

### services?

> `optional` **services**: [`ISharedServiceRegistry`](ISharedServiceRegistry.md)

Defined in: [packages/agentos/src/extensions/types.ts:61](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L61)

Shared singleton registry for lazy-loading heavyweight extension services.

#### Inherited from

[`ExtensionLifecycleContext`](ExtensionLifecycleContext.md).[`services`](ExtensionLifecycleContext.md#services)
