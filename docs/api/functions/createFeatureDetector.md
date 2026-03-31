# Function: createFeatureDetector()

> **createFeatureDetector**(`strategy`, `llmInvoker?`): [`IContentFeatureDetector`](../interfaces/IContentFeatureDetector.md)

Defined in: [packages/agentos/src/memory/core/encoding/ContentFeatureDetector.ts:194](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/encoding/ContentFeatureDetector.ts#L194)

## Parameters

### strategy

`"hybrid"` | `"llm"` | `"keyword"`

### llmInvoker?

(`system`, `user`) => `Promise`\<`string`\>

## Returns

[`IContentFeatureDetector`](../interfaces/IContentFeatureDetector.md)
