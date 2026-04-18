# Interface: ITokenUsage

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:124](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/storage/IStorageAdapter.ts#L124)

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

### completionTokens

> **completionTokens**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:126](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/storage/IStorageAdapter.ts#L126)

Number of tokens in the completion (output)

***

### promptTokens

> **promptTokens**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:125](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/storage/IStorageAdapter.ts#L125)

Number of tokens in the prompt (input)

***

### totalTokens

> **totalTokens**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:127](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/storage/IStorageAdapter.ts#L127)

Total tokens used (prompt + completion)
