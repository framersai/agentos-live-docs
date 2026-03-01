# Semantic Tool Discovery & Embeddings

## What It Does

When an agent has 50+ tools, sending all tool definitions to the LLM on every request wastes tokens and confuses the model. Semantic discovery solves this by selecting only the most relevant tools for each user message.

## How It Works

1. **At startup**: Each tool's description is converted into an **embedding** (a numerical vector representation) using an embedding model
2. **On each request**: The user's message is also embedded
3. **Similarity search**: Cosine similarity finds the tools most relevant to the user's intent
4. **Filtered tool list**: Only the top-matching tools are sent to the LLM (instead of all 50+)

### Three-Tier Context Model

| Tier       | Description                                                      | Example                             |
| ---------- | ---------------------------------------------------------------- | ----------------------------------- |
| **Tier 0** | Always included — core tools the agent needs every time          | `sendMessage`, `setTyping`          |
| **Tier 1** | Semantically matched — selected based on user message similarity | `fetchNews`, `webSearch`, `weather` |
| **Tier 2** | Available but excluded from current context — saves tokens       | `cliExecutor`, `sendMedia`          |

## Embedding Models

Discovery requires a model that produces embeddings (vector representations of text). Chat/instruct models do NOT work.

### Ollama (Local)

| Model               | Dimensions | Size  | Notes                                       |
| ------------------- | ---------- | ----- | ------------------------------------------- |
| `nomic-embed-text`  | 768        | 274MB | Best balance of quality/speed for local use |
| `mxbai-embed-large` | 1024       | 670MB | Higher quality, slower                      |
| `all-minilm`        | 384        | 45MB  | Fastest, lower quality                      |

**Important**: Chat models like `qwen3:8b`, `llama3`, `mistral` do NOT support embeddings. You need a dedicated embedding model.

To install an embedding model in Ollama:

```bash
ollama pull nomic-embed-text
```

### OpenAI (Cloud)

| Model                    | Dimensions | Cost            | Notes               |
| ------------------------ | ---------- | --------------- | ------------------- |
| `text-embedding-3-small` | 1536       | $0.02/1M tokens | Recommended default |
| `text-embedding-3-large` | 3072       | $0.13/1M tokens | Higher quality      |
| `text-embedding-ada-002` | 1536       | $0.10/1M tokens | Legacy              |

Requires `OPENAI_API_KEY` environment variable.

## Configuration in agent.config.json

### Disable Discovery (< 50 tools)

When you have fewer than ~50 tools, the direct tool list works fine. All tools are sent to the LLM on every request.

```json
{
  "discovery": {
    "enabled": false
  }
}
```

### Enable Discovery with Ollama

```json
{
  "llmProvider": "ollama",
  "llmModel": "qwen3:8b",
  "discovery": {
    "enabled": true,
    "embeddingProvider": "ollama",
    "embeddingModel": "nomic-embed-text",
    "tokenBudget": 4096,
    "maxResults": 15,
    "graphWeight": 0.3
  }
}
```

**Note**: The embedding model and chat model are separate. You can use `qwen3:8b` for chat and `nomic-embed-text` for embeddings — they serve different purposes.

### Enable Discovery with OpenAI

```json
{
  "llmProvider": "ollama",
  "llmModel": "qwen3:8b",
  "discovery": {
    "enabled": true,
    "embeddingProvider": "openai",
    "embeddingModel": "text-embedding-3-small",
    "tokenBudget": 4096,
    "maxResults": 15
  }
}
```

You can mix providers — e.g., Ollama for chat, OpenAI for embeddings (or vice versa).

## Configuration Options

| Field               | Type    | Default                       | Description                                                                     |
| ------------------- | ------- | ----------------------------- | ------------------------------------------------------------------------------- |
| `enabled`           | boolean | `true`                        | Enable/disable semantic discovery                                               |
| `embeddingProvider` | string  | (inherits from `llmProvider`) | `"ollama"` or `"openai"`                                                        |
| `embeddingModel`    | string  | (provider default)            | Model ID for embeddings                                                         |
| `tokenBudget`       | number  | `4096`                        | Max tokens for tool definitions in context                                      |
| `maxResults`        | number  | `15`                          | Max tools to include per request                                                |
| `tierThresholds`    | object  | `{ tier1: 0.4, tier2: 0.2 }`  | Similarity score thresholds                                                     |
| `graphWeight`       | number  | `0.3`                         | Weight for graph-based re-ranking (tool co-usage patterns)                      |
| `metaToolEnabled`   | boolean | `true`                        | Include a meta-tool that lets the LLM request additional tools mid-conversation |

## When to Use Discovery

| Tool Count | Recommendation                                              |
| ---------- | ----------------------------------------------------------- |
| < 30       | **Disable** — direct list is fine, no overhead              |
| 30–50      | **Optional** — minor token savings, slight latency          |
| 50–100     | **Recommended** — meaningful token savings, better focus    |
| 100+       | **Required** — LLM performance degrades with too many tools |

## Best Practices

1. **Write good tool descriptions** — Discovery matches user intent against tool descriptions. Vague descriptions = poor matching.
2. **Use Tier 0 for essentials** — Mark critical tools (messaging, typing indicators) as Tier 0 so they're always available.
3. **Monitor with `metaToolEnabled`** — The meta-tool lets the LLM say "I need tool X" mid-conversation if it wasn't initially selected.
4. **Embedding model doesn't need to be large** — `nomic-embed-text` (274MB) works well. Don't waste GPU on a 7B embedding model.
5. **Cache embeddings** — Tool embeddings are computed once at startup and cached. Only user message embeddings happen per-request.
