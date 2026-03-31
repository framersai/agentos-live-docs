# Interface: MediaProviderPreference

Defined in: [packages/agentos/src/media/ProviderPreferences.ts:68](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/ProviderPreferences.ts#L68)

Per-modality provider preference configuration.

- `preferred` — Ordered list of provider IDs to try first. Providers not in
  this list are excluded. When omitted the full available list is used.
- `weights` — Optional weight map for weighted random selection. Providers
  not listed default to weight `1`.
- `blocked` — Provider IDs to unconditionally exclude. Applied after the
  preferred filter so a provider can be both preferred *and* blocked (the
  block wins).

## Properties

### blocked?

> `optional` **blocked**: `string`[]

Defined in: [packages/agentos/src/media/ProviderPreferences.ts:74](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/ProviderPreferences.ts#L74)

Provider IDs to unconditionally exclude.

***

### preferred?

> `optional` **preferred**: `string`[]

Defined in: [packages/agentos/src/media/ProviderPreferences.ts:70](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/ProviderPreferences.ts#L70)

Ordered list of preferred provider IDs.

***

### weights?

> `optional` **weights**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/media/ProviderPreferences.ts:72](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/media/ProviderPreferences.ts#L72)

Weight map for weighted random selection (default weight is `1`).
