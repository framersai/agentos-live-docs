# Interface: BuildLlmCallerOptions

Defined in: [packages/agentos/src/orchestration/planning/buildLlmCaller.ts:26](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planning/buildLlmCaller.ts#L26)

Options for building an LLM caller function.

At minimum, provide `provider` OR `model` (or both).
If neither is provided, auto-detection from env vars kicks in.

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/orchestration/planning/buildLlmCaller.ts:32](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planning/buildLlmCaller.ts#L32)

API key override (not needed for CLI providers).

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/orchestration/planning/buildLlmCaller.ts:34](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planning/buildLlmCaller.ts#L34)

Base URL override (e.g. for OpenRouter, Ollama).

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [packages/agentos/src/orchestration/planning/buildLlmCaller.ts:38](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planning/buildLlmCaller.ts#L38)

Max tokens for planning calls. Default: 4096.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/orchestration/planning/buildLlmCaller.ts:30](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planning/buildLlmCaller.ts#L30)

Model ID: 'gpt-4o', 'claude-opus-4-6', 'gemini-2.5-flash', etc.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/orchestration/planning/buildLlmCaller.ts:28](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planning/buildLlmCaller.ts#L28)

Provider ID: 'openai', 'anthropic', 'claude-code-cli', 'gemini-cli', etc.

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [packages/agentos/src/orchestration/planning/buildLlmCaller.ts:36](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planning/buildLlmCaller.ts#L36)

Temperature for planning calls. Default: 0.3.
