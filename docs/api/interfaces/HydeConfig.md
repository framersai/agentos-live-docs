# Interface: HydeConfig

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:24](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/HydeRetriever.ts#L24)

## Properties

### adaptiveThreshold?

> `optional` **adaptiveThreshold**: `boolean`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:34](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/HydeRetriever.ts#L34)

Use adaptive thresholding (step down when no results). Default: true.

***

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:26](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/HydeRetriever.ts#L26)

Enable HyDE retrieval. Default: false.

***

### fullAnswerGranularity?

> `optional` **fullAnswerGranularity**: `boolean`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:40](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/HydeRetriever.ts#L40)

Use full-answer granularity (recommended by research). Default: true.

***

### hypothesisCount?

> `optional` **hypothesisCount**: `number`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:55](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/HydeRetriever.ts#L55)

Number of diverse hypothetical documents to generate per query.

Multi-hypothesis HyDE generates N hypotheses from different perspectives
(technical, practical/example, overview) and searches with each embedding.
Results are deduplicated by chunk ID, keeping the highest score.

Higher values improve recall at the cost of additional LLM calls.
- 1: Original single-hypothesis HyDE (fastest)
- 3: Recommended default (good diversity/cost tradeoff)
- 5: Maximum diversity (highest recall, most expensive)

Default: 3.

***

### hypothesisSystemPrompt?

> `optional` **hypothesisSystemPrompt**: `string`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:38](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/HydeRetriever.ts#L38)

Custom system prompt for hypothesis generation.

***

### initialThreshold?

> `optional` **initialThreshold**: `number`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:28](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/HydeRetriever.ts#L28)

Initial similarity threshold. Default: 0.7.

***

### maxHypothesisTokens?

> `optional` **maxHypothesisTokens**: `number`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:36](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/HydeRetriever.ts#L36)

Max tokens for hypothesis generation. Default: 200.

***

### minThreshold?

> `optional` **minThreshold**: `number`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:30](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/HydeRetriever.ts#L30)

Minimum threshold to step down to. Default: 0.3.

***

### thresholdStep?

> `optional` **thresholdStep**: `number`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:32](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/HydeRetriever.ts#L32)

Step size for adaptive thresholding. Default: 0.1.
