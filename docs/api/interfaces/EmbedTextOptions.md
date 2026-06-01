# Interface: EmbedTextOptions

Defined in: [packages/agentos/src/api/embedText.ts:40](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/embedText.ts#L40)

Options for an [embedText](../functions/embedText.md) call.

At minimum, `input` must be provided. Provider/model resolution follows
the same rules as [generateText](../functions/generateText.md): supply `provider`, `model`
(the combined `provider:model` string is also accepted), or rely on
env-var auto-detection.

## Example

```ts
const opts: EmbedTextOptions = {
  provider: 'openai',
  model: 'text-embedding-3-small',
  input: ['Hello world', 'Goodbye world'],
  dimensions: 256,
};
```

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/embedText.ts:79](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/embedText.ts#L79)

Override the API key instead of reading from environment variables.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/embedText.ts:82](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/embedText.ts#L82)

Override the provider base URL (useful for local proxies or Ollama).

***

### dimensions?

> `optional` **dimensions**: `number`

Defined in: [packages/agentos/src/api/embedText.ts:76](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/embedText.ts#L76)

Desired output dimensionality. Only honoured by models that support
dimension reduction (e.g. OpenAI `text-embedding-3-*` with `dimensions`).
Ignored when the model has a fixed output size.

***

### input

> **input**: `string` \| `string`[]

Defined in: [packages/agentos/src/api/embedText.ts:69](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/embedText.ts#L69)

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

Defined in: [packages/agentos/src/api/embedText.ts:55](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/embedText.ts#L55)

Model identifier. Prefer the plain model name with `provider` set;
the combined `"provider:model"` string is also accepted.

#### Example

```ts
`"text-embedding-3-small"` (with `provider: 'openai'`), `"nomic-embed-text"`
```

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/embedText.ts:47](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/embedText.ts#L47)

Provider name. When supplied without `model`, the default embedding model
for the provider is resolved automatically from the built-in defaults.

#### Example

```ts
`"openai"`, `"ollama"`, `"openrouter"`
```

***

### usageLedger?

> `optional` **usageLedger**: [`AgentOSUsageLedgerOptions`](AgentOSUsageLedgerOptions.md)

Defined in: [packages/agentos/src/api/embedText.ts:85](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/embedText.ts#L85)

Optional durable usage ledger configuration for helper-level accounting.
