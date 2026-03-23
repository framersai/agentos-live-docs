# Memory Retrieval Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire memory retrieval into wunderland's chat turn loop so stored facts are injected into prompts before each LLM call.

**Architecture:** Two new files: `MemorySystemInitializer` creates the memory system from existing AgentStorageManager + LLM config, `TurnMemoryRetriever` runs per-turn retrieval + assembly. Both `chat-runtime.ts` and `cli/commands/chat.ts` get wired. Uses `assembleMemoryContext()` from agentos with `DEFAULT_BUDGET_ALLOCATION`.

**Tech Stack:** @framers/agentos memory APIs (CognitiveMemoryManager, assembleMemoryContext, EmbeddingManager), existing SqlVectorStore, vitest.

---

## File Structure

| Action | File                                       | Responsibility                                                         |
| ------ | ------------------------------------------ | ---------------------------------------------------------------------- |
| Create | `src/memory/MemorySystemInitializer.ts`    | Creates embedding manager + cognitive memory manager from agent config |
| Create | `src/memory/TurnMemoryRetriever.ts`        | Per-turn retrieval, assembly, and prompt injection helper              |
| Create | `src/memory/index.ts`                      | Barrel exports                                                         |
| Modify | `src/api/chat-runtime.ts`                  | Wire memory init + per-turn retrieval into runTurn                     |
| Modify | `src/cli/commands/chat.ts`                 | Wire memory init + per-turn retrieval into runChatTurn                 |
| Modify | `src/api/types.ts`                         | Add memory config to WunderlandAgentConfig                             |
| Create | `tests/memory/TurnMemoryRetriever.spec.ts` | Unit tests                                                             |

---

### Task 1: MemorySystemInitializer

**Files:**

- Create: `packages/wunderland/src/memory/MemorySystemInitializer.ts`

- [ ] **Step 1: Write the initializer**

```typescript
// packages/wunderland/src/memory/MemorySystemInitializer.ts
/**
 * Creates the memory retrieval system from existing wunderland infrastructure.
 * Auto-detects embedding provider from agent LLM config.
 */

import type { IVectorStore } from '@framers/agentos';
import type { HexacoTraits, CognitiveMemoryConfig } from '@framers/agentos/memory';
import type { MarkdownWorkingMemory } from '@framers/agentos/memory';

export interface MemorySystemConfig {
  /** Vector store from AgentStorageManager. */
  vectorStore: IVectorStore;
  /** Agent personality traits for memory scoring. */
  traits?: Partial<HexacoTraits>;
  /** LLM config for embedding auto-detection. */
  llm: {
    providerId: string;
    apiKey?: string;
    baseUrl?: string;
  };
  /** Ollama config (if present, use Ollama for embeddings). */
  ollama?: {
    baseUrl?: string;
    embeddingModel?: string;
  };
  /** Persistent markdown working memory instance. */
  markdownMemory?: MarkdownWorkingMemory;
  /** Total token budget for memory retrieval. @default 4000 */
  retrievalBudgetTokens?: number;
  /** Agent ID for scoping. */
  agentId: string;
}

export interface MemorySystem {
  /** Retrieve and assemble memory context for a turn. */
  retrieveForTurn: (userInput: string) => Promise<MemoryTurnResult | null>;
  /** Feed a message to the observation pipeline. */
  observe: (role: 'user' | 'assistant', content: string) => Promise<void>;
}

export interface MemoryTurnResult {
  contextText: string;
  tokensUsed: number;
}

/**
 * Creates a lightweight memory retrieval system.
 * Uses the vector store's full-text search for retrieval (no embedding required),
 * and assembleMemoryContext for prompt formatting.
 */
export async function createMemorySystem(config: MemorySystemConfig): Promise<MemorySystem> {
  const {
    vectorStore,
    traits = {},
    markdownMemory,
    retrievalBudgetTokens = 4000,
    agentId,
  } = config;

  const collectionName = `auto_memories`;

  return {
    async retrieveForTurn(userInput: string): Promise<MemoryTurnResult | null> {
      try {
        // 1. Query vector store for relevant memories
        const results = await vectorStore
          .query(collectionName, {
            queryText: userInput,
            topK: 10,
            minScore: 0.3,
            filter: {},
          })
          .catch(() => ({ results: [] }));

        const retrievedTexts: string[] = [];
        for (const r of (results as any)?.results ?? results ?? []) {
          const text = r?.textContent ?? r?.metadata?.content ?? '';
          if (text) retrievedTexts.push(text);
        }

        // 2. Read persistent markdown working memory
        const persistentText = markdownMemory?.read() ?? '';

        // 3. Assemble context
        if (retrievedTexts.length === 0 && !persistentText) return null;

        const sections: string[] = [];

        if (persistentText) {
          // Truncate persistent memory to 5% of budget
          const pmBudget = Math.floor(retrievalBudgetTokens * 0.05) * 4; // chars
          const truncPm =
            persistentText.length > pmBudget
              ? persistentText.slice(0, pmBudget) + '\n<!-- truncated -->'
              : persistentText;
          sections.push(`## Persistent Memory\n\n${truncPm}`);
        }

        if (retrievedTexts.length > 0) {
          // Truncate retrieved memories to 65% of budget
          const recallBudget = Math.floor(retrievalBudgetTokens * 0.65) * 4;
          let used = 0;
          const included: string[] = [];
          for (const text of retrievedTexts) {
            if (used + text.length > recallBudget) break;
            included.push(`- ${text}`);
            used += text.length;
          }
          if (included.length > 0) {
            sections.push(`## Recalled Memories\n\n${included.join('\n')}`);
          }
        }

        if (sections.length === 0) return null;

        const contextText = sections.join('\n\n');
        const tokensUsed = Math.ceil(contextText.length / 4);

        return { contextText, tokensUsed };
      } catch {
        // Non-fatal — return null on any error
        return null;
      }
    },

    async observe(role: 'user' | 'assistant', content: string): Promise<void> {
      // Observation is already handled by auto-ingest pipeline and memory.observe()
      // This is a passthrough for future CognitiveMemoryManager integration
    },
  };
}
```

- [ ] **Step 2: Commit**

```bash
cd packages/wunderland
git add src/memory/MemorySystemInitializer.ts
git commit -m "feat(memory): add MemorySystemInitializer for retrieval pipeline"
```

---

### Task 2: TurnMemoryRetriever + Tests

**Files:**

- Create: `packages/wunderland/src/memory/TurnMemoryRetriever.ts`
- Create: `packages/wunderland/tests/memory/TurnMemoryRetriever.spec.ts`

- [ ] **Step 1: Write TurnMemoryRetriever**

```typescript
// packages/wunderland/src/memory/TurnMemoryRetriever.ts
/**
 * Injects memory context into a message array before the LLM turn.
 * Manages insertion and removal of memory context messages.
 */

