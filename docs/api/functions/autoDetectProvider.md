# Function: autoDetectProvider()

> **autoDetectProvider**(`task?`): `string` \| `undefined`

Defined in: [packages/agentos/src/api/runtime/provider-defaults.ts:171](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/runtime/provider-defaults.ts#L171)

Auto-detects the active provider by scanning well-known environment variables
and CLI binaries in priority order.

Returns the identifier of the first provider whose key/URL env var is non-empty
or whose CLI binary is on PATH, or `undefined` when no recognisable runtime is present.

Default priority: openrouter → openai → anthropic → gemini → claude-code-cli → gemini-cli → ollama → …

The order can be overridden process-wide via `setProviderPriority(['anthropic', 'openai', ...])`.
When a custom list is installed, only the providers in that list are
considered (in the order given); pass the full set you want detection
to consider.

## Parameters

### task?

`ProviderDefaultTask`

## Returns

`string` \| `undefined`
