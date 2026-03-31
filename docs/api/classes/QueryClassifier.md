# Class: QueryClassifier

Defined in: [packages/agentos/src/query-router/QueryClassifier.ts:492](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/QueryClassifier.ts#L492)

Chain-of-thought LLM classifier that determines retrieval depth (T0-T3)
and retrieval strategy (`none`/`simple`/`moderate`/`complex`) for each
incoming query.

The strategy field controls whether HyDE (Hypothetical Document Embedding)
is engaged during retrieval and at what depth.

## Example

```ts
const classifier = new QueryClassifier({
  model: 'gpt-4o-mini',
  provider: 'openai',
  confidenceThreshold: 0.7,
  maxTier: 3,
  topicList: 'Auth (docs/auth.md)\nDB (docs/db.md)',
  toolList: 'search_code, read_file',
});

const result = await classifier.classify('How does auth work?');
console.log(result.tier);     // 1
console.log(result.strategy); // 'moderate'
```

## Constructors

### Constructor

> **new QueryClassifier**(`config`): `QueryClassifier`

Defined in: [packages/agentos/src/query-router/QueryClassifier.ts:510](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/QueryClassifier.ts#L510)

Creates a new QueryClassifier instance.

#### Parameters

##### config

`QueryClassifierConfig`

Classifier configuration with model, provider, and thresholds.

#### Returns

`QueryClassifier`

## Methods

### classify()

> **classify**(`query`, `conversationHistory?`, `_options?`): `Promise`\<[`ClassificationResult`](../interfaces/ClassificationResult.md)\>

Defined in: [packages/agentos/src/query-router/QueryClassifier.ts:561](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/QueryClassifier.ts#L561)

Classifies a user query into a retrieval tier and strategy.

Steps:
1. Builds a chain-of-thought system prompt with tier definitions, strategy
   definitions, topic list, tool list, and optional conversation context.
2. Calls the LLM via `generateText`.
3. Parses the JSON response (handling optional markdown code fences).
4. Validates and normalises the `strategy` field (falls back to tier-inferred).
5. Applies confidence-based tier bumping: if confidence < threshold, tier += 1.
6. Caps the tier at the configured `maxTier`.
7. On ANY error, returns a safe T1/simple fallback with confidence 0.

#### Parameters

##### query

`string`

The user's query text to classify.

##### conversationHistory?

[`ConversationMessage`](../interfaces/ConversationMessage.md)[]

Optional recent conversation messages for context.

##### \_options?

`QueryRouterRequestOptions`

#### Returns

`Promise`\<[`ClassificationResult`](../interfaces/ClassificationResult.md)\>

A [ClassificationResult](../interfaces/ClassificationResult.md) with tier, strategy, confidence, reasoning, and metadata.

***

### classifyWithPlan()

> **classifyWithPlan**(`query`, `conversationHistory?`, `options?`): `Promise`\<\[[`ClassificationResult`](../interfaces/ClassificationResult.md), `ExecutionPlan`\]\>

Defined in: [packages/agentos/src/query-router/QueryClassifier.ts:624](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/QueryClassifier.ts#L624)

Classifies a query and produces a full [ExecutionPlan](../interfaces/ExecutionPlan.md).

This is an enhanced alternative to [classify](#classify) that evaluates more
dimensions (source selection, memory relevance, modality, temporal
preferences, decomposability, capability recommendations) and outputs a
structured plan that the [UnifiedRetriever](UnifiedRetriever.md) can execute directly,
along with skill/tool/extension recommendations for the agent runtime.

When a CapabilityDiscoveryEngine is attached (via
[setCapabilityDiscoveryEngine](#setcapabilitydiscoveryengine)), the LLM prompt includes Tier 0
summaries (~150 tokens) of all available capabilities, enabling the LLM
to recommend specific skills, tools, and extensions.

Falls back to buildDefaultExecutionPlan with heuristic capability
selection when classification fails or the LLM response is malformed.

#### Parameters

##### query

`string`

The user's query text to classify.

##### conversationHistory?

[`ConversationMessage`](../interfaces/ConversationMessage.md)[]

Optional recent conversation messages for context.

##### options?

`QueryRouterRequestOptions`

#### Returns

`Promise`\<\[[`ClassificationResult`](../interfaces/ClassificationResult.md), `ExecutionPlan`\]\>

A tuple of [ClassificationResult, ExecutionPlan].

#### Example

```typescript
const [classification, plan] = await classifier.classifyWithPlan(
  'Search the web for recent AI news and summarize findings',
);
// plan.skills → [{ skillId: 'web-search', ... }]
// plan.tools → []
const result = await unifiedRetriever.retrieve(query, plan);
```

#### See

 - classify for the simpler tier+strategy classification
 - buildDefaultExecutionPlan for execution plan defaults per strategy level

***

### getCapabilityDiscoveryEngine()

> **getCapabilityDiscoveryEngine**(): `CapabilityDiscoveryEngine` \| `null`

Defined in: [packages/agentos/src/query-router/QueryClassifier.ts:540](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/QueryClassifier.ts#L540)

Get the attached CapabilityDiscoveryEngine, if any.

#### Returns

`CapabilityDiscoveryEngine` \| `null`

The discovery engine instance, or `null` if not configured.

***

### setCapabilityDiscoveryEngine()

> **setCapabilityDiscoveryEngine**(`engine`): `void`

Defined in: [packages/agentos/src/query-router/QueryClassifier.ts:531](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/QueryClassifier.ts#L531)

Attach a CapabilityDiscoveryEngine for Tier 0 capability summaries.

When attached, the plan-aware classifier (`classifyWithPlan`) injects
category-level summaries of all available skills, tools, and extensions
into the LLM prompt. This allows the LLM to recommend capability
activations alongside the retrieval plan, without loading full schemas.

#### Parameters

##### engine

A configured and initialized CapabilityDiscoveryEngine, or `null` to detach.

`CapabilityDiscoveryEngine` | `null`

#### Returns

`void`

#### Example

```typescript
const engine = new CapabilityDiscoveryEngine(embeddingManager, vectorStore);
await engine.initialize({ tools, skills, extensions, channels });
classifier.setCapabilityDiscoveryEngine(engine);
```
