# Interface: GenerateTextOptions

Defined in: [packages/agentos/src/api/generateText.ts:222](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L222)

## Properties

### \_responseFormat?

> `optional` **\_responseFormat**: `Record`\<`string`, `unknown`\> \| \{ `type`: `string`; \}

Defined in: [packages/agentos/src/api/generateText.ts:418](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L418)

**`Internal`**

Used by generateObject and AgentSession.send (with
responseSchema) to forward a provider-specific response_format
payload to the provider. Not part of the public API.

Shape varies by provider: OpenAI accepts json_object or
json_schema, Anthropic uses an internal _agentosUseToolForStructuredOutput
marker that AnthropicProvider routes to forced tool_use, Gemini uses
a _gemini.responseSchema extra. The provider implementations consume
whatever shape is here.

***

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:266](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L266)

Override the API key instead of reading from environment variables.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:268](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L268)

Override the provider base URL (useful for local proxies or Ollama).

***

### chainOfThought?

> `optional` **chainOfThought**: `string` \| `boolean`

Defined in: [packages/agentos/src/api/generateText.ts:280](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L280)

Chain-of-thought instruction prepended to the system prompt when tools
are available.  Encourages the model to reason explicitly before choosing
an action.

- `false` (default): no CoT injection.
- `true`: inject the default CoT instruction.
- `string`: inject a custom CoT instruction.

***

### fallbackProviders?

> `optional` **fallbackProviders**: [`FallbackProviderEntry`](FallbackProviderEntry.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:340](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L340)

Ordered list of fallback providers to try when the primary provider fails
with a retryable error (HTTP 402/429/5xx, network errors, auth failures).

**Default behavior (omit / `undefined`):** auto-build the canonical
fallback chain for the primary provider via [buildFallbackChain](../functions/buildFallbackChain.md),
filtered to providers that have API keys present in the environment.
No import needed: fallback is on by default.

**Strict mode (`[]`):** explicitly opt out of fallback. The primary
provider's error is re-thrown after exhausting any provider-internal
retries. Use this when billing isolation, capability auditing, or
provider-pinned testing requires a single-provider guarantee.

**Custom chain (array of entries):** specify exactly which providers
(and optional model overrides) to try, in order. Each entry's model
defaults to the provider's text-generation default from
[PROVIDER\_DEFAULTS](../variables/PROVIDER_DEFAULTS.md) when omitted. Providers are tried
left-to-right; the first successful response wins.

#### Examples

```ts
const result = await generateText({
  provider: 'anthropic',
  prompt: 'Hello',
});
// On retryable Anthropic failure, walks anthropic -> openai -> gemini -> ...
```

```ts
const result = await generateText({
  provider: 'anthropic',
  prompt: 'Hello',
  fallbackProviders: [],
});
```

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

### hostPolicy?

> `optional` **hostPolicy**: [`HostLLMPolicy`](HostLLMPolicy.md)

Defined in: [packages/agentos/src/api/generateText.ts:365](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L365)

Host-level routing hints that can be forwarded into the model router
without requiring callers to construct raw router params directly.

***

### maxSteps?

> `optional` **maxSteps**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:260](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L260)

Maximum number of agentic steps (LLM calls) to execute before returning.
Each tool-call round trip counts as one step. Defaults to `1`.

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:264](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L264)

Hard cap on output tokens. Provider-dependent default applies when omitted.

***

### messages?

> `optional` **messages**: [`Message`](Message.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:243](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L243)

Full conversation history. Appended before `prompt` when both are supplied.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:237](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L237)

Model identifier.  Accepted in two formats:
- Plain model name (e.g. `"gpt-4o"`) when `provider` is also set. Preferred.
- `"provider:model"` combined string (e.g. `"openai:gpt-4o"`).

Either `provider` or `model` (or an API key env var for auto-detection) is required.

***

### onAfterGeneration()?

> `optional` **onAfterGeneration**: (`result`) => `Promise`\<`void` \| [`GenerationHookResult`](GenerationHookResult.md)\>

Defined in: [packages/agentos/src/api/generateText.ts:401](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L401)

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

Defined in: [packages/agentos/src/api/generateText.ts:395](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L395)

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

Defined in: [packages/agentos/src/api/generateText.ts:406](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L406)

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

Defined in: [packages/agentos/src/api/generateText.ts:348](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L348)

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

Defined in: [packages/agentos/src/api/generateText.ts:289](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L289)

Enable plan-then-execute mode.  When `true` (or a PlanningConfig),
an upfront LLM call decomposes the task into numbered steps before the
tool-calling loop begins.  The plan is injected into the system prompt
so the model executes with full awareness of the strategy.

Set to `false` or omit to skip planning entirely (the default).

***

### policyTier?

> `optional` **policyTier**: `"safe"` \| `"standard"` \| `"mature"` \| `"private-adult"`

Defined in: [packages/agentos/src/api/generateText.ts:389](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L389)

Caller's intended content policy tier. When set to `'mature'` or
`'private-adult'` AND no explicit `fallbackProviders` was supplied,
the auto-built fallback chain is constructed via
[buildPolicyAwareFallbackChain](../functions/buildPolicyAwareFallbackChain.md) instead of the default
availability chain: prepending an uncensored OpenRouter model
(Hermes 3 405B) so a content-policy refusal from the primary
(gpt-4o, Claude, etc.) re-routes to a model that can complete
the request rather than hard-failing.

Combined with the [isContentPolicyRefusal](../functions/isContentPolicyRefusal.md) branch in
[isRetryableError](../functions/isRetryableError.md), this also makes the existing fallback
loop fire on OpenAI's 400 + `code: 'content_policy_violation'`
: which the network-only retryable matrix would otherwise treat
as a hard error.

Has no effect for `safe`/`standard` tiers (or when omitted):
those keep the existing availability-only fallback behavior.

Mirrors the existing `policyTier` parameter on
import('./generateImage.js').GenerateImageOptions and
import('./editImage.js').EditImageOptions.

***

### prompt?

> `optional` **prompt**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:239](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L239)

Single user turn to append after any `messages`. Convenience alternative to building a `messages` array.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:229](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L229)

Provider name.  When supplied without `model`, the default text model for
the provider is resolved automatically from the built-in defaults registry.

#### Example

```ts
`"openai"`, `"anthropic"`, `"ollama"`
```

***

### router?

> `optional` **router**: [`IModelRouter`](IModelRouter.md)

Defined in: [packages/agentos/src/api/generateText.ts:355](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L355)

Optional model router for intelligent provider/model selection.
When provided, the router's `selectModel()` is called before provider
resolution.  The router result overrides `model`/`provider`.
If the router returns `null`, falls back to standard resolution.

***

### routerParams?

> `optional` **routerParams**: `Partial`\<[`ModelRouteParams`](ModelRouteParams.md)\>

Defined in: [packages/agentos/src/api/generateText.ts:360](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L360)

Routing hints passed to the model router.  Extracted automatically
from system prompt and tool names when not provided.

***

### system?

> `optional` **system**: `string` \| [`SystemContentBlock`](SystemContentBlock.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:241](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L241)

System prompt injected as the first message. Accepts a plain string or structured blocks with cache breakpoints.

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:262](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L262)

Sampling temperature forwarded to the provider (0-2 for most providers).

***

### tools?

> `optional` **tools**: [`AdaptableToolInput`](../type-aliases/AdaptableToolInput.md)

Defined in: [packages/agentos/src/api/generateText.ts:255](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L255)

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

Defined in: [packages/agentos/src/api/generateText.ts:270](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L270)

Optional durable usage ledger configuration for helper-level accounting.
