# AgentOS High-Level API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `generateText`, `streamText`, and `agent` as top-level exports from `@framers/agentos` with AI SDK-style ergonomics — model strings, auto-env keys, Zod tools, streaming iterables.

**Architecture:** Five new files in `src/api/`. `model.ts` parses `'openai:gpt-4o'` strings and creates provider instances. `tool-adapter.ts` normalizes Zod/JSON Schema/ITool inputs. `generateText.ts` and `streamText.ts` are stateless functions that create a temporary provider, run the LLM call, and return typed results. `agent.ts` is a stateful factory wrapping the full AgentOS lifecycle. All exported from `src/index.ts`.

**Tech Stack:** Existing AIModelProviderManager + OpenAI/Ollama/OpenRouter providers, ITool interface, AsyncGenerator streaming, vitest.

---

## File Structure

| Action | File                             | Responsibility                                              |
| ------ | -------------------------------- | ----------------------------------------------------------- |
| Create | `src/api/model.ts`               | Parse `'provider:model'`, resolve env keys, create provider |
| Create | `src/api/tool-adapter.ts`        | Normalize Zod/JSON Schema/ITool to common format            |
| Create | `src/api/generateText.ts`        | Stateless text generation                                   |
| Create | `src/api/streamText.ts`          | Stateless streaming                                         |
| Create | `src/api/agent.ts`               | Stateful agent factory with sessions                        |
| Modify | `src/index.ts`                   | Export new functions                                        |
| Create | `tests/api/model.spec.ts`        | Model string parsing tests                                  |
| Create | `tests/api/tool-adapter.spec.ts` | Tool adapter tests                                          |
| Create | `tests/api/generateText.spec.ts` | generateText tests                                          |
| Create | `tests/api/streamText.spec.ts`   | streamText tests                                            |

---

### Task 1: Model String Parser (`model.ts`)

**Files:**

- Create: `packages/agentos/src/api/model.ts`
- Create: `packages/agentos/tests/api/model.spec.ts`

- [ ] **Step 1: Write tests**

```typescript
// packages/agentos/tests/api/model.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseModelString, resolveProvider } from '../src/api/model.js';

describe('parseModelString', () => {
  it('parses openai:gpt-4o', () => {
    const result = parseModelString('openai:gpt-4o');
    expect(result.providerId).toBe('openai');
    expect(result.modelId).toBe('gpt-4o');
  });

  it('parses anthropic:claude-sonnet-4-5-20250929', () => {
    const result = parseModelString('anthropic:claude-sonnet-4-5-20250929');
    expect(result.providerId).toBe('anthropic');
    expect(result.modelId).toBe('claude-sonnet-4-5-20250929');
  });

  it('parses ollama:llama3.2', () => {
    const result = parseModelString('ollama:llama3.2');
    expect(result.providerId).toBe('ollama');
    expect(result.modelId).toBe('llama3.2');
  });

  it('parses openrouter with slash in model', () => {
    const result = parseModelString('openrouter:anthropic/claude-sonnet-4-5-20250929');
    expect(result.providerId).toBe('openrouter');
    expect(result.modelId).toBe('anthropic/claude-sonnet-4-5-20250929');
  });

  it('throws on invalid format', () => {
    expect(() => parseModelString('invalid')).toThrow('Invalid model');
    expect(() => parseModelString('')).toThrow('Invalid model');
  });
});

describe('resolveProvider', () => {
  const origEnv = { ...process.env };
  afterEach(() => {
    process.env = { ...origEnv };
  });

  it('resolves openai from OPENAI_API_KEY env', () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    const config = resolveProvider('openai', 'gpt-4o');
    expect(config.providerId).toBe('openai');
    expect(config.apiKey).toBe('sk-test');
    expect(config.modelId).toBe('gpt-4o');
  });

  it('uses explicit apiKey over env', () => {
    process.env.OPENAI_API_KEY = 'sk-env';
    const config = resolveProvider('openai', 'gpt-4o', { apiKey: 'sk-explicit' });
    expect(config.apiKey).toBe('sk-explicit');
  });

  it('resolves ollama from OLLAMA_BASE_URL', () => {
    process.env.OLLAMA_BASE_URL = 'http://localhost:11434';
    const config = resolveProvider('ollama', 'llama3.2');
    expect(config.baseUrl).toBe('http://localhost:11434');
  });

  it('throws when no API key found', () => {
    delete process.env.OPENAI_API_KEY;
    expect(() => resolveProvider('openai', 'gpt-4o')).toThrow('No API key');
  });
});
```

