# Memory Retrieval Pipeline for Wunderland Chat Loop

## Goal

Wire memory retrieval into wunderland's chat turn loop so stored facts, observations, and persistent context are injected into prompts. Currently memory is write-only — this makes it read-write.

## Architecture

A new `MemorySystemInitializer` creates `CognitiveMemoryManager` + `EmbeddingManager` on startup using the existing `SqlVectorStore` from `AgentStorageManager`. A new `TurnMemoryRetriever` runs before each LLM call: retrieves relevant memories via vector search, reads the persistent markdown working memory file, assembles everything into a token-budgeted context block, and injects it as a system message. Both `chat-runtime.ts` (API) and `cli/commands/chat.ts` (CLI) get this wiring.

## Embedding Provider Auto-Detection

- If `OLLAMA_BASE_URL` or `cfg.ollama.baseUrl` is set → use Ollama with `nomic-embed-text`
- Otherwise → use OpenAI with `text-embedding-3-small`
- Zero config required — follows the agent's LLM provider choice

## Initialization

`MemorySystemInitializer.create(opts)` produces a `MemorySystem` object:

```typescript
interface MemorySystem {
  manager: ICognitiveMemoryManager;
  embeddings: IEmbeddingManager;
  retriever: TurnMemoryRetriever;
}
```

Inputs:

- `vectorStore: IVectorStore` — from AgentStorageManager (already exists)
- `llmConfig: { providerId, apiKey, baseUrl? }` — for embedding provider detection
- `traits: HexacoTraits` — from agent personality config
- `markdownMemory?: MarkdownWorkingMemory` — for persistent file injection
- `budgetTokens?: number` — total retrieval budget (default 4000)

## Per-Turn Retrieval

`TurnMemoryRetriever.retrieveForTurn(userInput)` returns `AssembledMemoryContext | null`:

1. Call `manager.retrieve(userInput, mood)` → `ScoredMemoryTrace[]`
2. Read `markdownMemory.read()` → `persistentMemoryText`
3. Get cognitive working memory → `workingMemoryText`
4. Call `assembleMemoryContext({ persistentMemoryText, workingMemoryText, retrievedTraces, totalTokenBudget, allocation, traits })`
5. Return assembled context or null if nothing retrieved

## Prompt Injection

The assembled context text is injected as a system message at index 1 (after main system prompt, before conversation history). Previous memory context messages are removed each turn to avoid stacking.

```typescript
// Tag memory context messages for removal on next turn
messages = messages.filter((m) => !(m as any)._memoryContext);
if (memoryContext) {
  messages.splice(1, 0, {
    role: 'system',
    content: memoryContext.contextText,
    _memoryContext: true,
  } as any);
}
```

## Token Budget

Default: 4000 tokens total, split by `DEFAULT_BUDGET_ALLOCATION`:

| Section                            | %   | Tokens |
| ---------------------------------- | --- | ------ |
| Persistent memory (markdown)       | 5%  | 200    |
| Working memory (Baddeley)          | 15% | 600    |
| Semantic recall                    | 40% | 1600   |
| Recent episodic                    | 25% | 1000   |
| Prospective + graph + observations | 15% | 600    |

Configurable via `agent.config.json`:

```json
{
  "memory": {
    "retrievalBudgetTokens": 4000,
    "enabled": true
  }
}
```

## Integration Points

| Entry Point | File                                           | Changes                                                                                         |
| ----------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| API         | `packages/wunderland/src/api/chat-runtime.ts`  | Init memory system in `createWunderlandChatRuntime()`, call retriever in `runTurn()`            |
| CLI         | `packages/wunderland/src/cli/commands/chat.ts` | Init memory system after storage manager, call retriever in `runChatTurn()`                     |
| Types       | `packages/wunderland/src/api/types.ts`         | Add `memory?: { retrievalBudgetTokens?: number; enabled?: boolean }` to `WunderlandAgentConfig` |

## Error Handling

- Embedding provider unavailable → skip retrieval, log warning, continue
- Vector store empty → empty result, no injection
- Assembly fails → skip injection, continue turn normally
- All failures non-fatal — chat always works without memory

## Files

| Action | File                                                           | Responsibility                                    |
| ------ | -------------------------------------------------------------- | ------------------------------------------------- |
| Create | `packages/wunderland/src/memory/MemorySystemInitializer.ts`    | Creates CognitiveMemoryManager + EmbeddingManager |
| Create | `packages/wunderland/src/memory/TurnMemoryRetriever.ts`        | Per-turn retrieval + assembly                     |
| Create | `packages/wunderland/src/memory/index.ts`                      | Barrel exports                                    |
| Modify | `packages/wunderland/src/api/chat-runtime.ts`                  | Wire init + per-turn retrieval                    |
| Modify | `packages/wunderland/src/cli/commands/chat.ts`                 | Wire init + per-turn retrieval                    |
| Modify | `packages/wunderland/src/api/types.ts`                         | Add memory config to WunderlandAgentConfig        |
| Create | `packages/wunderland/tests/memory/TurnMemoryRetriever.spec.ts` | Unit tests                                        |