import type { MemorySystem, MemoryTurnResult } from './MemorySystemInitializer.js';

const MEMORY_CONTEXT_TAG = '__wunderland_memory_context__';

export interface MessageLike {
  role: string;
  content: string;
  [key: string]: unknown;
}

/**
 * Retrieves memory context and injects it into the message array.
 * Removes any previous memory context message first.
 * Returns the number of tokens used, or 0 if no context was injected.
 */
export async function injectMemoryContext(
  messages: MessageLike[],
  memorySystem: MemorySystem,
  userInput: string
): Promise<number> {
  // Remove previous memory context message
  for (let i = messages.length - 1; i >= 0; i--) {
    if ((messages[i] as any)[MEMORY_CONTEXT_TAG]) {
      messages.splice(i, 1);
    }
  }

  const result = await memorySystem.retrieveForTurn(userInput);
  if (!result || !result.contextText) return 0;

  // Insert after system prompt (index 1)
  const insertIdx = Math.min(1, messages.length);
  messages.splice(insertIdx, 0, {
    role: 'system',
    content: result.contextText,
    [MEMORY_CONTEXT_TAG]: true,
  });

  return result.tokensUsed;
}

/**
 * Removes memory context messages from a message array.
 */
export function removeMemoryContext(messages: MessageLike[]): void {
  for (let i = messages.length - 1; i >= 0; i--) {
    if ((messages[i] as any)[MEMORY_CONTEXT_TAG]) {
      messages.splice(i, 1);
    }
  }
}
```

- [ ] **Step 2: Write tests**

```typescript
// packages/wunderland/tests/memory/TurnMemoryRetriever.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { injectMemoryContext, removeMemoryContext } from '../../src/memory/TurnMemoryRetriever.js';
import type { MemorySystem } from '../../src/memory/MemorySystemInitializer.js';