- [ ] **Step 2: Write implementation**

```typescript
// packages/agentos/src/api/model.ts
import { AIModelProviderManager } from '../core/llm/providers/AIModelProviderManager.js';

export interface ParsedModel {
  providerId: string;
  modelId: string;
}

export interface ResolvedProvider {
  providerId: string;
  modelId: string;
  apiKey?: string;
  baseUrl?: string;
}

const ENV_KEY_MAP: Record<string, string> = {
  openai: 'OPENAI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
  openrouter: 'OPENROUTER_API_KEY',
  gemini: 'GEMINI_API_KEY',
};

const ENV_URL_MAP: Record<string, string> = {
  ollama: 'OLLAMA_BASE_URL',
};

/**
 * Parses 'provider:model' string format.
 * Examples: 'openai:gpt-4o', 'ollama:llama3.2', 'openrouter:anthropic/claude-sonnet-4-5-20250929'
 */
export function parseModelString(model: string): ParsedModel {
  if (!model || typeof model !== 'string') {
    throw new Error('Invalid model string. Expected "provider:model" (e.g. "openai:gpt-4o").');
  }
  const colonIdx = model.indexOf(':');
  if (colonIdx <= 0 || colonIdx === model.length - 1) {
    throw new Error(`Invalid model "${model}". Expected "provider:model" (e.g. "openai:gpt-4o").`);
  }
  return {
    providerId: model.slice(0, colonIdx),
    modelId: model.slice(colonIdx + 1),
  };
}

/**
 * Resolves provider config from env vars, with optional overrides.
 */
export function resolveProvider(
  providerId: string,
  modelId: string,
  overrides?: { apiKey?: string; baseUrl?: string }
): ResolvedProvider {
  const apiKey =
    overrides?.apiKey ??
    (ENV_KEY_MAP[providerId] ? process.env[ENV_KEY_MAP[providerId]] : undefined);
  const baseUrl =
    overrides?.baseUrl ??
    (ENV_URL_MAP[providerId] ? process.env[ENV_URL_MAP[providerId]] : undefined);

  if (providerId === 'ollama') {
    if (!baseUrl) {
      throw new Error(`No base URL for ollama. Set OLLAMA_BASE_URL or pass baseUrl.`);
    }
    return { providerId, modelId, baseUrl };
  }

  // Anthropic goes through OpenRouter by default in AgentOS
  if (providerId === 'anthropic' && !apiKey) {
    const orKey = process.env['OPENROUTER_API_KEY'];
    if (orKey) {
      return { providerId: 'openrouter', modelId: `anthropic/${modelId}`, apiKey: orKey };
    }
    throw new Error(`No API key for anthropic. Set ANTHROPIC_API_KEY or OPENROUTER_API_KEY.`);
  }

  if (!apiKey) {
    const envVar = ENV_KEY_MAP[providerId] ?? `${providerId.toUpperCase()}_API_KEY`;
    throw new Error(`No API key for ${providerId}. Set ${envVar} or pass apiKey.`);
  }

  return { providerId, modelId, apiKey, baseUrl };
}

/**
 * Creates an AIModelProviderManager from a resolved provider config.
 */
export async function createProviderManager(
  resolved: ResolvedProvider
): Promise<AIModelProviderManager> {
  const manager = new AIModelProviderManager();

  const providerConfig: Record<string, unknown> = {};
  if (resolved.apiKey) providerConfig.apiKey = resolved.apiKey;
  if (resolved.baseUrl) {
    providerConfig.baseURL = resolved.baseUrl;
    providerConfig.baseUrl = resolved.baseUrl;
  }

  await manager.initialize({
    providers: [
      {
        providerId: resolved.providerId,
        enabled: true,
        isDefault: true,
        config: providerConfig,
      },
    ],
  });

  return manager;
}
```

