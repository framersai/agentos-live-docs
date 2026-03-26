---
sidebar_label: Query Routing
sidebar_position: 25
---

# Query Routing

> Intelligent query classification and tiered retrieval that routes each user query to exactly the right retrieval depth -- from zero-cost conversational replies to full deep-research synthesis with citations.

---

## Overview

Most agent frameworks apply the same retrieval pipeline to every query: embed, search, stuff context, generate. A greeting gets the same 5-chunk RAG pipeline as a cross-document architecture question. The result is wasted latency on trivial queries and shallow answers on complex ones.

The QueryRouter solves this with a **classify-then-dispatch** architecture. Before any retrieval happens, a lightweight LLM call inspects the query and assigns a complexity tier (T0-T3). The tier determines which retrieval strategies fire, which model generates the answer, and how much context budget is allocated.

```
User Query
  --> QueryClassifier (chain-of-thought LLM, ~100ms)
  --> QueryDispatcher (tier-appropriate retrieval)
  --> QueryGenerator  (grounded answer with citations)
  --> QueryResult { answer, classification, sources, durationMs, tiersUsed }
```

---

## The Four Tiers

| Tier   | Name           | Retrieval Strategy                         | Model                    | Max Tokens | Temperature |
| ------ | -------------- | ------------------------------------------ | ------------------------ | ---------- | ----------- |
| **T0** | Conversational | None -- answer from internal knowledge     | Standard (`gpt-4o-mini`) | 512        | 0.7         |
| **T1** | Simple lookup  | Vector search, top-5                       | Standard (`gpt-4o-mini`) | 512        | 0.3         |
| **T2** | Multi-source   | Vector(15) + graph expand + rerank(5)      | Deep (`gpt-4o`)          | 1024       | 0.3         |
| **T3** | Research       | Everything in T2 + deep research synthesis | Deep (`gpt-4o`)          | 1024       | 0.3         |

### T0 -- Conversational (No Retrieval)

Greetings, small talk, and questions the model can answer from general knowledge. The dispatcher returns immediately with zero chunks, and the generator uses a higher temperature (0.7) for natural conversational responses.

**Example queries:** "Hello", "What is TypeScript?", "Thanks for the help"

### T1 -- Simple Lookup (Vector Search)

Single-fact questions that need one document section. The dispatcher runs a vector search with `topK=5` and passes the results to the generator.

**Example queries:** "What port does the API run on?", "What is the pricing?"

### T2 -- Multi-Source (Hybrid Retrieval)

Questions that span multiple documents or require combining information from different parts of the codebase. The dispatcher fetches 15 vector results, expands via knowledge graph traversal, merges and deduplicates, then reranks to the top 5.

**Example queries:** "How does auth flow from frontend to backend?", "Compare all memory storage options"

### T3 -- Deep Research

Full investigation across the entire corpus plus external sources. Runs the complete T2 pipeline first, then invokes iterative deep research with synthesis. The final answer draws from both internal documentation and external research findings.

**Example queries:** "Compare all caching strategies used in this codebase and recommend improvements", "What are the latest treatment options for drug-resistant TB?"

---

## How the Classifier Works

The `QueryClassifier` uses a chain-of-thought LLM call with a structured system prompt. The model receives:

1. **Tier definitions** -- clear descriptions of what each tier means
2. **Known topics** -- extracted from the corpus by `TopicExtractor` (one line per heading, capped at 50)
3. **Available tools** -- so the classifier can reason about runtime capabilities
4. **Conversation context** -- recent messages for continuity

The model responds with a JSON object:

```json
{
  "thinking": "The user is asking about pricing, which is a specific fact from the documentation. A single vector search should find the pricing page. No tools needed.",
  "tier": 1,
  "confidence": 0.92,
  "internal_knowledge_sufficient": false,
  "suggested_sources": ["vector"],
  "tools_needed": []
}
```

### Post-Classification Constraints

After parsing the LLM response, two constraints are applied:

1. **Confidence-based tier bumping**: If confidence falls below the configured threshold (default 0.7), the tier is incremented by 1. Low confidence means the classifier is unsure, so broader retrieval is safer.
2. **Max tier capping**: The tier is capped at `maxTier` (default 3) to prevent runaway research when it is not warranted.

