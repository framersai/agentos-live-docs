# Type Alias: UnifiedRetrieverEvent

> **UnifiedRetrieverEvent** = \{ `plan`: [`RetrievalPlan`](../interfaces/RetrievalPlan.md); `timestamp`: `number`; `type`: `"unified:plan-start"`; \} \| \{ `cacheAge`: `number`; `query`: `string`; `timestamp`: `number`; `type`: `"unified:memory-cache-hit"`; \} \| \{ `chunkCount`: `number`; `durationMs`: `number`; `source`: `string`; `timestamp`: `number`; `type`: `"unified:source-complete"`; \} \| \{ `error`: `string`; `source`: `string`; `timestamp`: `number`; `type`: `"unified:source-error"`; \} \| \{ `timestamp`: `number`; `totalChunks`: `number`; `type`: `"unified:merge-complete"`; \} \| \{ `durationMs`: `number`; `inputCount`: `number`; `outputCount`: `number`; `timestamp`: `number`; `type`: `"unified:rerank-complete"`; \} \| \{ `subQueries`: `string`[]; `timestamp`: `number`; `type`: `"unified:decompose"`; \} \| \{ `timestamp`: `number`; `tracesStored`: `number`; `type`: `"unified:memory-feedback"`; \} \| \{ `result`: [`UnifiedRetrievalResult`](../interfaces/UnifiedRetrievalResult.md); `timestamp`: `number`; `type`: `"unified:complete"`; \}

Defined in: [packages/agentos/src/rag/unified/types.ts:328](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/unified/types.ts#L328)

Events emitted by the UnifiedRetriever during retrieval.

Follows the same discriminated-union pattern as QueryRouterEventUnion.

## See

UnifiedRetriever