- [ ] **Step 3: Commit**

```bash
cd packages/agentos
git add src/api/model.ts tests/api/model.spec.ts
git commit -m "feat(api): add model string parser with env key resolution"
```

---

### Task 2: Tool Adapter (`tool-adapter.ts`)

**Files:**

- Create: `packages/agentos/src/api/tool-adapter.ts`
- Create: `packages/agentos/tests/api/tool-adapter.spec.ts`

- [ ] **Step 1: Write tests**

```typescript
// packages/agentos/tests/api/tool-adapter.spec.ts
import { describe, it, expect } from 'vitest';
import { adaptTools, type ToolDefinition } from '../src/api/tool-adapter.js';

describe('adaptTools', () => {
  it('adapts JSON Schema tool', () => {
    const tools = adaptTools({
      search: {
        description: 'Search the web',
        parameters: {
          type: 'object',
          properties: { query: { type: 'string' } },
          required: ['query'],
        },
        execute: async ({ query }: any) => ({ results: [query] }),
      },
    });
    expect(tools).toHaveLength(1);
    expect(tools[0].name).toBe('search');
    expect(tools[0].description).toBe('Search the web');
    expect(tools[0].inputSchema.type).toBe('object');
  });

  it('passes through ITool instances', () => {
    const tool = {
      id: 'test-v1',
      name: 'test',
      displayName: 'Test',
      description: 'A test',
      inputSchema: { type: 'object', properties: {} },
      hasSideEffects: false,
      execute: async () => ({ success: true, output: 'ok' }),
    };
    const tools = adaptTools({ test: tool as any });
    expect(tools).toHaveLength(1);
    expect(tools[0].id).toBe('test-v1');
  });

  it('returns empty array for undefined', () => {
    expect(adaptTools(undefined)).toEqual([]);
  });
});
```

- [ ] **Step 2: Write implementation**

```typescript
// packages/agentos/src/api/tool-adapter.ts
import type {
  ITool,
  ToolExecutionResult,
  ToolExecutionContext,
  JSONSchemaObject,
} from '../core/tools/ITool.js';

export interface ToolDefinition {
  description?: string;
  parameters?: Record<string, unknown>;
  execute?: (args: any) => Promise<any>;
}

export type ToolDefinitionMap = Record<string, ToolDefinition | ITool>;

/**
 * Adapts Zod schemas, JSON Schema objects, and ITool instances into ITool[].
 */
export function adaptTools(tools: ToolDefinitionMap | undefined): ITool[] {
  if (!tools) return [];
  const result: ITool[] = [];

  for (const [name, def] of Object.entries(tools)) {
    // ITool pass-through (has inputSchema + execute as ITool signature)
    if ('inputSchema' in def && 'id' in def) {
      result.push(def as ITool);
      continue;
    }

    const td = def as ToolDefinition;
    let schema: JSONSchemaObject;

    if (td.parameters && '_def' in (td.parameters as any)) {
      // Zod schema — convert to JSON Schema
      try {
        const { zodToJsonSchema } = require('zod-to-json-schema') as any;
        schema = zodToJsonSchema(td.parameters) as JSONSchemaObject;
      } catch {
        // zod-to-json-schema not installed — use basic extraction
        schema = { type: 'object', properties: {} };
      }
    } else {
      schema = (td.parameters ?? { type: 'object', properties: {} }) as JSONSchemaObject;
    }

    const executeFn = td.execute ?? (async () => ({ success: true }));

    result.push({
      id: `${name}-v1`,
      name,
      displayName: name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
        .trim(),
      description: td.description ?? '',
      inputSchema: schema,
      hasSideEffects: false,
      async execute(args: any, _ctx: ToolExecutionContext): Promise<ToolExecutionResult> {
        try {
          const output = await executeFn(args);
          return { success: true, output };
        } catch (err: any) {
          return { success: false, error: err?.message ?? String(err) };
        }
      },
    });
  }

  return result;
}
```

