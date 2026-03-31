# Function: buildLlmCaller()

> **buildLlmCaller**(`options?`): `Promise`\<(`system`, `user`) => `Promise`\<`string`\>\>

Defined in: [packages/agentos/src/orchestration/planning/buildLlmCaller.ts:60](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planning/buildLlmCaller.ts#L60)

Build an `llmCaller` function for any AgentOS-supported provider.

This uses the full provider resolution chain:
  resolveModelOption → resolveProvider → createProviderManager → getProvider

Works with all provider types:
- API providers (openai, anthropic, groq, together, mistral, xai, openrouter)
- CLI providers (claude-code-cli, gemini-cli) — no API key needed
- Local providers (ollama) — requires OLLAMA_BASE_URL

The returned function has the signature `(system: string, user: string) => Promise<string>`.

## Parameters

### options?

[`BuildLlmCallerOptions`](../interfaces/BuildLlmCallerOptions.md) = `{}`

Provider, model, and optional credential overrides.

## Returns

`Promise`\<(`system`, `user`) => `Promise`\<`string`\>\>

A caller function compatible with `PlannerConfig.llmCaller`.
