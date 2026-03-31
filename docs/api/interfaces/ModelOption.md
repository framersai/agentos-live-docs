# Interface: ModelOption

Defined in: [packages/agentos/src/api/model.ts:214](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/model.ts#L214)

Flexible model option accepted by the high-level API functions.

At least one of `provider` or `model` must be supplied, or an appropriate
API key environment variable must be set for auto-detection.

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/model.ts:229](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/model.ts#L229)

API key override (takes precedence over environment variables).

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/model.ts:231](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/model.ts#L231)

Base URL override (useful for local proxies or Ollama).

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/model.ts:227](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/model.ts#L227)

Explicit model identifier.  Accepted in two formats:
- `"provider:model"` — legacy format (e.g. `"openai:gpt-4o"`).  `provider` is ignored.
- `"model"` — plain name (e.g. `"gpt-4o-mini"`).  Requires `provider` or env-var auto-detect.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/model.ts:221](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/model.ts#L221)

Provider name.  When set without `model`, the default model for the
requested task is looked up in [PROVIDER\_DEFAULTS](../variables/PROVIDER_DEFAULTS.md).

#### Example

```ts
`"openai"`, `"anthropic"`, `"ollama"`
```
