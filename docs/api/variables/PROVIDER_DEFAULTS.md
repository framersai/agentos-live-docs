# Variable: PROVIDER\_DEFAULTS

> `const` **PROVIDER\_DEFAULTS**: `Record`\<`string`, [`ProviderDefaults`](../interfaces/ProviderDefaults.md)\>

Defined in: [packages/agentos/src/api/runtime/provider-defaults.ts:36](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/runtime/provider-defaults.ts#L36)

Registry of default models per provider, keyed by provider identifier.

These defaults are used when a caller specifies `provider: 'openai'` without
an explicit `model` field.  The task type (`'text'`, `'image'`, `'embedding'`)
selects which sub-key to read.
