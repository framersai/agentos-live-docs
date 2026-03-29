---
sidebar_label: Query Router
sidebar_position: 29
---

# Query Router

AgentOS includes a `QueryRouter` that turns one user question into a three-stage pipeline:

1. classify the query into tier `0` through `3`
2. retrieve the right amount of context
3. generate a grounded answer from that context

## What Is Live Today

- Tier classification uses an LLM prompt with corpus topics, recent conversation history, and optional tool names.
- The router embeds local markdown docs into an in-memory vector store when an embedding provider is available.
- If embeddings are unavailable or vector search fails, the router falls back to keyword search automatically.
- Result metadata includes `tiersUsed`, `fallbacksUsed`, and capability `recommendations`.
- Lifecycle events cover classification, retrieval, research, generation, route completion, and capability recommendation activation.

## Current Limitations

The QueryRouter scaffold is ahead of the wired runtime in a few places:

- `graphExpand()` is currently a built-in corpus-neighborhood heuristic, not yet a true GraphRAG engine.
- `rerank()` is currently a built-in lexical heuristic reranker, not yet a cross-encoder service.
- `deepResearch()` is currently a built-in local-corpus heuristic synthesis pass, not yet a web-backed research runtime.

## Example

```ts
import { QueryRouter } from '@framers/agentos';

const router = new QueryRouter({
  knowledgeCorpus: ['./docs', './packages/agentos/docs'],
  availableTools: ['web_search', 'deep_research'],
});

await router.init();

const result = await router.route('How does memory retrieval work?');

console.log(result.answer);
console.log(result.classification.tier);
console.log(result.recommendations);
console.log(result.sources);
```

## Bundled Platform Knowledge

The QueryRouter ships with **244 pre-built knowledge entries** that cover the AgentOS platform surface:

| Category | Count |
|----------|-------|
| **Tools** | 105 |
| **Skills** | 80 |
| **FAQ** | 30 |
| **API** | 14 |
| **Troubleshooting** | 15 |

Platform knowledge is loaded from `knowledge/platform-corpus.json` inside `@framers/agentos` and merged into the same corpus as your project docs during `init()`.

```ts
const router = new QueryRouter({
  knowledgeCorpus: ['./docs'],
  includePlatformKnowledge: false, // disable if you want project-only routing
});
```

## Recommendations

`route()` returns capability recommendations alongside the grounded answer:

- `skills`
- `tools`
- `extensions`

These are recommendations only. Hosts decide whether to activate or load them.

## Config Notes

- `knowledgeCorpus` is required.
- `availableTools` only helps the classifier reason about what the runtime can do.
- `githubRepos` optionally enables non-blocking GitHub corpus indexing after `init()`.
- `router.getCorpusStats()` returns a startup snapshot with chunk/topic/source counts, bundled platform-knowledge counts, and runtime mode details.
