# Variable: PROVIDER\_DEFAULTS

> `const` **PROVIDER\_DEFAULTS**: `Record`\<`string`, [`ProviderDefaults`](../interfaces/ProviderDefaults.md)\>

Defined in: [packages/agentos/src/api/runtime/provider-defaults.ts:36](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/provider-defaults.ts#L36)

Registry of default models per provider, keyed by provider identifier.

These defaults are used when a caller specifies `provider: 'openai'` without
an explicit `model` field.  The task type (`'text'`, `'image'`, `'embedding'`)
selects which sub-key to read.
