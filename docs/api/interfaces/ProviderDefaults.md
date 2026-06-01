# Interface: ProviderDefaults

Defined in: [packages/agentos/src/api/runtime/provider-defaults.ts:16](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/runtime/provider-defaults.ts#L16)

Default model identifiers for a given provider, keyed by task type.
Only fields relevant to the provider need to be populated.

## Properties

### cheap?

> `optional` **cheap**: `string`

Defined in: [packages/agentos/src/api/runtime/provider-defaults.ts:24](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/runtime/provider-defaults.ts#L24)

Cheapest model for internal/discovery use

***

### embedding?

> `optional` **embedding**: `string`

Defined in: [packages/agentos/src/api/runtime/provider-defaults.ts:22](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/runtime/provider-defaults.ts#L22)

Default embedding model

***

### image?

> `optional` **image**: `string`

Defined in: [packages/agentos/src/api/runtime/provider-defaults.ts:20](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/runtime/provider-defaults.ts#L20)

Default model for generateImage

***

### text?

> `optional` **text**: `string`

Defined in: [packages/agentos/src/api/runtime/provider-defaults.ts:18](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/runtime/provider-defaults.ts#L18)

Default model for generateText / streamText
