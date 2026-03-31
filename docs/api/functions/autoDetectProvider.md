# Function: autoDetectProvider()

> **autoDetectProvider**(`task?`): `string` \| `undefined`

Defined in: [packages/agentos/src/api/runtime/provider-defaults.ts:141](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/provider-defaults.ts#L141)

Auto-detects the active provider by scanning well-known environment variables
and CLI binaries in priority order.

Returns the identifier of the first provider whose key/URL env var is non-empty
or whose CLI binary is on PATH, or `undefined` when no recognisable runtime is present.

Priority: openrouter → openai → anthropic → gemini → claude-code-cli → gemini-cli → ollama → …

## Parameters

### task?

`ProviderDefaultTask`

## Returns

`string` \| `undefined`