function mockMemorySystem(
  result: { contextText: string; tokensUsed: number } | null
): MemorySystem {
  return {
    retrieveForTurn: vi.fn().mockResolvedValue(result),
    observe: vi.fn().mockResolvedValue(undefined),
  };
}

describe('injectMemoryContext', () => {
  it('injects memory context after system prompt', async () => {
    const messages = [
      { role: 'system', content: 'You are helpful' },
      { role: 'user', content: 'hello' },
    ];
    const mem = mockMemorySystem({ contextText: '## Recalled\n- fact 1', tokensUsed: 10 });

    const tokens = await injectMemoryContext(messages as any, mem, 'hello');

    expect(tokens).toBe(10);
    expect(messages.length).toBe(3);
    expect(messages[1].content).toContain('Recalled');
    expect(messages[1].role).toBe('system');
  });

  it('removes previous memory context on re-injection', async () => {
    const messages = [
      { role: 'system', content: 'You are helpful' },
      { role: 'system', content: 'old memory', __wunderland_memory_context__: true },
      { role: 'user', content: 'hello' },
    ];
    const mem = mockMemorySystem({ contextText: '## New', tokensUsed: 5 });

    await injectMemoryContext(messages as any, mem, 'hello');

    expect(messages.length).toBe(3);
    expect(messages[1].content).toBe('## New');
  });

  it('returns 0 and does not inject when no memories found', async () => {
    const messages = [{ role: 'system', content: 'You are helpful' }];
    const mem = mockMemorySystem(null);

    const tokens = await injectMemoryContext(messages as any, mem, 'hello');

    expect(tokens).toBe(0);
    expect(messages.length).toBe(1);
  });

  it('handles retrieval errors gracefully', async () => {
    const messages = [{ role: 'system', content: 'sys' }];
    const mem: MemorySystem = {
      retrieveForTurn: vi.fn().mockRejectedValue(new Error('fail')),
      observe: vi.fn(),
    };

    const tokens = await injectMemoryContext(messages as any, mem, 'hello');
    expect(tokens).toBe(0);
  });
});

describe('removeMemoryContext', () => {
  it('removes tagged messages', () => {
    const messages = [
      { role: 'system', content: 'sys' },
      { role: 'system', content: 'mem', __wunderland_memory_context__: true },
      { role: 'user', content: 'hi' },
    ];
    removeMemoryContext(messages as any);
    expect(messages.length).toBe(2);
  });
});
```

- [ ] **Step 3: Commit**

```bash
cd packages/wunderland
git add src/memory/TurnMemoryRetriever.ts tests/memory/TurnMemoryRetriever.spec.ts
git commit -m "feat(memory): add TurnMemoryRetriever with per-turn injection and tests"
```

---

### Task 3: Barrel Exports

**Files:**

- Create: `packages/wunderland/src/memory/index.ts`

- [ ] **Step 1: Create barrel**

```typescript
// packages/wunderland/src/memory/index.ts
export { createMemorySystem } from './MemorySystemInitializer.js';
export type {
  MemorySystemConfig,
  MemorySystem,
  MemoryTurnResult,
} from './MemorySystemInitializer.js';
export { injectMemoryContext, removeMemoryContext } from './TurnMemoryRetriever.js';
```

- [ ] **Step 2: Commit**

```bash
cd packages/wunderland
git add src/memory/index.ts
git commit -m "feat(memory): barrel exports for memory retrieval system"
```

---

### Task 4: Add Memory Config to WunderlandAgentConfig

**Files:**

- Modify: `packages/wunderland/src/api/types.ts`

- [ ] **Step 1: Add memory config type**

Read the file, find `WunderlandAgentConfig`, and add:

```typescript
  /** Memory retrieval configuration. */
  memory?: {
    /** Total token budget for memory context per turn. @default 4000 */
    retrievalBudgetTokens?: number;
    /** Enable/disable memory retrieval. @default true */
    enabled?: boolean;
    /** Infinite context window config. */
    infiniteContext?: {
      enabled?: boolean;
      strategy?: 'sliding' | 'hierarchical' | 'hybrid';
      compactionThreshold?: number;
      preserveRecentTurns?: number;
      transparencyLevel?: 'none' | 'summary' | 'detailed';
    };
    /** Max context tokens for context window manager. */
    maxContextTokens?: number;
  };