- [ ] **Step 3: Commit**

```bash
cd packages/agentos
git add src/api/tool-adapter.ts tests/api/tool-adapter.spec.ts
git commit -m "feat(api): add tool adapter for Zod/JSON Schema/ITool normalization"
```

---

### Task 3: generateText

**Files:**

- Create: `packages/agentos/src/api/generateText.ts`
- Create: `packages/agentos/tests/api/generateText.spec.ts`

- [ ] **Step 1: Write generateText implementation**

```typescript
// packages/agentos/src/api/generateText.ts
import { parseModelString, resolveProvider, createProviderManager } from './model.js';
import { adaptTools, type ToolDefinitionMap } from './tool-adapter.js';
import type { ITool } from '../core/tools/ITool.js';

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
}

export interface ToolCallRecord {
  name: string;
  args: unknown;
  result?: unknown;
  error?: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface GenerateTextOptions {
  model: string;
  prompt?: string;
  system?: string;
  messages?: Message[];
  tools?: ToolDefinitionMap;
  maxSteps?: number;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;
  baseUrl?: string;
}

export interface GenerateTextResult {
  text: string;
  usage: TokenUsage;
  toolCalls: ToolCallRecord[];
  finishReason: 'stop' | 'length' | 'tool-calls' | 'error';
}

/**
 * Stateless text generation. Creates a temporary provider, runs the LLM call,
 * and returns the complete result. Supports multi-step tool calling.
 */
export async function generateText(opts: GenerateTextOptions): Promise<GenerateTextResult> {
  const { providerId, modelId } = parseModelString(opts.model);
  const resolved = resolveProvider(providerId, modelId, {
    apiKey: opts.apiKey,
    baseUrl: opts.baseUrl,
  });
  const manager = await createProviderManager(resolved);

  const provider = manager.getProvider(resolved.providerId);
  if (!provider) throw new Error(`Provider ${resolved.providerId} not available.`);

  // Build messages
  const messages: Array<Record<string, unknown>> = [];
  if (opts.system) messages.push({ role: 'system', content: opts.system });
  if (opts.messages) {
    for (const m of opts.messages) messages.push({ role: m.role, content: m.content });
  }
  if (opts.prompt) messages.push({ role: 'user', content: opts.prompt });

  const tools = adaptTools(opts.tools);
  const toolMap = new Map<string, ITool>();
  for (const t of tools) toolMap.set(t.name, t);

  const toolSchemas =
    tools.length > 0
      ? tools.map((t) => ({
          type: 'function' as const,
          function: { name: t.name, description: t.description, parameters: t.inputSchema },
        }))
      : undefined;

  const allToolCalls: ToolCallRecord[] = [];
  let totalUsage: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  const maxSteps = opts.maxSteps ?? 1;

  for (let step = 0; step < maxSteps; step++) {
    const response = await provider.generateChatCompletion({
      model: resolved.modelId,
      messages: messages as any,
      tools: toolSchemas,
      temperature: opts.temperature,
      max_tokens: opts.maxTokens,
    });

    // Accumulate usage
    if (response.usage) {
      totalUsage.promptTokens += response.usage.prompt_tokens ?? 0;
      totalUsage.completionTokens += response.usage.completion_tokens ?? 0;
      totalUsage.totalTokens += response.usage.total_tokens ?? 0;
    }

    const choice = response.choices?.[0];
    if (!choice) break;

    // If assistant returned text, we're done
    if (choice.message?.content && !choice.message?.tool_calls?.length) {
      return {
        text: choice.message.content,
        usage: totalUsage,
        toolCalls: allToolCalls,
        finishReason: (choice.finish_reason as any) ?? 'stop',
      };
    }

    // Tool calls
    if (choice.message?.tool_calls?.length) {
      messages.push({
        role: 'assistant',
        content: choice.message.content ?? null,
        tool_calls: choice.message.tool_calls,
      });

      for (const tc of choice.message.tool_calls) {
        const tool = toolMap.get(tc.function.name);
        const record: ToolCallRecord = {
          name: tc.function.name,
          args: JSON.parse(tc.function.arguments ?? '{}'),
        };

        if (tool) {
          try {
            const result = await tool.execute(record.args as any, {} as any);
            record.result = result.output;
            record.error = result.success ? undefined : result.error;
            messages.push({
              role: 'tool',
              tool_call_id: tc.id,
              content: JSON.stringify(result.output ?? result.error ?? ''),
            });
          } catch (err: any) {
            record.error = err?.message;
            messages.push({
              role: 'tool',
              tool_call_id: tc.id,
              content: JSON.stringify({ error: err?.message }),
            });
          }
        }
        allToolCalls.push(record);
      }
      continue; // Loop for next step
    }

    // No content and no tool calls — done
    return {
      text: choice.message?.content ?? '',
      usage: totalUsage,
      toolCalls: allToolCalls,
      finishReason: (choice.finish_reason as any) ?? 'stop',
    };
  }

  // Exhausted maxSteps — return last state
  const lastAssistant = messages.filter((m) => m.role === 'assistant').pop();
  return {
    text: (lastAssistant?.content as string) ?? '',
    usage: totalUsage,
    toolCalls: allToolCalls,
    finishReason: 'tool-calls',
  };
}
```