### Fallback Behaviour

If the classifier LLM call fails for any reason (network error, invalid JSON, timeout), the classifier returns a safe **T1 fallback** with confidence 0. This ensures at least a basic vector search is performed -- the pipeline never stalls completely.

---

## Retrieval Strategies by Tier

### Vector Search

The primary retrieval method. When the embedding pipeline is available (API key configured, vector store initialized), queries are embedded and matched against the corpus in an in-memory vector store.

Corpus ingestion:

1. Markdown files are loaded from configured `knowledgeCorpus` directories
2. Content is split by h1-h3 headings into chunks (max 6000 chars, min 20 chars)
3. Chunks are embedded in batches of 50 via `EmbeddingManager`
4. Embeddings are upserted into an in-memory `VectorStoreManager`

### Graph Expansion (T2+)

After vector search, seed chunks are expanded via knowledge graph traversal. Related chunks discovered through graph edges (e.g., chunks from the same document or linked topics) are merged with the vector results.

### Reranking (T2+)

After merge and deduplication, a cross-encoder or LLM-based reranker scores all candidate chunks against the query and keeps the top 5. If reranking fails, the dispatcher falls back to sorting by vector similarity score.

### Deep Research (T3)

Iterative multi-pass retrieval and synthesis. The research engine decomposes the query into sub-questions, searches multiple source types, identifies gaps, and synthesizes findings into a narrative that is provided alongside the retrieved chunks to the generator.

### Keyword Fallback

When embeddings are unavailable (no API key, initialization failure), all retrieval falls back to `KeywordFallback`. This is a simple keyword-matching engine that:

1. Splits the query into tokens, filters stop words and short tokens
2. Scores each corpus chunk by keyword hits (heading matches weighted 4x content matches)
3. Normalizes scores to 0-1 and returns the top-K

The fallback is intentionally simple. It ensures the router is always functional, even without an embedding provider.

---

## Configuration

```typescript
interface QueryRouterConfig {
  /** Directories containing .md / .mdx files to ingest as the knowledge corpus. Required. */
  knowledgeCorpus: string[];

  /** Minimum confidence threshold for accepting a classification. @default 0.7 */
  confidenceThreshold?: number;

  /** LLM model for the classifier. @default 'gpt-4o-mini' */
  classifierModel?: string;

  /** LLM provider for the classifier. @default 'openai' */
  classifierProvider?: string;

  /** Maximum tier the classifier may assign. @default 3 */
  maxTier?: QueryTier;

  /** Embedding provider name. @default 'openai' */
  embeddingProvider?: string;

  /** Embedding model identifier. @default 'text-embedding-3-small' */
  embeddingModel?: string;

  /** LLM model for T0/T1 generation. @default 'gpt-4o-mini' */
  generationModel?: string;

  /** LLM model for T2/T3 generation (deep). @default 'gpt-4o' */
  generationModelDeep?: string;

  /** LLM provider for generation. @default 'openai' */
  generationProvider?: string;

  /** Enable GraphRAG-based retrieval for tier >= 2. @default true */
  graphEnabled?: boolean;

  /** Enable deep research mode for tier 3. @default true (if SERPER_API_KEY is set) */
  deepResearchEnabled?: boolean;

  /** Recent conversation messages to include as context. @default 5 */
  conversationWindowSize?: number;

  /** Maximum estimated tokens for documentation context. @default 4000 */
  maxContextTokens?: number;

  /** Cache query results. @default true */
  cacheResults?: boolean;

  /** Tool/capability names exposed to the classifier prompt. @default [] */
  availableTools?: string[];

  /** Hook called after classification completes. */
  onClassification?: (result: ClassificationResult) => void;

  /** Hook called after retrieval completes. */
  onRetrieval?: (result: RetrievalResult) => void;

  /** Optional API key override for LLM calls. */
  apiKey?: string;

  /** Optional base URL override for LLM providers. */
  baseUrl?: string;
}
```

---

## Usage Examples

### Basic Usage