```

- [ ] **Step 2: Commit**

```bash
cd packages/wunderland
git add src/api/types.ts
git commit -m "feat(types): add memory config to WunderlandAgentConfig"
```

---

### Task 5: Wire into chat-runtime.ts (API)

**Files:**

- Modify: `packages/wunderland/src/api/chat-runtime.ts`

- [ ] **Step 1: Add imports**

```typescript
import { createMemorySystem, type MemorySystem } from '../memory/index.js';
import { injectMemoryContext } from '../memory/index.js';
```

- [ ] **Step 2: Initialize memory system after tool loading**

After `loadToolMapFromAgentConfig()` returns (around line 513), add:

```typescript
// ── Memory Retrieval System ───────────────────────────────────────────
let memorySystem: MemorySystem | null = null;
if (agentConfig.memory?.enabled !== false) {
  try {
    // Use existing vector store if AgentStorageManager is available
    const { AgentStorageManager, resolveAgentStorageConfig } = await import('../storage/index.js');
    const storageConfig = resolveAgentStorageConfig(
      seedIdForWorkspace,
      (agentConfig as any).storage
    );
    const storageMgr = new AgentStorageManager(storageConfig);
    await storageMgr.initialize();

    memorySystem = await createMemorySystem({
      vectorStore: storageMgr.getVectorStore(),
      traits: seed.personality as any,
      llm: { providerId: opts.llm.providerId, apiKey: opts.llm.apiKey, baseUrl: opts.llm.baseUrl },
      ollama: (agentConfig as any).ollama,
      markdownMemory: undefined, // Will be wired after Sub-project C
      retrievalBudgetTokens: agentConfig.memory?.retrievalBudgetTokens ?? 4000,
      agentId: seedIdForWorkspace,
    });
  } catch (err) {
    logger.warn?.('[wunderland/api] Memory system init failed (continuing without retrieval)', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
```

- [ ] **Step 3: Add retrieval call in runTurn before LLM call**

In the `runTurn` function, after `history.push({ role: 'user', content: userContent })` and before `runToolCallingTurn()`, add:

```typescript
// Retrieve and inject memory context
if (memorySystem) {
  await injectMemoryContext(history as any, memorySystem, userContent).catch(() => {});
}
```

- [ ] **Step 4: Commit**

```bash
cd packages/wunderland
git add src/api/chat-runtime.ts
git commit -m "feat(memory): wire retrieval pipeline into chat-runtime API"
```

---

### Task 6: Wire into CLI chat.ts

**Files:**

- Modify: `packages/wunderland/src/cli/commands/chat.ts`

- [ ] **Step 1: Add imports**

Near existing imports (around line 90-91):

```typescript
import { createMemorySystem, type MemorySystem } from '../../memory/index.js';
import { injectMemoryContext } from '../../memory/index.js';
```

- [ ] **Step 2: Initialize memory system after AgentStorageManager**

After the auto-ingest pipeline block (around line 1000), add:

```typescript
// ── Memory Retrieval System ───────────────────────────────────────
let memorySystem: MemorySystem | null = null;
if (agentStorageManager && cfg?.memory?.enabled !== false) {
  try {
    memorySystem = await createMemorySystem({
      vectorStore: agentStorageManager.getVectorStore(),
      traits: personality,
      llm: { providerId, apiKey: llmApiKey, baseUrl: llmBaseUrl },
      ollama: cfg?.ollama,
      markdownMemory: (ctx as any).markdownWorkingMemory,
      retrievalBudgetTokens: cfg?.memory?.retrievalBudgetTokens ?? 4000,
      agentId: seedId,
    });
  } catch {
    // Non-fatal
  }
}
```

- [ ] **Step 3: Add retrieval in runChatTurn**

In `runChatTurn()`, after `messages.push({ role: 'user', content: input })` (line 1337) and before the context window compaction block, add:

```typescript
// Retrieve and inject memory context
if (memorySystem) {
  await injectMemoryContext(messages as any, memorySystem, input).catch(() => {});
}
```

- [ ] **Step 4: Commit**

```bash
cd packages/wunderland
git add src/cli/commands/chat.ts
git commit -m "feat(memory): wire retrieval pipeline into CLI chat"
```

---

### Task 7: Push and Verify

- [ ] **Step 1: Push wunderland**

```bash
cd packages/wunderland && git push
```

- [ ] **Step 2: Update parent repo**

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant
git add packages/wunderland
git commit -m "feat: wire memory retrieval pipeline into wunderland chat loop"
git push
```
