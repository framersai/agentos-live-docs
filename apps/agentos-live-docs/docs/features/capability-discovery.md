---
sidebar_position: 19
title: Capability Discovery
description: Semantic capability discovery with tiered context budgeting
---

# Capability Discovery

Large language models get worse when you give them more context. The Chroma 2025 research on context rot confirmed what practitioners already suspected: dumping every tool definition into a system prompt degrades performance measurably. Static tool dumps waste tokens on capabilities the agent will never use for the current task.

The Capability Discovery Engine solves this by replacing static capability loading with semantic search, graph-based re-ranking, and tiered context budgeting. A typical agent with 40+ registered tools, skills, and extensions sees its capability context drop from ~20,000 tokens to ~1,800 tokens per turn -- with higher relevance.

## How It Works

The engine follows a three-stage pipeline:

```
User query
    |
Semantic Search (embedding similarity)
    |
Graph Re-ranking (relationship edges, co-occurrence)
    |
Tiered Context Budgeting (brief → standard → full)
    |
Final capability context for LLM
```

1. **Semantic search** embeds the user's query and retrieves the top-N candidate capabilities from a vector store.
2. **Graph re-ranking** adjusts scores using a lightweight relationship graph. Capabilities that frequently co-occur, share dependencies, or belong to the same skill group get boosted together.
3. **Tiered context budgeting** allocates token budgets across three detail levels so the LLM gets just enough information to use each capability correctly.

## The Three-Tier Model

Not every discovered capability needs the same level of detail. The engine assigns each result to one of three tiers based on its relevance score:

### Tier 1: Brief (~40 tokens per capability)

The capability name plus a one-line description. Enough for the LLM to know it exists and request promotion if needed.

```
web-search: Search the web using Serper, SerpAPI, or Brave. Returns titles, snippets, and URLs.
```

### Tier 2: Standard (~150 tokens per capability)

Name, description, parameter summary, and usage hints. Enough to invoke the capability correctly for straightforward cases.

```
web-search: Search the web using Serper, SerpAPI, or Brave.
Parameters: { query: string, numResults?: number (default 10), dateRange?: string }
Returns: Array of { title, snippet, url, date }
Usage: Call with a natural language query. Use dateRange for recent results.
```

### Tier 3: Full (~400 tokens per capability)

Complete definition including full JSON Schema parameters, examples, error handling guidance, and related capabilities. Reserved for the top 1-3 capabilities most relevant to the current query.

The engine's budget allocator distributes a configurable total token budget (default: 2,000 tokens) across tiers. A typical distribution for a query matching 12 capabilities:

| Tier      | Count  | Tokens each | Total      |
| --------- | ------ | ----------- | ---------- |
| Full      | 2      | ~400        | 800        |
| Standard  | 4      | ~150        | 600        |
| Brief     | 6      | ~40         | 240        |
| **Total** | **12** |             | **~1,640** |

## Quick Start

```typescript
import { CapabilityDiscoveryEngine } from '@framers/agentos/discovery';

const engine = new CapabilityDiscoveryEngine(embeddingManager, vectorStore);

// Index all registered capabilities
await engine.initialize({
  tools, // ITool[]
  skills, // SkillDescriptor[]
  extensions, // ExtensionDescriptor[]
  channels, // ChannelDescriptor[]
});

// Discover relevant capabilities for a query
const result = await engine.discover('search the web for AI news');

console.log(result.context); // Token-budgeted capability text for the LLM
console.log(result.capabilities); // Ranked array of matched capabilities
console.log(result.tokenCount); // Actual token count of the context
console.log(result.tierBreakdown); // { full: 2, standard: 4, brief: 6 }
```

The `discover()` method returns a `DiscoveryResult` containing the formatted context string ready for injection into the system prompt, plus metadata about what was matched and how tokens were allocated.

## The Meta-Tool: `discover_capabilities`

When capability discovery is enabled, the engine registers a special meta-tool called `discover_capabilities` that the agent can invoke during a conversation. This lets the agent pull in additional capabilities on demand rather than relying solely on the initial discovery pass.

```typescript
// The meta-tool is registered automatically during initialization
// Agents can call it like any other tool:

// Agent sees a brief-tier mention of "image-gen" and wants full details
await agent.callTool('discover_capabilities', {
  query: 'generate an image from a text description',
  maxResults: 3,
});
```

