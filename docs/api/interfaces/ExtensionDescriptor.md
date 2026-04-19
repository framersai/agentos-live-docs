# Interface: ExtensionDescriptor\<TPayload\>

Defined in: [packages/agentos/src/extensions/types.ts:95](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/types.ts#L95)

Unified descriptor contract consumed by the extension registry. Concrete
descriptor types (e.g., tools, guardrails) extend this shape with payloads
specific to their domain.

## Extended by

- [`ActiveExtensionDescriptor`](ActiveExtensionDescriptor.md)

## Type Parameters

### TPayload

`TPayload` = `unknown`

## Properties

### enableByDefault?

> `optional` **enableByDefault**: `boolean`

Defined in: [packages/agentos/src/extensions/types.ts:114](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/types.ts#L114)

Flag indicating whether the descriptor should be enabled by default when
discovered. Manifests or overrides can still disable it explicitly.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:100](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/types.ts#L100)

Unique identifier for the descriptor within its kind. Subsequent
descriptors with the same id stack on top of previous entries.

***

### kind

> **kind**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:104](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/types.ts#L104)

High-level category of the descriptor (tool, guardrail, etc.).

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/extensions/types.ts:118](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/types.ts#L118)

Arbitrary metadata for tooling or pack-specific usage.

***

### onActivate()?

> `optional` **onActivate**: (`context`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/types.ts:131](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/types.ts#L131)

Optional lifecycle hook invoked when the descriptor becomes the active
entry for its id.

#### Parameters

##### context

[`ExtensionLifecycleContext`](ExtensionLifecycleContext.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onDeactivate()?

> `optional` **onDeactivate**: (`context`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/types.ts:136](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/types.ts#L136)

Optional lifecycle hook invoked when the descriptor is superseded or
removed.

#### Parameters

##### context

[`ExtensionLifecycleContext`](ExtensionLifecycleContext.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### payload

> **payload**: `TPayload`

Defined in: [packages/agentos/src/extensions/types.ts:122](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/types.ts#L122)

The payload consumed by the runtime (e.g., tool factory function).

***

### priority?

> `optional` **priority**: `number`

Defined in: [packages/agentos/src/extensions/types.ts:109](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/types.ts#L109)

Optional priority used during manifest loading. Higher numbers load later,
allowing them to supersede earlier descriptors with the same id.

***

### requiredSecrets?

> `optional` **requiredSecrets**: [`ExtensionSecretRequirement`](ExtensionSecretRequirement.md)[]

Defined in: [packages/agentos/src/extensions/types.ts:141](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/types.ts#L141)

Declares the secrets (API keys, credentials) the descriptor needs in
order to function.

***

### source?

> `optional` **source**: [`ExtensionSourceMetadata`](ExtensionSourceMetadata.md)

Defined in: [packages/agentos/src/extensions/types.ts:126](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/extensions/types.ts#L126)

Provenance information for the descriptor.