```typescript
import { QueryRouter } from '@framers/agentos/query-router';

const router = new QueryRouter({
  knowledgeCorpus: ['./docs'],
});

await router.init();

const result = await router.route('What is the pricing?');
console.log(result.answer); // "Starter plan costs $19/month..."
console.log(result.classification); // { tier: 1, confidence: 0.92, ... }
console.log(result.sources); // [{ path: 'docs/pricing.md', ... }]

await router.close();
```

### Custom Configuration

```typescript
const router = new QueryRouter({
  knowledgeCorpus: ['./docs', './guides'],
  classifierModel: 'claude-haiku-4-5-20251001',
  classifierProvider: 'anthropic',
  generationModel: 'claude-sonnet-4-20250514',
  generationModelDeep: 'claude-sonnet-4-20250514',
  generationProvider: 'anthropic',
  confidenceThreshold: 0.8,
  maxTier: 2, // disable deep research
  graphEnabled: false, // vector-only retrieval
  maxContextTokens: 8000,
  availableTools: ['web_search', 'deep_research'],
  onClassification: (c) => console.log(`Tier ${c.tier}, confidence ${c.confidence}`),
  onRetrieval: (r) => console.log(`Retrieved ${r.chunks.length} chunks in ${r.durationMs}ms`),
});
```

### Standalone Classification

Use `classify()` to inspect the classification before deciding whether to proceed:

```typescript
await router.init();

const classification = await router.classify('How does auth work?');

if (classification.tier >= 2) {
  console.log('Complex query detected, using full pipeline');
  const result = await router.route('How does auth work?');
} else if (classification.internalKnowledgeSufficient) {
  console.log('Can answer from internal knowledge, skipping retrieval');
} else {
  const result = await router.route('How does auth work?');
}
```

### Direct Retrieval

Use `retrieve()` to bypass the classifier and retrieve at a specific tier:

```typescript
// Force T2 retrieval regardless of query complexity
const retrieval = await router.retrieve('How does auth work?', 2);
console.log(retrieval.chunks.length); // up to 5 reranked chunks
```

---

## Fallback Chain

Every component in the pipeline degrades gracefully rather than crashing:

| Component           | Failure                    | Fallback                             |
| ------------------- | -------------------------- | ------------------------------------ |
| **Classifier LLM**  | Network error, parse error | Returns T1 with confidence 0         |
| **Embedding init**  | No API key, provider error | Keyword search for all retrieval     |
| **Vector search**   | Query embedding fails      | Keyword search                       |
| **Graph expansion** | Graph engine error         | Continue with vector-only chunks     |
| **Reranking**       | Reranker error             | Sort by score descending, take top-5 |
| **Deep research**   | Research backend error     | Return T2 result (no synthesis)      |

When a fallback activates, a `retrieve:fallback` event is emitted with the strategy name and reason, so consumers always know what happened.

---

## Observability

The QueryRouter emits a discriminated union of typed lifecycle events throughout the pipeline. Events are accumulated internally and can be observed via hooks or structured logging.

### Event Types

| Event               | When                      | Key Fields                                    |
| ------------------- | ------------------------- | --------------------------------------------- |
| `classify:start`    | Classification begins     | `query`, `timestamp`                          |
| `classify:complete` | Classification succeeds   | `result`, `durationMs`                        |
| `classify:error`    | Classification fails      | `error`                                       |
| `retrieve:start`    | Retrieval phase begins    | `tier`                                        |
| `retrieve:vector`   | Vector search completes   | `chunkCount`, `durationMs`                    |
| `retrieve:graph`    | Graph traversal completes | `entityCount`, `durationMs`                   |
| `retrieve:rerank`   | Reranking completes       | `inputCount`, `outputCount`, `durationMs`     |
| `retrieve:complete` | All retrieval done        | `result`                                      |
| `retrieve:fallback` | Fallback activated        | `strategy`, `reason`                          |
| `research:start`    | Deep research begins      | `query`, `maxIterations`                      |
| `research:phase`    | Research iteration done   | `iteration`, `newChunksFound`                 |
| `research:complete` | Deep research done        | `iterationsUsed`, `totalChunks`, `durationMs` |
| `generate:start`    | Answer generation begins  | `contextChunkCount`                           |
| `generate:complete` | Answer generated          | `answerLength`, `citationCount`, `durationMs` |
| `route:complete`    | Full pipeline done        | `result`, `durationMs`                        |

