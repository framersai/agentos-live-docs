# Function: createFeatureDetector()

> **createFeatureDetector**(`strategy`, `llmInvoker?`): [`IContentFeatureDetector`](../interfaces/IContentFeatureDetector.md)

Defined in: [packages/agentos/src/memory/core/encoding/ContentFeatureDetector.ts:194](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/encoding/ContentFeatureDetector.ts#L194)

## Parameters

### strategy

`"hybrid"` | `"llm"` | `"keyword"`

### llmInvoker?

(`system`, `user`) => `Promise`\<`string`\>

## Returns

[`IContentFeatureDetector`](../interfaces/IContentFeatureDetector.md)
