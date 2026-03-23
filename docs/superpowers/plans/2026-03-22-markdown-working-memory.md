# Persistent Markdown Working Memory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Mastra-style persistent markdown file (`~/.wunderland/agents/{seedId}/working-memory.md`) that agents read/update via tools, injected into every system prompt alongside the existing Baddeley cognitive working memory.

**Architecture:** One new class (`MarkdownWorkingMemory`) handles file I/O + template management. Two ITool implementations let the agent read/write the file. The `MemoryPromptAssembler` gets a new `persistentMemoryText` input field. The wunderland startup wires the tools into the toolMap and passes the file content to the prompt builder.

**Tech Stack:** Node.js fs (readFileSync/writeFileSync), ITool interface from @framers/agentos, vitest for tests.

---

## File Structure

| Action | File                                                                  | Responsibility                                                    |
| ------ | --------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Create | `packages/agentos/src/memory/working/MarkdownWorkingMemory.ts`        | File read/write, template creation, token estimation              |
| Create | `packages/agentos/src/memory/working/UpdateWorkingMemoryTool.ts`      | ITool — agent rewrites the markdown file                          |
| Create | `packages/agentos/src/memory/working/ReadWorkingMemoryTool.ts`        | ITool — agent reads the markdown file                             |
| Modify | `packages/agentos/src/memory/prompt/MemoryPromptAssembler.ts`         | Add `persistentMemoryText` to input, inject before working memory |
| Modify | `packages/agentos/src/memory/config.ts`                               | Add `persistentMemory` to budget allocation                       |
| Modify | `packages/agentos/src/memory/index.ts`                                | Export new classes                                                |
| Modify | `packages/wunderland/src/cli/commands/start/extension-loader.ts`      | Create file on start, register tools                              |
| Create | `packages/agentos/tests/memory/working/MarkdownWorkingMemory.spec.ts` | Unit tests                                                        |

---

### Task 1: MarkdownWorkingMemory Class

**Files:**

- Create: `packages/agentos/src/memory/working/MarkdownWorkingMemory.ts`
- Create: `packages/agentos/tests/memory/working/MarkdownWorkingMemory.spec.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/agentos/tests/memory/working/MarkdownWorkingMemory.spec.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MarkdownWorkingMemory } from '../../src/memory/working/MarkdownWorkingMemory.js';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('MarkdownWorkingMemory', () => {
  let dir: string;
  let filePath: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'mwm-'));
    filePath = join(dir, 'working-memory.md');
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it('creates file with default template if missing', () => {
    const mwm = new MarkdownWorkingMemory(filePath);
    mwm.ensureFile();
    const content = readFileSync(filePath, 'utf8');
    expect(content).toContain('# Working Memory');
  });

  it('creates file with custom template', () => {
    const mwm = new MarkdownWorkingMemory(filePath, '# Custom\n- Notes:');
    mwm.ensureFile();
    expect(readFileSync(filePath, 'utf8')).toBe('# Custom\n- Notes:');
  });

  it('reads existing file content', () => {
    const mwm = new MarkdownWorkingMemory(filePath);
    mwm.ensureFile();
    mwm.write('# Updated\nHello world');
    expect(mwm.read()).toBe('# Updated\nHello world');
  });

  it('write replaces entire content', () => {
    const mwm = new MarkdownWorkingMemory(filePath);
    mwm.ensureFile();
    mwm.write('First');
    mwm.write('Second');
    expect(mwm.read()).toBe('Second');
  });

  it('returns empty string if file does not exist', () => {
    const mwm = new MarkdownWorkingMemory(filePath);
    expect(mwm.read()).toBe('');
  });

  it('estimates token count', () => {
    const mwm = new MarkdownWorkingMemory(filePath);
    mwm.ensureFile();
    mwm.write('hello world foo bar');
    expect(mwm.estimateTokens()).toBeGreaterThan(0);
    expect(mwm.estimateTokens()).toBeLessThan(20);
  });

  it('enforces max token limit on write', () => {
    const mwm = new MarkdownWorkingMemory(filePath, '', 10);
    mwm.ensureFile();
    const longContent = 'word '.repeat(500);
    const result = mwm.write(longContent);
    expect(result.truncated).toBe(true);
  });
});
```

