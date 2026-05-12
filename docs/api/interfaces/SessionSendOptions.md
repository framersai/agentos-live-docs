# Interface: SessionSendOptions\<S\>

Defined in: [packages/agentos/src/api/agent.ts:209](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L209)

Options for a single [AgentSession.send](AgentSession.md#send) call.

## Type Parameters

### S

`S` *extends* [`ZodType`](../@framers/namespaces/z/interfaces/ZodType-1.md) \| `undefined` = `undefined`

## Properties

### responseSchema?

> `optional` **responseSchema**: `S`

Defined in: [packages/agentos/src/api/agent.ts:222](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L222)

Zod schema describing the expected shape of the assistant reply. When
present, agentos converts the schema to JSON Schema, routes through
the provider's native structured-output API (OpenAI json_schema,
Anthropic forced tool-use, Gemini responseSchema), and returns a
Zod-validated typed object on `result.object` alongside the JSON
string in `result.text`.

Tools (caller-provided in baseOpts.tools) are still passed through;
the structured-output mode adds its own forced tool on Anthropic
but the existing tool definitions remain in the payload.

***

### schemaName?

> `optional` **schemaName**: `string`

Defined in: [packages/agentos/src/api/agent.ts:228](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L228)

Display name for the schema in provider payloads. Surfaces in OpenAI's
json_schema.name and Anthropic's tool name. Defaults to 'response'.
Sanitized to /[a-zA-Z0-9_]/ and truncated to 64 chars.
