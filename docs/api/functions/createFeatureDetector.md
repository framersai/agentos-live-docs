# Function: createFeatureDetector()

> **createFeatureDetector**(`strategy`, `llmInvoker?`): [`IContentFeatureDetector`](../interfaces/IContentFeatureDetector.md)

Defined in: [packages/agentos/src/memory/core/encoding/ContentFeatureDetector.ts:194](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/encoding/ContentFeatureDetector.ts#L194)

## Parameters

### strategy

`"hybrid"` | `"llm"` | `"keyword"`

### llmInvoker?

(`system`, `user`) => `Promise`\<`string`\>

## Returns

[`IContentFeatureDetector`](../interfaces/IContentFeatureDetector.md)
