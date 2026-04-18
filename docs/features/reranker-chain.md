---
title: "Reranker Chain"
sidebar_position: 4.6
---

Configurable multi-stage reranking pipeline for search results and RAG retrieval.

## Overview

AgentOS supports chaining multiple reranking providers into a sequential pipeline. Each stage narrows the result set, producing progressively higher-quality rankings at each step.

```
120 search results
  → Stage 1: Local Cross-Encoder (120 → 30)    [~300ms, free]
  → Stage 2: Cohere Rerank (30 → 15)            [~100ms, ~$0.001]
  → Stage 3: LLM Judge (15 → 5)                 [~2s, ~$0.002]
  → 5 high-confidence results
```

## Configuration

```json title="agent.config.json"
{
  "rag": {
    "reranking": {
      "chain": [
        { "provider": "local", "topK": 30, "model": "cross-encoder/ms-marco-MiniLM-L-6-v2" },
        { "provider": "cohere", "topK": 15, "model": "rerank-v4.0-fast" },
        { "provider": "llm-judge", "topK": 5 }
      ]
    }
  }
}
```

## Available Providers

### Local Cross-Encoder (free, offline)

Uses ONNX-based transformer models that auto-download on first use (~80-560MB).

| Model | Size | Speed (50 docs) | Quality |
|-------|------|-----------------|---------|
| `cross-encoder/ms-marco-MiniLM-L-6-v2` | 80MB | ~200ms | Good |
| `cross-encoder/ms-marco-MiniLM-L-12-v2` | 120MB | ~400ms | Better |
| `BAAI/bge-reranker-base` | 110MB | ~300ms | Good |
| `BAAI/bge-reranker-large` | 560MB | ~800ms | Best |

### Cohere Rerank (cloud API)

Requires `COHERE_API_KEY`. Models: `rerank-v4.0-pro`, `rerank-v4.0-fast`, `rerank-v3.5`.

### LLM-as-Judge (two-phase)

Uses your agent's LLM for relevance scoring:

1. **Phase 1 — Batch pointwise**: Cheap model scores documents in batches of 10 (0-10 scale)
2. **Phase 2 — Listwise ranking**: Better model ranks the top candidates

Cost: ~$0.002 per rerank with gpt-4o-mini.

## Default Chains by Research Depth

| Depth | Default Chain |
|-------|--------------|
| `quick` | `[{ provider: "local", topK: 5 }]` |
| `moderate` | `[{ provider: "local", topK: 15 }, { provider: "cohere", topK: 5 }]` |
| `deep` | `[{ provider: "local", topK: 30 }, { provider: "cohere", topK: 15 }, { provider: "llm-judge", topK: 5 }]` |

## Graceful Degradation

If a provider is unavailable (no API key, model not loaded, API error), that stage is silently skipped and the pipeline continues with the next stage. The chain always produces results.

## Programmatic Usage

```typescript
import { RerankerService, LlmJudgeReranker, CohereReranker, LocalCrossEncoderReranker } from '@framers/agentos';

const service = new RerankerService({ config: { providers: [] } });
service.registerProvider(new LocalCrossEncoderReranker({ providerId: 'local' }));
service.registerProvider(new CohereReranker({ providerId: 'cohere', apiKey: '...' }));
service.registerProvider(new LlmJudgeReranker({ llmCallFn: myLlmCall }));

const results = await service.rerankChain('quantum computing', chunks, [
  { provider: 'local', topK: 20 },
  { provider: 'cohere', topK: 10 },
  { provider: 'llm-judge', topK: 5 },
]);
```

## Memory Retrieval Reranking

The reranker chain also integrates with the [Cognitive Memory System](/features/cognitive-memory). When a `RerankerService` is passed to `CognitiveMemoryManager` via the `rerankerService` config field, it runs a neural reranking pass after the cognitive scoring pipeline:

```typescript
import { CognitiveMemoryManager } from '@framers/agentos/memory';
import { RerankerService, CohereReranker } from '@framers/agentos/rag/reranking';

const rerankerService = new RerankerService({
  config: {
    providers: [
      { providerId: 'cohere', apiKey: process.env.COHERE_API_KEY!, defaultModelId: 'rerank-v3.5' },
      { providerId: 'llm-judge' },
    ],
    defaultProviderId: 'cohere',
  },
});

await manager.initialize({
  // ... other config ...
  rerankerService,
});
```

The reranker scores are blended with the cognitive composite:

```
finalScore = 0.7 × cognitiveComposite + 0.3 × neuralRerankerScore
```

This preserves the personality-aware cognitive signals (Ebbinghaus decay, mood congruence, spreading activation, importance) while letting the cross-encoder boost results that bi-encoder embedding similarity alone might rank lower. The 0.7/0.3 weighting is fixed — the cognitive pipeline already accounts for 6 independent signals, and the reranker adds a 7th dimension of semantic relevance.

The reranker stage is non-critical. If the provider is unavailable (no API key, service error), retrieval falls back to cognitive-only scoring with no degradation.
