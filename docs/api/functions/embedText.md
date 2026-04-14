# Function: embedText()

> **embedText**(`opts`): `Promise`\<[`EmbedTextResult`](../interfaces/EmbedTextResult.md)\>

Defined in: [packages/agentos/src/api/embedText.ts:299](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/embedText.ts#L299)

Generates embedding vectors for one or more text inputs using a
provider-agnostic `provider:model` string.

Resolves credentials via the standard AgentOS provider pipeline, then
dispatches to the appropriate embedding endpoint (OpenAI, Ollama, or
OpenRouter). Returns raw float arrays suitable for vector similarity
search, clustering, or any downstream ML pipeline.

## Parameters

### opts

[`EmbedTextOptions`](../interfaces/EmbedTextOptions.md)

Embedding options including model, input text(s), and
  optional provider/key overrides.

## Returns

`Promise`\<[`EmbedTextResult`](../interfaces/EmbedTextResult.md)\>

A promise resolving to the embedding vectors, provider metadata,
  and token usage.

## Throws

When provider resolution fails (missing API key, unknown
  provider, etc.).

## Throws

When the embedding API returns a non-2xx status.

## Example

```ts
import { embedText } from '@framers/agentos';

// Single input
const { embeddings } = await embedText({
  model: 'openai:text-embedding-3-small',
  input: 'Hello world',
});
console.log(embeddings[0].length); // 1536

// Batch with reduced dimensions
const batch = await embedText({
  model: 'openai:text-embedding-3-small',
  input: ['Hello', 'World'],
  dimensions: 256,
});
console.log(batch.embeddings.length); // 2
console.log(batch.embeddings[0].length); // 256
```

## See

 - [generateText](generateText.md) for text generation.
 - [resolveModelOption](resolveModelOption.md) for provider auto-detection behaviour.
