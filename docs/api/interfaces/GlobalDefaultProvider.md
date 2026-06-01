# Interface: GlobalDefaultProvider

Defined in: [packages/agentos/src/api/runtime/global-default.ts:28](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/runtime/global-default.ts#L28)

Shape of the global default-provider config.

All fields are optional. Setting just `provider` lets AgentOS pick
the provider's default model for each task type; setting `apiKey` /
`baseUrl` provides credentials without touching the environment.

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/runtime/global-default.ts:34](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/runtime/global-default.ts#L34)

API key used when no inline override is supplied.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/runtime/global-default.ts:36](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/runtime/global-default.ts#L36)

Base URL override (useful for proxies, local Ollama, etc.).

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/runtime/global-default.ts:32](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/runtime/global-default.ts#L32)

Default model identifier for this provider (e.g. `"gpt-4o-mini"`).

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/runtime/global-default.ts:30](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/runtime/global-default.ts#L30)

Provider identifier (e.g. `"openai"`, `"anthropic"`, `"openrouter"`, `"ollama"`).
