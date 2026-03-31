# Interface: ProviderDefaults

Defined in: [packages/agentos/src/api/runtime/provider-defaults.ts:15](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/provider-defaults.ts#L15)

Default model identifiers for a given provider, keyed by task type.
Only fields relevant to the provider need to be populated.

## Properties

### cheap?

> `optional` **cheap**: `string`

Defined in: [packages/agentos/src/api/runtime/provider-defaults.ts:23](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/provider-defaults.ts#L23)

Cheapest model for internal/discovery use

***

### embedding?

> `optional` **embedding**: `string`

Defined in: [packages/agentos/src/api/runtime/provider-defaults.ts:21](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/provider-defaults.ts#L21)

Default embedding model

***

### image?

> `optional` **image**: `string`

Defined in: [packages/agentos/src/api/runtime/provider-defaults.ts:19](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/provider-defaults.ts#L19)

Default model for generateImage

***

### text?

> `optional` **text**: `string`

Defined in: [packages/agentos/src/api/runtime/provider-defaults.ts:17](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/provider-defaults.ts#L17)

Default model for generateText / streamText
