# Interface: ModelOption

Defined in: [packages/agentos/src/api/model.ts:219](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/model.ts#L219)

Flexible model option accepted by the high-level API functions.

At least one of `provider` or `model` must be supplied, or an appropriate
API key environment variable must be set for auto-detection.

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/model.ts:234](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/model.ts#L234)

API key override (takes precedence over environment variables).

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/model.ts:236](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/model.ts#L236)

Base URL override (useful for local proxies or Ollama).

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/model.ts:232](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/model.ts#L232)

Explicit model identifier.  Accepted in two formats:
- `"provider:model"` — legacy format (e.g. `"openai:gpt-4o"`).  `provider` is ignored.
- `"model"` — plain name (e.g. `"gpt-4o-mini"`).  Requires `provider` or env-var auto-detect.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/model.ts:226](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/model.ts#L226)

Provider name.  When set without `model`, the default model for the
requested task is looked up in [PROVIDER\_DEFAULTS](../variables/PROVIDER_DEFAULTS.md).

#### Example

```ts
`"openai"`, `"anthropic"`, `"ollama"`
```
