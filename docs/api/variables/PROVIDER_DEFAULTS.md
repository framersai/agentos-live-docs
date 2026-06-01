# Variable: PROVIDER\_DEFAULTS

> `const` **PROVIDER\_DEFAULTS**: `Record`\<`string`, [`ProviderDefaults`](../interfaces/ProviderDefaults.md)\>

Defined in: [packages/agentos/src/api/runtime/provider-defaults.ts:37](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/runtime/provider-defaults.ts#L37)

Registry of default models per provider, keyed by provider identifier.

These defaults are used when a caller specifies `provider: 'openai'` without
an explicit `model` field.  The task type (`'text'`, `'image'`, `'embedding'`)
selects which sub-key to read.
