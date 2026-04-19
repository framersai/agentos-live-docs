# Interface: ITokenUsage

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:124](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/storage/IStorageAdapter.ts#L124)

Token usage statistics for LLM API calls.

## Interface

ITokenUsage

## Example

```typescript
const usage: ITokenUsage = {
  promptTokens: 150,
  completionTokens: 75,
  totalTokens: 225
};
```

## Properties

### cacheCreationTokens?

> `optional` **cacheCreationTokens**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:140](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/storage/IStorageAdapter.ts#L140)

Tokens written to the provider's prompt-prefix cache as a new entry
(Anthropic `cache_creation_input_tokens`). Same undefined-vs-zero
convention as `cacheReadTokens`.

***

### cacheReadTokens?

> `optional` **cacheReadTokens**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:134](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/storage/IStorageAdapter.ts#L134)

Tokens served from the provider's prompt-prefix cache (Anthropic
`cache_read_input_tokens`). Optional — undefined when no aggregated
message reported cache activity, so consumers can distinguish
"provider did not report" from "zero hits".

***

### completionTokens

> **completionTokens**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:126](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/storage/IStorageAdapter.ts#L126)

Number of tokens in the completion (output)

***

### promptTokens

> **promptTokens**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:125](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/storage/IStorageAdapter.ts#L125)

Number of tokens in the prompt (input)

***

### totalTokens

> **totalTokens**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:127](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/storage/IStorageAdapter.ts#L127)

Total tokens used (prompt + completion)
