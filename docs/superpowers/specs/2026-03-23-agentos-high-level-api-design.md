# AgentOS High-Level API

## Goal

Add `generateText`, `streamText`, and `agent` as top-level exports from `@framers/agentos` — matching the ergonomics of Vercel AI SDK and Mastra while coexisting with the existing `AgentOS` class. No breaking changes.

## Architecture

New files in `src/api/` alongside the existing `AgentOS.ts`. A `model.ts` parser resolves `'openai:gpt-4o'` strings to provider configs with env-based API key auto-detection. A `tool-adapter.ts` normalizes Zod schemas, JSON Schema objects, and existing `ITool` instances into a common format. `generateText` and `streamText` are stateless functions. `agent()` is a factory that returns a stateful object with sessions, memory, personality, and guardrails.

## Tier 1: generateText / streamText

```typescript
import { generateText, streamText } from '@framers/agentos';

// Simple
const { text, usage } = await generateText({
  model: 'openai:gpt-4o',
  prompt: 'What is RAG?',
});

// System prompt + messages
const { text } = await generateText({
  model: 'anthropic:claude-sonnet-4-5-20250929',
  system: 'You are a senior engineer.',
  messages: [{ role: 'user', content: 'Explain circuit breakers.' }],
});

// Streaming
const result = streamText({
  model: 'openai:gpt-4o-mini',
  prompt: 'Write a haiku about AI agents',
});
for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
const finalText = await result.text;

// Tools with multi-step execution
const { text, toolCalls } = await generateText({
  model: 'openai:gpt-4o',
  prompt: 'Search for AI news today',
  tools: {
    newsSearch: {
      description: 'Search recent news',
      parameters: z.object({ query: z.string() }),
      execute: async ({ query }) => fetchNews(query),
    },
  },
  maxSteps: 5,
});
```

### GenerateTextOptions

```typescript
interface GenerateTextOptions {
  model: string; // 'provider:model' format
  prompt?: string; // Single-turn shorthand
  system?: string; // System instruction
  messages?: Message[]; // Multi-turn messages
  tools?: ToolDefinitionMap; // Zod, JSON Schema, or ITool
  maxSteps?: number; // Max tool-calling rounds (default: 1)
  temperature?: number;
  maxTokens?: number;
  apiKey?: string; // Override env auto-detection
  baseUrl?: string; // Override provider base URL
  guardrails?: string[]; // Guardrail IDs to apply
}
```

### GenerateTextResult

```typescript
interface GenerateTextResult {
  text: string;
  usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  toolCalls: ToolCallRecord[];
  finishReason: 'stop' | 'length' | 'tool-calls';
}
```

### StreamTextResult

```typescript
interface StreamTextResult {
  textStream: AsyncIterable<string>;
  fullStream: AsyncIterable<StreamPart>;
  text: Promise<string>;
  usage: Promise<TokenUsage>;
  toolCalls: Promise<ToolCallRecord[]>;
}

type StreamPart =
  | { type: 'text'; text: string }
  | { type: 'tool-call'; toolName: string; args: unknown }
  | { type: 'tool-result'; toolName: string; result: unknown }
  | { type: 'error'; error: Error };
```

## Tier 2: agent()

```typescript
import { agent } from '@framers/agentos';

const researcher = agent({
  model: 'openai:gpt-4o',
  name: 'Researcher',
  instructions: 'You are a thorough research assistant.',
  tools: { webSearch, newsSearch },
  memory: true,
  personality: { openness: 0.9, conscientiousness: 0.8 },
  guardrails: ['pii-redaction'],
});

// One-shot (stateless)
const { text } = await researcher.generate('Compare AI frameworks');

// Streaming (stateless)
for await (const chunk of researcher.stream('Explain RAG')) {
  process.stdout.write(chunk.text);
}

// Session (persistent memory across turns)
const session = researcher.session('user-123');
await session.send('My name is Johnny');
const { text } = await session.send('What is my name?'); // "Johnny"
const history = session.messages();
```

### AgentOptions

```typescript
interface AgentOptions {
  model: string; // 'provider:model'
  name?: string;
  instructions?: string; // System prompt
  tools?: ToolDefinitionMap;
  memory?: boolean | MemoryConfig; // true = auto-configure
  personality?: Partial<HexacoTraits>;
  guardrails?: string[];
  apiKey?: string;
  baseUrl?: string;
  maxSteps?: number; // Default for all generate/stream calls
}
```