- [ ] **Step 2: Write MarkdownWorkingMemory implementation**

```typescript
// packages/agentos/src/memory/working/MarkdownWorkingMemory.ts
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const DEFAULT_TEMPLATE = `# Working Memory

## User Profile
- **Name**:
- **Preferences**:

## Current Context
- **Active Topics**:
- **Recent Requests**:

## Notes
`;

export interface WriteResult {
  success: boolean;
  truncated: boolean;
  tokensUsed: number;
  error?: string;
}

/**
 * Persistent markdown working memory backed by a .md file on disk.
 * The agent reads and fully replaces this file via tools.
 * File contents are injected into the system prompt every turn.
 */
export class MarkdownWorkingMemory {
  constructor(
    private readonly filePath: string,
    private readonly template: string = DEFAULT_TEMPLATE,
    private readonly maxTokens: number = 2000
  ) {}

  /** Creates the file with the template if it doesn't exist. */
  ensureFile(): void {
    if (existsSync(this.filePath)) return;
    const dir = dirname(this.filePath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(this.filePath, this.template, 'utf8');
  }

  /** Reads current file contents. Returns empty string if file missing. */
  read(): string {
    if (!existsSync(this.filePath)) return '';
    try {
      return readFileSync(this.filePath, 'utf8');
    } catch {
      return '';
    }
  }

  /** Replaces file contents entirely. Truncates if over maxTokens. */
  write(content: string): WriteResult {
    const tokens = this.estimateTokenCount(content);
    let truncated = false;

    if (tokens > this.maxTokens) {
      // Rough truncation: ~4 chars per token
      const maxChars = this.maxTokens * 4;
      content = content.slice(0, maxChars) + '\n\n<!-- truncated: exceeded token limit -->';
      truncated = true;
    }

    try {
      const dir = dirname(this.filePath);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(this.filePath, content, 'utf8');
      return { success: true, truncated, tokensUsed: this.estimateTokenCount(content) };
    } catch (err: any) {
      return { success: false, truncated: false, tokensUsed: 0, error: err?.message };
    }
  }

  /** Estimates token count (~4 chars per token). */
  estimateTokens(): number {
    return this.estimateTokenCount(this.read());
  }

  private estimateTokenCount(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }

  /** Returns the file path for reference. */
  getFilePath(): string {
    return this.filePath;
  }
}
```

- [ ] **Step 3: Run tests**

Run: `cd packages/agentos && npx vitest run tests/memory/working/MarkdownWorkingMemory.spec.ts`

- [ ] **Step 4: Commit**

```bash
cd packages/agentos
git add src/memory/working/MarkdownWorkingMemory.ts tests/memory/working/MarkdownWorkingMemory.spec.ts
git commit -m "feat(memory): add MarkdownWorkingMemory — persistent .md file for agent context"
```

---

### Task 2: ITool Implementations

**Files:**

- Create: `packages/agentos/src/memory/working/UpdateWorkingMemoryTool.ts`
- Create: `packages/agentos/src/memory/working/ReadWorkingMemoryTool.ts`

- [ ] **Step 1: Write UpdateWorkingMemoryTool**

