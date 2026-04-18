---
title: "LLM Output Validation"
sidebar_position: 1.5
---

> Zod-based validation, retry with error feedback, centralized JSON extraction, and provider-native structured output — a shared utility layer that eliminates silent parse failures from every LLM call site.

---

## Overview

Every AgentOS component that calls an LLM and expects structured output needs to parse JSON from messy LLM responses. The validation layer centralizes this with:

- **`extractJson()`** — handles markdown fences, `<thinking>` blocks, JSONL, embedded JSON
- **`createValidatedInvoker()`** — wraps any LLM invoker with Zod validation + retry
- **Schema primitives** — reusable Zod building blocks for common LLM output shapes
- **`agent()` responseSchema** — automatic validation on the agent factory
- **`LlmOutputValidationError`** — detailed error with raw output, Zod errors, and retry history

## `extractJson` — Centralized JSON Extraction

Handles all messy LLM output formats in a single call:

```typescript
import { extractJson } from '@framers/agentos/core/validation';

extractJson('{"a": 1}');                                // '{"a": 1}'
extractJson('```json\n{"a": 1}\n```');                  // '{"a": 1}'
extractJson('<thinking>hmm</thinking>\n{"a": 1}');      // '{"a": 1}'
extractJson('Result: {"a": 1} done');                   // '{"a": 1}'
extractJson('{"a":1}\n{"b":2}');                        // '[{"a":1},{"b":2}]' (JSONL)
extractJson('just plain text');                          // null
```

**Extraction strategies (priority order):**
1. Raw JSON — entire string is valid JSON
2. Markdown fenced blocks — ` ```json ... ``` `
3. `<thinking>` block stripping — remove chain-of-thought, parse remainder
4. JSONL — multiple JSON objects on separate lines → array
5. Brace/bracket matching — first `{...}` or `[...]` in prose

## `createValidatedInvoker` — Validated LLM Wrapper

Wraps any `(systemPrompt, userPrompt) => Promise<string>` invoker with Zod validation:

```typescript
import { createValidatedInvoker } from '@framers/agentos/core/validation';
import { z } from 'zod';

const PersonalitySchema = z.object({
  honesty: z.number().min(0).max(100),
  emotionality: z.number().min(0).max(100),
  extraversion: z.number().min(0).max(100),
});

const validated = createValidatedInvoker(llmInvoker, PersonalitySchema, {
  maxRetries: 2,              // retry with error feedback (default: 1)
  injectSchemaOnRetry: true,  // include schema in retry prompt (default: true)
});

const personality = await validated(systemPrompt, userPrompt);
// personality is typed as { honesty: number; emotionality: number; extraversion: number }
```

**Pipeline:**
1. Call LLM via the raw invoker
2. Extract JSON via `extractJson()`
3. Validate with Zod `.safeParse()` (applies defaults, type coercion)
4. If valid: return typed result
5. If invalid: retry with error feedback + schema description
6. If all retries fail: throw `LlmOutputValidationError`

**Retry prompt injection:** On failure, the system prompt is augmented with:
- The specific error ("Zod validation: value.path: Required")
- The expected JSON schema (auto-generated from the Zod schema)
- An instruction to output ONLY valid JSON

## `agent()` responseSchema

The `agent()` factory accepts an optional `responseSchema` for automatic validation:

```typescript
import { agent } from '@framers/agentos';
import { z } from 'zod';

const extractor = agent({
  instructions: 'Extract entities from text as JSON.',
  responseSchema: z.object({
    entities: z.array(z.string()),
    confidence: z.number().min(0).max(1),
  }),
});

const result = await extractor.generate('Find entities in: The cat sat on the mat.');
// result.parsed?.entities is string[] — Zod-validated and typed
// result.text is the raw LLM output for logging
```

When `responseSchema` is omitted, behavior is unchanged — no validation, `result.parsed` is undefined. Zero breaking changes.

## Schema Primitives

Reusable Zod building blocks for common fields:

```typescript
import {
  MemoryTypeEnum,       // 'episodic' | 'semantic' | 'procedural' | 'prospective' | 'relational'
  MemoryScopeEnum,      // 'user' | 'thread' | 'persona' | 'organization'
  ConfidenceScore,      // z.number().min(0).max(1)
  EntityArray,          // z.array(z.string()).default([])
  TagArray,             // z.array(z.string()).default([])
  ImportanceScore,      // z.number().min(0).max(1).default(0.5)
  ObservationNoteOutput, // Full schema for observer notes
  ReflectionTraceOutput, // Full schema for reflector traces
  ContentFeaturesOutput, // Full schema for content feature detection
} from '@framers/agentos/core/validation';
```

Compose domain-specific schemas from primitives:

```typescript
const MyOutputSchema = z.object({
  type: MemoryTypeEnum,
  confidence: ConfidenceScore,
  entities: EntityArray,
  customField: z.string(),
});
```

## Error Handling

When validation fails after all retries, `LlmOutputValidationError` is thrown:

```typescript
import { LlmOutputValidationError } from '@framers/agentos/core/validation';

try {
  const result = await validatedInvoker(system, user);
} catch (err) {
  if (err instanceof LlmOutputValidationError) {
    console.error('Raw output:', err.rawOutput);
    console.error('Zod errors:', err.zodErrors);
    console.error('Retry count:', err.retryCount);
    console.error('History:', err.retryHistory);
    // retryHistory: [{ attempt: 0, rawOutput: '...', error: '...' }, ...]
  }
}
```

## Provider-Native Structured Output

When the LLM invoker has `supportsStructuredOutput: true` (Anthropic tool_use, OpenAI json_schema), the wrapper converts the Zod schema to JSON Schema and uses the provider's native enforcement. No retries needed — the provider guarantees valid JSON.

All other providers (Ollama, OpenRouter, Groq) get the retry-with-schema fallback automatically.
