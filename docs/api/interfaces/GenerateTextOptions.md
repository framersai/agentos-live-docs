# Interface: GenerateTextOptions

Defined in: [packages/agentos/src/api/generateText.ts:131](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L131)

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:175](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L175)

Override the API key instead of reading from environment variables.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:177](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L177)

Override the provider base URL (useful for local proxies or Ollama).

***

### chainOfThought?

> `optional` **chainOfThought**: `string` \| `boolean`

Defined in: [packages/agentos/src/api/generateText.ts:189](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L189)

Chain-of-thought instruction prepended to the system prompt when tools
are available.  Encourages the model to reason explicitly before choosing
an action.

- `false` (default) — no CoT injection.
- `true` — inject the default CoT instruction.
- `string` — inject a custom CoT instruction.

***

### fallbackProviders?

> `optional` **fallbackProviders**: [`FallbackProviderEntry`](FallbackProviderEntry.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:222](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L222)

Ordered list of fallback providers to try when the primary provider fails
with a retryable error (HTTP 402/429/5xx, network errors, auth failures).

Each entry specifies a provider and an optional model override.  When the
model is omitted, the provider's default text model (from
[PROVIDER\_DEFAULTS](../variables/PROVIDER_DEFAULTS.md)) is used.

Providers are tried left-to-right; the first successful response wins.
When all fallbacks are exhausted, the last error is re-thrown.

#### Example

```ts
const result = await generateText({
  provider: 'anthropic',
  prompt: 'Hello',
  fallbackProviders: [
    { provider: 'openai', model: 'gpt-4o-mini' },
    { provider: 'openrouter' },
  ],
});
```

***

### maxSteps?

> `optional` **maxSteps**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:169](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L169)

Maximum number of agentic steps (LLM calls) to execute before returning.
Each tool-call round trip counts as one step. Defaults to `1`.

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:173](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L173)

Hard cap on output tokens. Provider-dependent default applies when omitted.

***

### messages?

> `optional` **messages**: [`Message`](Message.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:152](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L152)

Full conversation history. Appended before `prompt` when both are supplied.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:146](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L146)

Model identifier.  Accepted in two formats:
- `"provider:model"` — legacy format (e.g. `"openai:gpt-4o"`), still fully supported.
- Plain model name (e.g. `"gpt-4o-mini"`) when `provider` is also set.

Either `provider` or `model` (or an API key env var for auto-detection) is required.

***

### onAfterGeneration()?

> `optional` **onAfterGeneration**: (`result`) => `Promise`\<`void` \| [`GenerationHookResult`](GenerationHookResult.md)\>

Defined in: [packages/agentos/src/api/generateText.ts:254](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L254)

Called after each LLM generation step.  Can check output against
guardrails, redact PII, or transform the response.
Return a modified result to transform output, or void to pass through.

#### Parameters

##### result

[`GenerationHookResult`](GenerationHookResult.md)

#### Returns

`Promise`\<`void` \| [`GenerationHookResult`](GenerationHookResult.md)\>

***

### onBeforeGeneration()?

> `optional` **onBeforeGeneration**: (`context`) => `Promise`\<`void` \| [`GenerationHookContext`](GenerationHookContext.md)\>

Defined in: [packages/agentos/src/api/generateText.ts:248](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L248)

Called before each LLM generation step.  Can inject memory context
into messages, sanitize input via guardrails, or modify the prompt.
Return a modified context to transform input, or void to pass through.

#### Parameters

##### context

[`GenerationHookContext`](GenerationHookContext.md)

#### Returns

`Promise`\<`void` \| [`GenerationHookContext`](GenerationHookContext.md)\>

***

### onBeforeToolExecution()?

> `optional` **onBeforeToolExecution**: (`info`) => `Promise`\<[`ToolCallHookInfo`](ToolCallHookInfo.md) \| `null`\>

Defined in: [packages/agentos/src/api/generateText.ts:259](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L259)

Called before each tool execution.  Can modify arguments, apply
permission checks, or return `null` to skip the tool call entirely.

#### Parameters

##### info

[`ToolCallHookInfo`](ToolCallHookInfo.md)

#### Returns

`Promise`\<[`ToolCallHookInfo`](ToolCallHookInfo.md) \| `null`\>

***

### onFallback()?

> `optional` **onFallback**: (`error`, `fallbackProvider`) => `void`

Defined in: [packages/agentos/src/api/generateText.ts:230](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L230)

Callback invoked when a fallback provider is about to be tried after the
primary (or a previous fallback) failed.  Useful for logging or metrics.

#### Parameters

##### error

`Error`

The error that triggered the fallback.

##### fallbackProvider

`string`

The provider identifier being tried next.

#### Returns

`void`

***

### planning?

> `optional` **planning**: `boolean` \| `PlanningConfig`

Defined in: [packages/agentos/src/api/generateText.ts:198](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L198)

Enable plan-then-execute mode.  When `true` (or a PlanningConfig),
an upfront LLM call decomposes the task into numbered steps before the
tool-calling loop begins.  The plan is injected into the system prompt
so the model executes with full awareness of the strategy.

Set to `false` or omit to skip planning entirely (the default).

***

### prompt?

> `optional` **prompt**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:148](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L148)

Single user turn to append after any `messages`. Convenience alternative to building a `messages` array.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:138](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L138)

Provider name.  When supplied without `model`, the default text model for
the provider is resolved automatically from the built-in defaults registry.

#### Example

```ts
`"openai"`, `"anthropic"`, `"ollama"`
```

***

### router?

> `optional` **router**: [`IModelRouter`](IModelRouter.md)

Defined in: [packages/agentos/src/api/generateText.ts:237](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L237)

Optional model router for intelligent provider/model selection.
When provided, the router's `selectModel()` is called before provider
resolution.  The router result overrides `model`/`provider`.
If the router returns `null`, falls back to standard resolution.

***

### routerParams?

> `optional` **routerParams**: `Partial`\<[`ModelRouteParams`](ModelRouteParams.md)\>

Defined in: [packages/agentos/src/api/generateText.ts:242](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L242)

Routing hints passed to the model router.  Extracted automatically
from system prompt and tool names when not provided.

***

### system?

> `optional` **system**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:150](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L150)

System prompt injected as the first message.

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:171](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L171)

Sampling temperature forwarded to the provider (0–2 for most providers).

***

### tools?

> `optional` **tools**: [`AdaptableToolInput`](../type-aliases/AdaptableToolInput.md)

Defined in: [packages/agentos/src/api/generateText.ts:164](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L164)

Tools the model may invoke.

Accepted forms:
- named high-level tool maps
- external tool registries (`Record`, `Map`, or iterable)
- prompt-only `ToolDefinitionForLLM[]`

Prompt-only definitions are visible to the model but return an explicit
tool error if the model invokes them without an executor.

***

### usageLedger?

> `optional` **usageLedger**: [`AgentOSUsageLedgerOptions`](AgentOSUsageLedgerOptions.md)

Defined in: [packages/agentos/src/api/generateText.ts:179](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L179)

Optional durable usage ledger configuration for helper-level accounting.
