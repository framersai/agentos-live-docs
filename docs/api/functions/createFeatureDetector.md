# Function: createFeatureDetector()

> **createFeatureDetector**(`strategy`, `llmInvoker?`): [`IContentFeatureDetector`](../interfaces/IContentFeatureDetector.md)

Defined in: [packages/agentos/src/cognition/memory/core/encoding/ContentFeatureDetector.ts:194](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/encoding/ContentFeatureDetector.ts#L194)

## Parameters

### strategy

`"hybrid"` | `"llm"` | `"keyword"`

### llmInvoker?

(`system`, `user`) => `Promise`\<`string`\>

## Returns

[`IContentFeatureDetector`](../interfaces/IContentFeatureDetector.md)
