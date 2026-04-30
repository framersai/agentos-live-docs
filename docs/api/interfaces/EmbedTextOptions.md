# Interface: EmbedTextOptions

Defined in: [packages/agentos/src/api/embedText.ts:38](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/embedText.ts#L38)

Options for an [embedText](../functions/embedText.md) call.

At minimum, `input` must be provided. Provider/model resolution follows
the same rules as [generateText](../functions/generateText.md): supply `provider`, `model`
(optionally in `provider:model` format), or rely on env-var auto-detection.

## Example

```ts
const opts: EmbedTextOptions = {
  model: 'openai:text-embedding-3-small',
  input: ['Hello world', 'Goodbye world'],
  dimensions: 256,
};
```

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/embedText.ts:76](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/embedText.ts#L76)

Override the API key instead of reading from environment variables.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/embedText.ts:79](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/embedText.ts#L79)

Override the provider base URL (useful for local proxies or Ollama).

***

### dimensions?

> `optional` **dimensions**: `number`

Defined in: [packages/agentos/src/api/embedText.ts:73](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/embedText.ts#L73)

Desired output dimensionality. Only honoured by models that support
dimension reduction (e.g. OpenAI `text-embedding-3-*` with `dimensions`).
Ignored when the model has a fixed output size.

***

### input

> **input**: `string` \| `string`[]

Defined in: [packages/agentos/src/api/embedText.ts:66](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/embedText.ts#L66)

Text(s) to embed. Pass a single string for one embedding or an array
for batch processing.

#### Example

```ts
// Single input
input: 'Hello world'
// Batch input
input: ['Hello world', 'Goodbye world']
```

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/embedText.ts:52](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/embedText.ts#L52)

Model identifier. Accepts `"provider:model"` or plain model name with `provider`.

#### Example

```ts
`"openai:text-embedding-3-small"`, `"nomic-embed-text"`
```

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/embedText.ts:45](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/embedText.ts#L45)

Provider name. When supplied without `model`, the default embedding model
for the provider is resolved automatically from the built-in defaults.

#### Example

```ts
`"openai"`, `"ollama"`, `"openrouter"`
```

***

### usageLedger?

> `optional` **usageLedger**: [`AgentOSUsageLedgerOptions`](AgentOSUsageLedgerOptions.md)

Defined in: [packages/agentos/src/api/embedText.ts:82](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/embedText.ts#L82)

Optional durable usage ledger configuration for helper-level accounting.