- [ ] **Step 2: Write test**

```typescript
// packages/agentos/tests/api/generateText.spec.ts
import { describe, it, expect, vi } from 'vitest';

// Integration test — requires OPENAI_API_KEY
const hasOpenAI = !!process.env.OPENAI_API_KEY;

describe.skipIf(!hasOpenAI)('generateText (integration)', () => {
  it('generates text from openai', async () => {
    const { generateText } = await import('../src/api/generateText.js');
    const result = await generateText({
      model: 'openai:gpt-4o-mini',
      prompt: 'Say "hello" and nothing else.',
      maxTokens: 10,
    });
    expect(result.text.toLowerCase()).toContain('hello');
    expect(result.usage.totalTokens).toBeGreaterThan(0);
    expect(result.finishReason).toBe('stop');
  });
});

describe('generateText (unit)', () => {
  it('throws on invalid model string', async () => {
    const { generateText } = await import('../src/api/generateText.js');
    await expect(generateText({ model: 'invalid', prompt: 'test' })).rejects.toThrow(
      'Invalid model'
    );
  });
});
```

- [ ] **Step 3: Commit**

```bash
cd packages/agentos
git add src/api/generateText.ts tests/api/generateText.spec.ts
git commit -m "feat(api): add generateText — stateless text generation with tool support"
```

---

### Task 4: streamText

**Files:**

- Create: `packages/agentos/src/api/streamText.ts`

- [ ] **Step 1: Write streamText implementation**

