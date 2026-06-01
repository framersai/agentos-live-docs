# Interface: ModelOption

Defined in: [packages/agentos/src/api/model.ts:235](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/model.ts#L235)

Flexible model option accepted by the high-level API functions.

At least one of `provider` or `model` must be supplied, or an appropriate
API key environment variable must be set for auto-detection.

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/model.ts:250](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/model.ts#L250)

API key override (takes precedence over environment variables).

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/model.ts:252](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/model.ts#L252)

Base URL override (useful for local proxies or Ollama).

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/model.ts:248](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/model.ts#L248)

Explicit model identifier.  Accepted in two formats:
- `"provider:model"` — legacy format (e.g. `"openai:gpt-4o"`).  `provider` is ignored.
- `"model"` — plain name (e.g. `"gpt-4o-mini"`).  Requires `provider` or env-var auto-detect.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/model.ts:242](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/model.ts#L242)

Provider name.  When set without `model`, the default model for the
requested task is looked up in [PROVIDER\_DEFAULTS](../variables/PROVIDER_DEFAULTS.md).

#### Example

```ts
`"openai"`, `"anthropic"`, `"ollama"`
```