### Exhaustive Event Handling

```typescript
import type { QueryRouterEventUnion } from '@framers/agentos/query-router';

function handleEvent(event: QueryRouterEventUnion) {
  switch (event.type) {
    case 'classify:start':
      console.log(`Classifying: ${event.query}`);
      break;
    case 'classify:complete':
      console.log(`Tier ${event.result.tier} (${event.durationMs}ms)`);
      break;
    case 'retrieve:vector':
      console.log(`Vector search: ${event.chunkCount} chunks`);
      break;
    case 'retrieve:fallback':
      console.warn(`Fallback: ${event.strategy} - ${event.reason}`);
      break;
    case 'route:complete':
      console.log(`Done in ${event.durationMs}ms`);
      break;
  }
}
```

---

## Bot Integration Example

Integrating the QueryRouter into a Discord or Telegram bot that answers questions from a documentation corpus:

```typescript
import { QueryRouter } from '@framers/agentos/query-router';

// Initialize once at bot startup
const router = new QueryRouter({
  knowledgeCorpus: ['./docs', './guides'],
  generationModel: 'gpt-4o-mini',
  generationModelDeep: 'gpt-4o',
  generationProvider: 'openai',
  confidenceThreshold: 0.7,
  onClassification: (c) => {
    console.log(`[QueryRouter] Tier ${c.tier} | confidence ${c.confidence}`);
  },
});

await router.init();

// Per-message handler
async function handleQuestion(userMessage: string): Promise<string> {
  const result = await router.route(userMessage);

  // Optionally wrap the factual answer with bot personality
  const sources = result.sources
    .filter((s) => s.relevanceScore > 0.5)
    .map((s) => s.path)
    .slice(0, 3);

  let reply = result.answer;
  if (sources.length > 0) {
    reply += `\n\nSources: ${sources.join(', ')}`;
  }

  return reply;
}
```

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          QueryRouter                              │
│         (orchestrates classification, retrieval, generation)      │
└──────────┬──────────────────┬──────────────────┬─────────────────┘
           │                  │                  │
           v                  v                  v
┌──────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ QueryClassifier  │ │ QueryDispatcher │ │ QueryGenerator  │
│ (chain-of-thought│ │ (tier routing + │ │ (tier-specific  │
│  LLM call)       │ │  fallback mgmt) │ │  prompt + LLM)  │
└──────────────────┘ └────────┬────────┘ └─────────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           v                  v                  v
┌──────────────────┐ ┌───────────────┐ ┌─────────────────┐
│ Vector Search    │ │ Graph Search  │ │ KeywordFallback │
│ (EmbeddingMgr + │ │ (GraphRAG)    │ │ (degraded mode) │
│  VectorStoreMgr) │ │               │ │                 │
└──────────────────┘ └───────────────┘ └─────────────────┘
```

**Supporting components:**

| Component         | Responsibility                                                              |
| ----------------- | --------------------------------------------------------------------------- |
| `TopicExtractor`  | Scans corpus chunks, extracts deduplicated topic list for classifier prompt |
| `KeywordFallback` | Simple keyword matching search when embeddings are unavailable              |

---

## Source Files

All source lives in `packages/agentos/src/query-router/`:

| File                 | Export                                                |
| -------------------- | ----------------------------------------------------- |
| `types.ts`           | All types, `DEFAULT_QUERY_ROUTER_CONFIG`              |
| `QueryRouter.ts`     | `QueryRouter`                                         |
| `QueryClassifier.ts` | `QueryClassifier`                                     |
| `QueryDispatcher.ts` | `QueryDispatcher`                                     |
| `QueryGenerator.ts`  | `QueryGenerator`                                      |
| `TopicExtractor.ts`  | `TopicExtractor`                                      |
| `KeywordFallback.ts` | `KeywordFallback`                                     |
| `index.ts`           | Barrel re-exports for `@framers/agentos/query-router` |