```typescript
// packages/agentos/src/memory/working/UpdateWorkingMemoryTool.ts
import type {
  ITool,
  ToolExecutionResult,
  ToolExecutionContext,
  JSONSchemaObject,
} from '../../core/tools/ITool.js';
import type { MarkdownWorkingMemory } from './MarkdownWorkingMemory.js';

interface UpdateInput {
  content: string;
}

interface UpdateOutput {
  tokensUsed: number;
  truncated: boolean;
}

/**
 * Tool that lets the agent fully replace its persistent markdown working memory.
 * The agent should call this whenever it learns new persistent context about the
 * user, session, or ongoing tasks that should survive across conversations.
 */
export class UpdateWorkingMemoryTool implements ITool<UpdateInput, UpdateOutput> {
  readonly id = 'update-working-memory-v1';
  readonly name = 'update_working_memory';
  readonly displayName = 'Update Working Memory';
  readonly description =
    'Replace your persistent working memory with updated content. ' +
    'Use this to store user preferences, ongoing context, project notes, ' +
    'and anything that should persist across conversations. ' +
    'You must provide the COMPLETE updated content (full replacement, not a patch).';
  readonly category = 'memory';
  readonly hasSideEffects = true;
  readonly inputSchema: JSONSchemaObject = {
    type: 'object',
    properties: {
      content: {
        type: 'string',
        description: 'The full markdown content to replace working memory with.',
      },
    },
    required: ['content'],
  };

  constructor(private readonly memory: MarkdownWorkingMemory) {}

  async execute(
    args: UpdateInput,
    _context: ToolExecutionContext
  ): Promise<ToolExecutionResult<UpdateOutput>> {
    const result = this.memory.write(args.content);
    if (!result.success) {
      return { success: false, error: result.error ?? 'Failed to write working memory' };
    }
    return {
      success: true,
      output: { tokensUsed: result.tokensUsed, truncated: result.truncated },
    };
  }
}
```

- [ ] **Step 2: Write ReadWorkingMemoryTool**

```typescript
// packages/agentos/src/memory/working/ReadWorkingMemoryTool.ts
import type {
  ITool,
  ToolExecutionResult,
  ToolExecutionContext,
  JSONSchemaObject,
} from '../../core/tools/ITool.js';
import type { MarkdownWorkingMemory } from './MarkdownWorkingMemory.js';

interface ReadOutput {
  content: string;
  tokensUsed: number;
}

/**
 * Tool that lets the agent explicitly read its persistent working memory.
 * The memory is also injected into the system prompt automatically,
 * but this tool is useful when the agent wants to reason about its
 * memory before deciding what to update.
 */
export class ReadWorkingMemoryTool implements ITool<Record<string, never>, ReadOutput> {
  readonly id = 'read-working-memory-v1';
  readonly name = 'read_working_memory';
  readonly displayName = 'Read Working Memory';
  readonly description =
    'Read your current persistent working memory contents. ' +
    'This is also available in your system prompt, but use this tool ' +
    'when you need to inspect your memory before updating it.';
  readonly category = 'memory';
  readonly hasSideEffects = false;
  readonly inputSchema: JSONSchemaObject = {
    type: 'object',
    properties: {},
  };

  constructor(private readonly memory: MarkdownWorkingMemory) {}

  async execute(
    _args: Record<string, never>,
    _context: ToolExecutionContext
  ): Promise<ToolExecutionResult<ReadOutput>> {
    const content = this.memory.read();
    return {
      success: true,
      output: { content, tokensUsed: this.memory.estimateTokens() },
    };
  }
}
```

- [ ] **Step 3: Commit**

```bash
cd packages/agentos
git add src/memory/working/UpdateWorkingMemoryTool.ts src/memory/working/ReadWorkingMemoryTool.ts
git commit -m "feat(memory): add update_working_memory and read_working_memory tools"
```

---

### Task 3: Prompt Assembler Integration

**Files:**

- Modify: `packages/agentos/src/memory/prompt/MemoryPromptAssembler.ts`
- Modify: `packages/agentos/src/memory/config.ts`

- [ ] **Step 1: Add `persistentMemory` to budget allocation in config.ts**

In `DEFAULT_BUDGET_ALLOCATION`, add `persistentMemory: 0.05` and reduce `semanticRecall` from `0.45` to `0.40`:

```typescript
export const DEFAULT_BUDGET_ALLOCATION: MemoryBudgetAllocation = {
  persistentMemory: 0.05, // 5% — markdown working memory file
  workingMemory: 0.15, // 15% — Baddeley cognitive slots
  semanticRecall: 0.4, // 40% (was 45%)
  recentEpisodic: 0.25, // 25%
  prospectiveAlerts: 0.05, // 5%
  graphAssociations: 0.05, // 5%
  observationNotes: 0.05, // 5%
};
```

Also add `persistentMemory` to the `MemoryBudgetAllocation` type.

- [ ] **Step 2: Add `persistentMemoryText` to MemoryAssemblerInput**

In `MemoryPromptAssembler.ts`, add to the input interface:

```typescript
/** Persistent markdown working memory content (from .md file). */
persistentMemoryText?: string;
```

- [ ] **Step 3: Inject persistent memory into assembled output**

In the `assembleMemoryContext` function, after computing budgets, add persistent memory as the FIRST section (before working memory):

```typescript
const pmBudget = Math.floor(budget * alloc.persistentMemory);
if (input.persistentMemoryText && pmBudget > 0) {
  const truncated = truncateToTokenBudget(input.persistentMemoryText, pmBudget);
  sections.push(`## Persistent Memory\n\n${truncated}`);
  tokensUsed += estimateTokens(truncated);
}
```

- [ ] **Step 4: Commit**

```bash
cd packages/agentos
git add src/memory/config.ts src/memory/prompt/MemoryPromptAssembler.ts
git commit -m "feat(memory): inject persistent markdown memory into prompt assembler"
```

---

### Task 4: Barrel Exports

**Files:**

- Modify: `packages/agentos/src/memory/index.ts`

- [ ] **Step 1: Add exports for new classes**

```typescript
// --- Persistent Markdown Working Memory ---
export { MarkdownWorkingMemory } from './working/MarkdownWorkingMemory.js';
export type { WriteResult } from './working/MarkdownWorkingMemory.js';
export { UpdateWorkingMemoryTool } from './working/UpdateWorkingMemoryTool.js';
export { ReadWorkingMemoryTool } from './working/ReadWorkingMemoryTool.js';
```

- [ ] **Step 2: Commit**

```bash
cd packages/agentos
git add src/memory/index.ts
git commit -m "feat(memory): export MarkdownWorkingMemory and tools from barrel"
```

---

### Task 5: Wire into Wunderland Startup

**Files:**

- Modify: `packages/wunderland/src/cli/commands/start/extension-loader.ts`

- [ ] **Step 1: Import and instantiate MarkdownWorkingMemory**

After extension loading, before tool filtering, add:

```typescript
import {
  MarkdownWorkingMemory,
  UpdateWorkingMemoryTool,
  ReadWorkingMemoryTool,
} from '@framers/agentos/memory';

// Persistent markdown working memory
const wmPath = join(workspaceBaseDir, 'agents', workspaceAgentId, 'working-memory.md');
const wmTemplate = cfg?.workingMemoryTemplate ?? undefined;
const markdownMemory = new MarkdownWorkingMemory(wmPath, wmTemplate);
markdownMemory.ensureFile();

// Register tools
const updateTool = new UpdateWorkingMemoryTool(markdownMemory);
const readTool = new ReadWorkingMemoryTool(markdownMemory);
toolMap.set(updateTool.name, updateTool as any);
toolMap.set(readTool.name, readTool as any);

// Store reference for prompt injection
ctx.markdownWorkingMemory = markdownMemory;
```

- [ ] **Step 2: Commit**

```bash
cd packages/wunderland
git add src/cli/commands/start/extension-loader.ts
git commit -m "feat(cli): register markdown working memory tools on startup"
```

---

### Task 6: Push and Verify

- [ ] **Step 1: Push agentos**

```bash
cd packages/agentos && git push
```

- [ ] **Step 2: Push wunderland**

```bash
cd packages/wunderland && git push
```

- [ ] **Step 3: Update parent repo**

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant
git add packages/agentos packages/wunderland
git commit -m "feat: persistent markdown working memory (Mastra-style)"
git push
```
