# Interface: GenerateTextOptions

Defined in: [packages/agentos/src/api/generateText.ts:194](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L194)

## Properties

### \_responseFormat?

> `optional` **\_responseFormat**: `object`

Defined in: [packages/agentos/src/api/generateText.ts:327](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L327)

**`Internal`**

Used by generateObject to forward response_format to the provider.
Not part of the public API. Use generateObject for structured output.

#### type

> **type**: `string`

***

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:238](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L238)

Override the API key instead of reading from environment variables.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:240](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L240)

Override the provider base URL (useful for local proxies or Ollama).

***

### chainOfThought?

> `optional` **chainOfThought**: `string` \| `boolean`

Defined in: [packages/agentos/src/api/generateText.ts:252](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L252)

Chain-of-thought instruction prepended to the system prompt when tools
are available.  Encourages the model to reason explicitly before choosing
an action.

- `false` (default) — no CoT injection.
- `true` — inject the default CoT instruction.
- `string` — inject a custom CoT instruction.

***

### fallbackProviders?

> `optional` **fallbackProviders**: [`FallbackProviderEntry`](FallbackProviderEntry.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:285](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L285)

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

Defined in: [packages/agentos/src/api/generateText.ts:232](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L232)

Maximum number of agentic steps (LLM calls) to execute before returning.
Each tool-call round trip counts as one step. Defaults to `1`.

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:236](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L236)

Hard cap on output tokens. Provider-dependent default applies when omitted.

***

### messages?

> `optional` **messages**: [`Message`](Message.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:215](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L215)

Full conversation history. Appended before `prompt` when both are supplied.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:209](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L209)

Model identifier.  Accepted in two formats:
- `"provider:model"` — legacy format (e.g. `"openai:gpt-4o"`), still fully supported.
- Plain model name (e.g. `"gpt-4o-mini"`) when `provider` is also set.

Either `provider` or `model` (or an API key env var for auto-detection) is required.

***

### onAfterGeneration()?

> `optional` **onAfterGeneration**: (`result`) => `Promise`\<`void` \| [`GenerationHookResult`](GenerationHookResult.md)\>

Defined in: [packages/agentos/src/api/generateText.ts:317](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L317)

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

Defined in: [packages/agentos/src/api/generateText.ts:311](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L311)

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

Defined in: [packages/agentos/src/api/generateText.ts:322](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L322)

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

Defined in: [packages/agentos/src/api/generateText.ts:293](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L293)

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

Defined in: [packages/agentos/src/api/generateText.ts:261](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L261)

Enable plan-then-execute mode.  When `true` (or a PlanningConfig),
an upfront LLM call decomposes the task into numbered steps before the
tool-calling loop begins.  The plan is injected into the system prompt
so the model executes with full awareness of the strategy.

Set to `false` or omit to skip planning entirely (the default).

***

### prompt?

> `optional` **prompt**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:211](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L211)

Single user turn to append after any `messages`. Convenience alternative to building a `messages` array.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:201](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L201)

Provider name.  When supplied without `model`, the default text model for
the provider is resolved automatically from the built-in defaults registry.

#### Example

```ts
`"openai"`, `"anthropic"`, `"ollama"`
```

***

### router?

> `optional` **router**: [`IModelRouter`](IModelRouter.md)

Defined in: [packages/agentos/src/api/generateText.ts:300](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L300)

Optional model router for intelligent provider/model selection.
When provided, the router's `selectModel()` is called before provider
resolution.  The router result overrides `model`/`provider`.
If the router returns `null`, falls back to standard resolution.

***

### routerParams?

> `optional` **routerParams**: `Partial`\<[`ModelRouteParams`](ModelRouteParams.md)\>

Defined in: [packages/agentos/src/api/generateText.ts:305](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L305)

Routing hints passed to the model router.  Extracted automatically
from system prompt and tool names when not provided.

***

### system?

> `optional` **system**: `string` \| [`SystemContentBlock`](SystemContentBlock.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:213](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L213)

System prompt injected as the first message. Accepts a plain string or structured blocks with cache breakpoints.

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:234](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L234)

Sampling temperature forwarded to the provider (0–2 for most providers).

***

### tools?

> `optional` **tools**: [`AdaptableToolInput`](../type-aliases/AdaptableToolInput.md)

Defined in: [packages/agentos/src/api/generateText.ts:227](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L227)

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

Defined in: [packages/agentos/src/api/generateText.ts:242](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L242)

Optional durable usage ledger configuration for helper-level accounting.
