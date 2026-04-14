# Interface: ClassificationResult

Defined in: [packages/agentos/src/query-router/types.ts:106](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L106)

Result of classifying a user query into a complexity tier.
Produced by the [QueryClassifier](../classes/QueryClassifier.md).

## Properties

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:129](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L129)

Confidence score for the classification (0 to 1).
A score below the configured threshold may trigger fallback behaviour.

***

### internalKnowledgeSufficient

> **internalKnowledgeSufficient**: `boolean`

Defined in: [packages/agentos/src/query-router/types.ts:142](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L142)

Whether the agent's internal knowledge is likely sufficient to answer
without any retrieval. When `true` and tier is 0, the router may skip
retrieval entirely.

***

### reasoning

> **reasoning**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:135](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L135)

Human-readable reasoning explaining why this tier was chosen.
Useful for debugging and audit trails.

***

### strategy

> **strategy**: `RetrievalStrategy`

Defined in: [packages/agentos/src/query-router/types.ts:123](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L123)

Retrieval strategy recommendation from the LLM-as-judge classifier.

When the classifier operates in strategy-aware mode, this field is
populated directly from the LLM's structured output. When the classifier
runs in legacy tier-only mode, the strategy is inferred from the tier
via TIER\_TO\_STRATEGY.

#### See

RetrievalStrategy

***

### suggestedSources

> **suggestedSources**: (`"vector"` \| `"graph"` \| `"research"`)[]

Defined in: [packages/agentos/src/query-router/types.ts:148](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L148)

Suggested source types to consult for this query.

#### Example

```ts
['vector', 'graph']
```

***

### tier

> **tier**: [`QueryTier`](../type-aliases/QueryTier.md)

Defined in: [packages/agentos/src/query-router/types.ts:111](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L111)

The assigned complexity tier.

#### See

QueryTier

***

### toolsNeeded

> **toolsNeeded**: `string`[]

Defined in: [packages/agentos/src/query-router/types.ts:154](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L154)

Tool names the classifier believes are needed to answer this query.
Empty array if no tools are required.
