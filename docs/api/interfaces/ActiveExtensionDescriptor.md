# Interface: ActiveExtensionDescriptor\<TPayload\>

Defined in: [packages/agentos/src/extensions/types.ts:147](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L147)

Active descriptor paired with resolved priority and original stack index.

## Extends

- [`ExtensionDescriptor`](ExtensionDescriptor.md)\<`TPayload`\>

## Type Parameters

### TPayload

`TPayload` = `unknown`

## Properties

### enableByDefault?

> `optional` **enableByDefault**: `boolean`

Defined in: [packages/agentos/src/extensions/types.ts:114](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L114)

Flag indicating whether the descriptor should be enabled by default when
discovered. Manifests or overrides can still disable it explicitly.

#### Inherited from

[`ExtensionDescriptor`](ExtensionDescriptor.md).[`enableByDefault`](ExtensionDescriptor.md#enablebydefault)

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:100](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L100)

Unique identifier for the descriptor within its kind. Subsequent
descriptors with the same id stack on top of previous entries.

#### Inherited from

[`ExtensionDescriptor`](ExtensionDescriptor.md).[`id`](ExtensionDescriptor.md#id)

***

### kind

> **kind**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:104](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L104)

High-level category of the descriptor (tool, guardrail, etc.).

#### Inherited from

[`ExtensionDescriptor`](ExtensionDescriptor.md).[`kind`](ExtensionDescriptor.md#kind)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/extensions/types.ts:118](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L118)

Arbitrary metadata for tooling or pack-specific usage.

#### Inherited from

[`ExtensionDescriptor`](ExtensionDescriptor.md).[`metadata`](ExtensionDescriptor.md#metadata)

***

### onActivate()?

> `optional` **onActivate**: (`context`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/types.ts:131](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L131)

Optional lifecycle hook invoked when the descriptor becomes the active
entry for its id.

#### Parameters

##### context

[`ExtensionLifecycleContext`](ExtensionLifecycleContext.md)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

[`ExtensionDescriptor`](ExtensionDescriptor.md).[`onActivate`](ExtensionDescriptor.md#onactivate)

***

### onDeactivate()?

> `optional` **onDeactivate**: (`context`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/types.ts:136](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L136)

Optional lifecycle hook invoked when the descriptor is superseded or
removed.

#### Parameters

##### context

[`ExtensionLifecycleContext`](ExtensionLifecycleContext.md)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

[`ExtensionDescriptor`](ExtensionDescriptor.md).[`onDeactivate`](ExtensionDescriptor.md#ondeactivate)

***

### payload

> **payload**: `TPayload`

Defined in: [packages/agentos/src/extensions/types.ts:122](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L122)

The payload consumed by the runtime (e.g., tool factory function).

#### Inherited from

[`ExtensionDescriptor`](ExtensionDescriptor.md).[`payload`](ExtensionDescriptor.md#payload)

***

### priority?

> `optional` **priority**: `number`

Defined in: [packages/agentos/src/extensions/types.ts:109](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L109)

Optional priority used during manifest loading. Higher numbers load later,
allowing them to supersede earlier descriptors with the same id.

#### Inherited from

[`ExtensionDescriptor`](ExtensionDescriptor.md).[`priority`](ExtensionDescriptor.md#priority)

***

### requiredSecrets?

> `optional` **requiredSecrets**: [`ExtensionSecretRequirement`](ExtensionSecretRequirement.md)[]

Defined in: [packages/agentos/src/extensions/types.ts:141](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L141)

Declares the secrets (API keys, credentials) the descriptor needs in
order to function.

#### Inherited from

[`ExtensionDescriptor`](ExtensionDescriptor.md).[`requiredSecrets`](ExtensionDescriptor.md#requiredsecrets)

***

### resolvedPriority

> **resolvedPriority**: `number`

Defined in: [packages/agentos/src/extensions/types.ts:152](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L152)

Resolved numeric priority used to order descriptors inside a stack.

***

### source?

> `optional` **source**: [`ExtensionSourceMetadata`](ExtensionSourceMetadata.md)

Defined in: [packages/agentos/src/extensions/types.ts:126](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L126)

Provenance information for the descriptor.

#### Inherited from

[`ExtensionDescriptor`](ExtensionDescriptor.md).[`source`](ExtensionDescriptor.md#source)

***

### stackIndex

> **stackIndex**: `number`

Defined in: [packages/agentos/src/extensions/types.ts:156](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L156)

0-based insertion position within the stack (lower is older).
