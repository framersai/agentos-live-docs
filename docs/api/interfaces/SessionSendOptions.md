# Interface: SessionSendOptions\<S\>

Defined in: [packages/agentos/src/api/agent.ts:244](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L244)

Options for a single [AgentSession.send](AgentSession.md#send) call.

## Type Parameters

### S

`S` *extends* [`ZodType`](../@framers/namespaces/z/interfaces/ZodType-1.md) \| `undefined` = `undefined`

## Properties

### responseSchema?

> `optional` **responseSchema**: `S`

Defined in: [packages/agentos/src/api/agent.ts:257](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L257)

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

Defined in: [packages/agentos/src/api/agent.ts:263](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L263)

Display name for the schema in provider payloads. Surfaces in OpenAI's
json_schema.name and Anthropic's tool name. Defaults to 'response'.
Sanitized to /[a-zA-Z0-9_]/ and truncated to 64 chars.