The meta-tool returns full-tier descriptions for the top matches, allowing the agent to "zoom in" on capabilities it needs mid-conversation without pre-loading everything.

### When the Meta-Tool Fires

The meta-tool is most useful when:

- The agent encounters a user request outside the scope of the initial discovery
- A brief-tier capability looks relevant but the agent needs parameter details
- The conversation topic shifts significantly from the original query

## CAPABILITY.yaml

Custom capabilities can be defined using `CAPABILITY.yaml` files. This format lets you register capabilities that live outside the standard tool/skill/extension system.

```yaml
name: company-crm-lookup
version: '1.0.0'
description: Look up customer records in the company CRM by name, email, or account ID.
category: business-tools
tags:
  - crm
  - customer
  - lookup

parameters:
  type: object
  properties:
    query:
      type: string
      description: Customer name, email address, or account ID
    fields:
      type: array
      items:
        type: string
      description: Specific fields to return (default returns all)
  required:
    - query

examples:
  - query: 'john@example.com'
    description: Look up a customer by email
  - query: 'ACCT-12345'
    fields: ['name', 'plan', 'mrr']
    description: Get specific fields for an account

relationships:
  - company-billing-lookup
  - company-support-tickets
```

The `relationships` field feeds the graph re-ranking stage. Capabilities listed here get a score boost when this capability is a top match, enabling the engine to surface related tools together.

### Capability Search Paths

The engine scans for `CAPABILITY.yaml` files in these locations (in order):

1. `./capabilities/` -- project-local capabilities
2. `~/.agentos/capabilities/` -- user-global capabilities
3. Registered extension directories

## Configuration

Configure the discovery engine through the `discovery` section of your agent config:

```json
{
  "discovery": {
    "enabled": true,
    "tokenBudget": 2000,
    "maxResults": 15,
    "tierThresholds": {
      "full": 0.85,
      "standard": 0.65
    },
    "graphWeight": 0.3,
    "embeddingModel": "default",
    "metaToolEnabled": true,
    "refreshOnTopicShift": true
  }
}
```

| Option                    | Default     | Description                                                                           |
| ------------------------- | ----------- | ------------------------------------------------------------------------------------- |
| `enabled`                 | `true`      | Enable or disable capability discovery                                                |
| `tokenBudget`             | `2000`      | Maximum tokens allocated for capability context                                       |
| `maxResults`              | `15`        | Maximum number of capabilities to include                                             |
| `tierThresholds.full`     | `0.85`      | Minimum similarity score for full-tier inclusion                                      |
| `tierThresholds.standard` | `0.65`      | Minimum similarity score for standard-tier inclusion                                  |
| `graphWeight`             | `0.3`       | Weight given to graph re-ranking (0-1). Higher values favor co-occurring capabilities |
| `embeddingModel`          | `"default"` | Embedding model to use. `"default"` uses the agent's configured embedding provider    |
| `metaToolEnabled`         | `true`      | Register the `discover_capabilities` meta-tool                                        |
| `refreshOnTopicShift`     | `true`      | Re-run discovery when the conversation topic shifts significantly                     |

### Disabling Discovery

For agents with a small, fixed set of tools, discovery adds overhead without benefit. Disable it and all registered capabilities are loaded statically as before:

```json
{
  "discovery": {
    "enabled": false
  }
}
```

## Performance

Benchmarked on a catalog of 45 capabilities (23 tools + 18 skills + 4 extensions):

| Metric                      | Value              |
| --------------------------- | ------------------ |
| Discovery latency (cold)    | ~120ms             |
| Discovery latency (warm)    | ~15ms              |
| Embedding index build       | ~800ms             |
| Context token reduction     | 89% (20k to ~1.8k) |
| Relevance (top-3 precision) | 0.91               |

The warm path uses a per-session embedding cache. The index build runs once during `initialize()` and persists for the lifetime of the engine instance.

## Related

- [Skills](/docs/features/skills) -- skill system that feeds into capability discovery
- [Extensions](/docs/extensions/overview) -- extension ecosystem and registry
- [Guardrails](/docs/features/guardrails) -- security controls for capability execution
- [Cost Optimization](/docs/features/cost-optimization) -- token budgeting strategies
- [RAG & Memory](/docs/features/rag-memory) -- vector store and embedding infrastructure shared by discovery