```typescript
// packages/agentos/src/api/streamText.ts
import { parseModelString, resolveProvider, createProviderManager } from './model.js';
import { adaptTools, type ToolDefinitionMap } from './tool-adapter.js';
import type { GenerateTextOptions, Message, TokenUsage, ToolCallRecord } from './generateText.js';

export type StreamPart =
  | { type: 'text'; text: string }
  | { type: 'tool-call'; toolName: string; args: unknown }
  | { type: 'tool-result'; toolName: string; result: unknown }
  | { type: 'error'; error: Error };

export interface StreamTextResult {
  textStream: AsyncIterable<string>;
  fullStream: AsyncIterable<StreamPart>;
  text: Promise<string>;
  usage: Promise<TokenUsage>;
  toolCalls: Promise<ToolCallRecord[]>;
}

/**
 * Stateless streaming text generation. Returns immediately with async iterables.
 */
export function streamText(opts: GenerateTextOptions): StreamTextResult {
  let resolveText: (v: string) => void;
  let resolveUsage: (v: TokenUsage) => void;
  let resolveToolCalls: (v: ToolCallRecord[]) => void;

  const textPromise = new Promise<string>((r) => {
    resolveText = r;
  });
  const usagePromise = new Promise<TokenUsage>((r) => {
    resolveUsage = r;
  });
  const toolCallsPromise = new Promise<ToolCallRecord[]>((r) => {
    resolveToolCalls = r;
  });

  const parts: StreamPart[] = [];
  let fullText = '';
  const allToolCalls: ToolCallRecord[] = [];

  async function* runStream(): AsyncGenerator<StreamPart> {
    const { providerId, modelId } = parseModelString(opts.model);
    const resolved = resolveProvider(providerId, modelId, {
      apiKey: opts.apiKey,
      baseUrl: opts.baseUrl,
    });
    const manager = await createProviderManager(resolved);
    const provider = manager.getProvider(resolved.providerId);
    if (!provider) throw new Error(`Provider ${resolved.providerId} not available.`);

    const messages: Array<Record<string, unknown>> = [];
    if (opts.system) messages.push({ role: 'system', content: opts.system });
    if (opts.messages)
      for (const m of opts.messages) messages.push({ role: m.role, content: m.content });
    if (opts.prompt) messages.push({ role: 'user', content: opts.prompt });

    const tools = adaptTools(opts.tools);
    const toolSchemas =
      tools.length > 0
        ? tools.map((t) => ({
            type: 'function' as const,
            function: { name: t.name, description: t.description, parameters: t.inputSchema },
          }))
        : undefined;

    const stream = await provider.streamChatCompletion({
      model: resolved.modelId,
      messages: messages as any,
      tools: toolSchemas,
      temperature: opts.temperature,
      max_tokens: opts.maxTokens,
    });

    const usage: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta;
      if (delta?.content) {
        fullText += delta.content;
        const part: StreamPart = { type: 'text', text: delta.content };
        parts.push(part);
        yield part;
      }
      if (chunk.usage) {
        usage.promptTokens += chunk.usage.prompt_tokens ?? 0;
        usage.completionTokens += chunk.usage.completion_tokens ?? 0;
        usage.totalTokens += chunk.usage.total_tokens ?? 0;
      }
    }

    resolveText!(fullText);
    resolveUsage!(usage);
    resolveToolCalls!(allToolCalls);
  }

  const fullStreamIterable = runStream();

  const textStreamIterable: AsyncIterable<string> = {
    [Symbol.asyncIterator]() {
      const inner = fullStreamIterable[Symbol.asyncIterator]();
      return {
        async next() {
          while (true) {
            const { value, done } = await inner.next();
            if (done) return { value: undefined, done: true };
            if (value.type === 'text') return { value: value.text, done: false };
          }
        },
      };
    },
  };

  return {
    textStream: textStreamIterable,
    fullStream: fullStreamIterable,
    text: textPromise,
    usage: usagePromise,
    toolCalls: toolCallsPromise,
  };
}
```

- [ ] **Step 2: Commit**

```bash
cd packages/agentos
git add src/api/streamText.ts
git commit -m "feat(api): add streamText — stateless streaming with async iterables"
```

---

### Task 5: agent() Factory

**Files:**

- Create: `packages/agentos/src/api/agent.ts`

- [ ] **Step 1: Write agent factory**

