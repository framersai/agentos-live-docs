# Interface: ContextWindowManagerConfig

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:34](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/context/ContextWindowManager.ts#L34)

## Properties

### infiniteContext

> **infiniteContext**: `Partial`\<[`InfiniteContextConfig`](InfiniteContextConfig.md)\>

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:38](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/context/ContextWindowManager.ts#L38)

Infinite context configuration.

***

### llmInvoker()

> **llmInvoker**: (`prompt`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:40](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/context/ContextWindowManager.ts#L40)

LLM invoker for summarization.

#### Parameters

##### prompt

`string`

#### Returns

`Promise`\<`string`\>

***

### maxContextTokens

> **maxContextTokens**: `number`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:36](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/context/ContextWindowManager.ts#L36)

Maximum context window size in tokens.

***

### observer?

> `optional` **observer**: [`MemoryObserver`](../classes/MemoryObserver.md)

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:42](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/context/ContextWindowManager.ts#L42)

Optional: MemoryObserver for hybrid strategy.

***

### onTracesCreated()?

> `optional` **onTracesCreated**: (`traces`) => `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:46](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/context/ContextWindowManager.ts#L46)

Callback to encode traces into long-term memory.

#### Parameters

##### traces

`Partial`\<[`MemoryTrace`](MemoryTrace.md)\>[]

#### Returns

`Promise`\<`void`\>

***

### reflector?

> `optional` **reflector**: [`MemoryReflector`](../classes/MemoryReflector.md)

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:44](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/context/ContextWindowManager.ts#L44)

Optional: MemoryReflector for hybrid strategy.