### Agent interface

```typescript
interface Agent {
  generate(prompt: string, opts?: Partial<GenerateTextOptions>): Promise<GenerateTextResult>;
  stream(prompt: string, opts?: Partial<GenerateTextOptions>): StreamTextResult;
  session(id?: string): AgentSession;
  close(): Promise<void>;
}

interface AgentSession {
  readonly id: string;
  send(text: string): Promise<GenerateTextResult>;
  stream(text: string): StreamTextResult;
  messages(): Message[];
  clear(): void;
}
```

## Tier 3: AgentOS (unchanged)

```typescript
import { AgentOS } from '@framers/agentos';
// Existing API — no changes
```

## Model String Parsing

`src/api/model.ts` — parses `'provider:model'` and resolves API key from env:

| String                                              | Provider   | Env Var              |
| --------------------------------------------------- | ---------- | -------------------- |
| `'openai:gpt-4o'`                                   | openai     | `OPENAI_API_KEY`     |
| `'anthropic:claude-sonnet-4-5-20250929'`            | anthropic  | `ANTHROPIC_API_KEY`  |
| `'ollama:llama3.2'`                                 | ollama     | `OLLAMA_BASE_URL`    |
| `'openrouter:anthropic/claude-sonnet-4-5-20250929'` | openrouter | `OPENROUTER_API_KEY` |
| `'gemini:gemini-2.5-flash'`                         | gemini     | `GEMINI_API_KEY`     |

Override: `{ model: 'openai:gpt-4o', apiKey: 'sk-...' }`

## Tool Adapter

`src/api/tool-adapter.ts` — normalizes three input formats to `ITool`:

```typescript
// Zod style (AI SDK compatible)
{ description: '...', parameters: z.object({...}), execute: async (args) => ... }

// JSON Schema style
{ description: '...', parameters: { type: 'object', properties: {...} }, execute: async (args) => ... }

// Existing ITool (pass-through)
existingIToolInstance
```

Detection: if `parameters` has a `_def` property → Zod schema, convert via `zodToJsonSchema()`. If `parameters` has `type: 'object'` → JSON Schema. If object has `inputSchema` → ITool pass-through.

## Internal Flow

`generateText` and `streamText` internally:

1. Parse model string via `resolveModel()`
2. Adapt tools via `adaptTools()`
3. Create a temporary `AgentOSOrchestrator` (or use the LLM provider directly for simple cases)
4. Run `processRequest()` and collect/stream results
5. Return typed result

`agent()` internally:

1. Same model + tool resolution
2. Creates a persistent `AgentOS` instance with memory, personality, guardrails
3. `session()` creates a `ConversationContext` with the agent's memory system
4. `generate()`/`stream()` delegate to `processRequest()` with a one-off session

## Files

| Action | File                             | Responsibility                            |
| ------ | -------------------------------- | ----------------------------------------- |
| Create | `src/api/generateText.ts`        | Stateless text generation                 |
| Create | `src/api/streamText.ts`          | Stateless streaming                       |
| Create | `src/api/agent.ts`               | Agent factory with sessions/memory        |
| Create | `src/api/model.ts`               | Model string parsing + env key resolution |
| Create | `src/api/tool-adapter.ts`        | Zod/JSON Schema/ITool normalization       |
| Modify | `src/index.ts`                   | Export generateText, streamText, agent    |
| Create | `tests/api/generateText.spec.ts` | Unit tests                                |
| Create | `tests/api/streamText.spec.ts`   | Unit tests                                |
| Create | `tests/api/agent.spec.ts`        | Unit tests                                |
| Create | `tests/api/model.spec.ts`        | Model string parsing tests                |

## Error Handling

- Invalid model string → `AgentOSError('Invalid model "foo". Expected "provider:model" (e.g. "openai:gpt-4o").')`
- Missing API key → `AgentOSError('No API key for openai. Set OPENAI_API_KEY or pass apiKey.')`
- Tool failure → included in `toolCalls[].error`, doesn't throw
- Guardrail block → `GenerateTextResult.text` is empty, `finishReason: 'blocked'`

## Testing

- Model parser: all provider strings, invalid formats, env override
- Tool adapter: Zod, JSON Schema, ITool pass-through
- generateText: mock LLM provider, verify result shape
- streamText: mock provider, verify async iterable behavior
- agent: session memory, multi-turn recall
- Integration: real OpenAI call (gated behind env var)