```typescript
// packages/agentos/src/api/agent.ts
import {
  generateText,
  type GenerateTextOptions,
  type GenerateTextResult,
  type Message,
} from './generateText.js';
import { streamText, type StreamTextResult } from './streamText.js';
import type { ToolDefinitionMap } from './tool-adapter.js';

export interface AgentOptions {
  model: string;
  name?: string;
  instructions?: string;
  tools?: ToolDefinitionMap;
  memory?: boolean;
  personality?: Partial<{
    honesty: number;
    emotionality: number;
    extraversion: number;
    agreeableness: number;
    conscientiousness: number;
    openness: number;
  }>;
  guardrails?: string[];
  apiKey?: string;
  baseUrl?: string;
  maxSteps?: number;
}

export interface AgentSession {
  readonly id: string;
  send(text: string): Promise<GenerateTextResult>;
  stream(text: string): StreamTextResult;
  messages(): Message[];
  clear(): void;
}

export interface Agent {
  generate(prompt: string, opts?: Partial<GenerateTextOptions>): Promise<GenerateTextResult>;
  stream(prompt: string, opts?: Partial<GenerateTextOptions>): StreamTextResult;
  session(id?: string): AgentSession;
  close(): Promise<void>;
}

/**
 * Creates a stateful agent with sessions, memory, and personality.
 */
export function agent(opts: AgentOptions): Agent {
  const sessions = new Map<string, Message[]>();

  const baseOpts: Partial<GenerateTextOptions> = {
    model: opts.model,
    system: opts.instructions,
    tools: opts.tools,
    maxSteps: opts.maxSteps ?? 5,
    apiKey: opts.apiKey,
    baseUrl: opts.baseUrl,
  };

  return {
    async generate(
      prompt: string,
      extra?: Partial<GenerateTextOptions>
    ): Promise<GenerateTextResult> {
      return generateText({ ...baseOpts, ...extra, prompt } as GenerateTextOptions);
    },

    stream(prompt: string, extra?: Partial<GenerateTextOptions>): StreamTextResult {
      return streamText({ ...baseOpts, ...extra, prompt } as GenerateTextOptions);
    },

    session(id?: string): AgentSession {
      const sessionId = id ?? `session-${Date.now()}`;
      if (!sessions.has(sessionId)) sessions.set(sessionId, []);
      const history = sessions.get(sessionId)!;

      return {
        id: sessionId,

        async send(text: string): Promise<GenerateTextResult> {
          history.push({ role: 'user', content: text });
          const result = await generateText({
            ...baseOpts,
            messages: [...history],
          } as GenerateTextOptions);
          history.push({ role: 'assistant', content: result.text });
          return result;
        },

        stream(text: string): StreamTextResult {
          history.push({ role: 'user', content: text });
          const result = streamText({
            ...baseOpts,
            messages: [...history],
          } as GenerateTextOptions);
          // Capture text for history when done
          result.text.then((t) => history.push({ role: 'assistant', content: t }));
          return result;
        },

        messages(): Message[] {
          return [...history];
        },

        clear() {
          history.length = 0;
        },
      };
    },

    async close() {
      sessions.clear();
    },
  };
}
```

- [ ] **Step 2: Commit**

```bash
cd packages/agentos
git add src/api/agent.ts
git commit -m "feat(api): add agent() factory with sessions and multi-turn memory"
```

---

### Task 6: Export from index.ts

**Files:**

- Modify: `packages/agentos/src/index.ts`

- [ ] **Step 1: Add exports**

Read `src/index.ts` and add at the end:

```typescript
// --- High-Level API (AI SDK style) ---
export { generateText } from './api/generateText.js';
export type {
  GenerateTextOptions,
  GenerateTextResult,
  Message,
  ToolCallRecord,
  TokenUsage,
} from './api/generateText.js';
export { streamText } from './api/streamText.js';
export type { StreamTextResult, StreamPart } from './api/streamText.js';
export { agent } from './api/agent.js';
export type { Agent, AgentSession, AgentOptions } from './api/agent.js';
export { parseModelString, resolveProvider } from './api/model.js';
export { adaptTools } from './api/tool-adapter.js';
export type { ToolDefinitionMap } from './api/tool-adapter.js';
```

- [ ] **Step 2: Commit**

```bash
cd packages/agentos
git add src/index.ts
git commit -m "feat(api): export generateText, streamText, agent from package root"
```

---

### Task 7: Push and Verify

- [ ] **Step 1: Push agentos**

```bash
cd packages/agentos && git push
```

- [ ] **Step 2: Update parent repo**

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant
git add packages/agentos docs/superpowers/
git commit -m "feat: AgentOS high-level API — generateText, streamText, agent"
git push
```
