# Function: createFeatureDetector()

> **createFeatureDetector**(`strategy`, `llmInvoker?`): [`IContentFeatureDetector`](../interfaces/IContentFeatureDetector.md)

Defined in: [packages/agentos/src/memory/core/encoding/ContentFeatureDetector.ts:194](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/encoding/ContentFeatureDetector.ts#L194)

## Parameters

### strategy

`"hybrid"` | `"llm"` | `"keyword"`

### llmInvoker?

(`system`, `user`) => `Promise`\<`string`\>

## Returns

[`IContentFeatureDetector`](../interfaces/IContentFeatureDetector.md)
