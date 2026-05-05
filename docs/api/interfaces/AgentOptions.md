# Interface: AgentOptions

Defined in: [packages/agentos/src/api/agent.ts:96](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L96)

Configuration options for the [agent](../functions/agent.md) factory function.

Extends `BaseAgentConfig` with backward-compatible convenience fields.
All `BaseAgentConfig` fields (rag, discovery, permissions, emergent, voice,
etc.) are accepted and stored in config but are not actively wired in the
lightweight agent — they will be consumed by `agency()` and the full runtime.

## Extends

- `BaseAgentConfig`

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/types.ts:1240](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1240)

Override the provider API key instead of reading from environment variables.

#### Inherited from

`BaseAgentConfig.apiKey`

***

### avatar?

> `optional` **avatar**: `AvatarConfig`

Defined in: [packages/agentos/src/api/types.ts:1306](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1306)

Avatar visual presentation configuration.

#### Inherited from

`BaseAgentConfig.avatar`

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/types.ts:1242](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1242)

Override the provider base URL (useful for local proxies or Ollama).

#### Inherited from

`BaseAgentConfig.baseUrl`

***

### chainOfThought?

> `optional` **chainOfThought**: `string` \| `boolean`

Defined in: [packages/agentos/src/api/agent.ts:108](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L108)

Chain-of-thought reasoning instruction.
- `false` — disable CoT injection.
- `true` (default for agents) — inject the default CoT instruction when tools are present.
- `string` — inject a custom CoT instruction when tools are present.

***

### channels?

> `optional` **channels**: `Record`\<`string`, `Record`\<`string`, `unknown`\>\>

Defined in: [packages/agentos/src/api/types.ts:1311](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1311)

Channel adapter configurations keyed by channel name.
Values are channel-specific option objects passed through opaquely.

#### Inherited from

`BaseAgentConfig.channels`

***

### cognitiveMechanisms?

> `optional` **cognitiveMechanisms**: [`CognitiveMechanismsConfig`](CognitiveMechanismsConfig.md)

Defined in: [packages/agentos/src/api/types.ts:1348](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1348)

Cognitive mechanisms config — 8 neuroscience-backed memory mechanisms.
All HEXACO-modulated (emotionality, conscientiousness, openness, etc.).

- Pass `{}` for sensible defaults (all 8 mechanisms enabled).
- Omit entirely to disable (zero overhead — no code paths execute).
- Provide per-mechanism overrides to tune individual parameters.

Requires `memory` to be enabled (`true` or a `MemoryConfig` object).
If `cognitiveMechanisms` is set but `memory` is disabled, a warning is logged
and the mechanisms config is ignored.

#### See

[Cognitive Mechanisms Docs](https://docs.agentos.sh/memory/cognitive-mechanisms)

#### Inherited from

`BaseAgentConfig.cognitiveMechanisms`

***

### controls?

> `optional` **controls**: [`ResourceControls`](ResourceControls.md)

Defined in: [packages/agentos/src/api/types.ts:1325](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1325)

Resource limits (tokens, cost, time) applied to the entire run.

#### Inherited from

`BaseAgentConfig.controls`

***

### dependsOn?

> `optional` **dependsOn**: `string`[]

Defined in: [packages/agentos/src/api/types.ts:1332](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1332)

Names of other agents in the agency that must complete before this agent runs.
Used with `strategy: 'graph'` to build an explicit dependency DAG.
Agents with no `dependsOn` are roots and run first.

#### Example

```ts
`dependsOn: ['researcher']` — this agent waits for `researcher` to finish.
```

#### Inherited from

`BaseAgentConfig.dependsOn`

***

### discovery?

> `optional` **discovery**: `DiscoveryConfig`

Defined in: [packages/agentos/src/api/types.ts:1288](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1288)

Runtime capability discovery configuration.

#### Inherited from

`BaseAgentConfig.discovery`

***

### emergent?

> `optional` **emergent**: `EmergentConfig`

Defined in: [packages/agentos/src/api/types.ts:1302](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1302)

Emergent agent synthesis configuration.

#### Inherited from

`BaseAgentConfig.emergent`

***

### fallbackProviders?

> `optional` **fallbackProviders**: [`FallbackProviderEntry`](FallbackProviderEntry.md)[]

Defined in: [packages/agentos/src/api/agent.ts:121](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L121)

Ordered list of fallback providers to try when the primary provider
fails with a retryable error (HTTP 402/429/5xx, network errors).

**Defaults to auto-built chain** when omitted — fallback is on by
default. Pass `[]` for strict single-provider mode, or supply a
custom array to control the chain. Applied to every `generate()`,
`stream()`, and `session.send()` / `session.stream()` call made
through this agent.

#### See

[GenerateTextOptions.fallbackProviders](GenerateTextOptions.md#fallbackproviders)

***

### guardrails?

> `optional` **guardrails**: `string`[] \| `GuardrailsConfig`

Defined in: [packages/agentos/src/api/types.ts:1294](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1294)

Guardrail policy identifiers or structured config.
- `string[]` — shorthand; applies to both input and output.
- `GuardrailsConfig` — full control with separate input/output lists.

#### Inherited from

`BaseAgentConfig.guardrails`

***

### hitl?

> `optional` **hitl**: [`HitlConfig`](HitlConfig.md)

Defined in: [packages/agentos/src/api/types.ts:1300](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1300)

Human-in-the-loop approval configuration.

#### Inherited from

`BaseAgentConfig.hitl`

***

### hostPolicy?

> `optional` **hostPolicy**: [`HostLLMPolicy`](HostLLMPolicy.md)

Defined in: [packages/agentos/src/api/agent.ts:132](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L132)

Host-level routing hints forwarded to the high-level generation helpers.

***

### instructions?

> `optional` **instructions**: `string`

Defined in: [packages/agentos/src/api/types.ts:1236](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1236)

Free-form system instructions prepended to the system prompt.

#### Inherited from

`BaseAgentConfig.instructions`

***

### maxSteps?

> `optional` **maxSteps**: `number`

Defined in: [packages/agentos/src/api/types.ts:1265](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1265)

Maximum number of agentic steps (LLM calls) per invocation. Defaults to `5`.

#### Inherited from

`BaseAgentConfig.maxSteps`

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [packages/agentos/src/api/types.ts:1277](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1277)

Upper bound on completion tokens for each LLM call the agent makes.
Forwarded to the underlying `generateText` / `streamText` call on
every `generate()`, `stream()`, and `session.send()` invocation.

Caps tail spend when a model misbehaves and yaps past the intended
output size — without it, calls fall back to the provider default
(OpenAI 4096, Anthropic 4096-8192). Set to ~2× the agent's typical
response size so normal calls finish naturally and only runaway
generations hit the cap. Omit to use the provider default.

#### Inherited from

`BaseAgentConfig.maxTokens`

***

### memory?

> `optional` **memory**: `boolean` \| `MemoryConfig`

Defined in: [packages/agentos/src/api/types.ts:1284](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1284)

Memory configuration.
- `true` — enable in-memory conversation history with default settings.
- `false` — disable memory; every call is stateless.
- `MemoryConfig` — full control over memory subsystems.

#### Inherited from

`BaseAgentConfig.memory`

***

### memoryProvider?

> `optional` **memoryProvider**: [`AgentMemoryProvider`](AgentMemoryProvider.md)

Defined in: [packages/agentos/src/api/agent.ts:191](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L191)

Optional memory provider. When provided, memory auto-wires on all four
agent call paths (see [AgentMemoryProvider](AgentMemoryProvider.md) for hook contract).

- `getContext` runs before each LLM call; result prepended as a system
  message.
- `observe` runs after each LLM call as fire-and-forget.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/types.ts:1229](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1229)

Model identifier. Accepted in two formats:
- `"provider:model"` — e.g. `"openai:gpt-4o"`.
- Plain model name when `provider` is also set.

#### Inherited from

`BaseAgentConfig.model`

***

### name?

> `optional` **name**: `string`

Defined in: [packages/agentos/src/api/types.ts:1238](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1238)

Display name for the agent, injected into the system prompt.

#### Inherited from

`BaseAgentConfig.name`

***

### observability?

> `optional` **observability**: `ObservabilityConfig`

Defined in: [packages/agentos/src/api/types.ts:1321](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1321)

Observability and telemetry configuration.

#### Inherited from

`BaseAgentConfig.observability`

***

### on?

> `optional` **on**: [`AgencyCallbacks`](AgencyCallbacks.md)

Defined in: [packages/agentos/src/api/types.ts:1323](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1323)

Event callbacks fired at various lifecycle points during the run.

#### Inherited from

`BaseAgentConfig.on`

***

### onAfterGeneration()?

> `optional` **onAfterGeneration**: (`result`) => `Promise`\<`void` \| [`GenerationHookResult`](GenerationHookResult.md)\>

Defined in: [packages/agentos/src/api/agent.ts:180](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L180)

Post-generation hook, called after each LLM step.

#### Parameters

##### result

[`GenerationHookResult`](GenerationHookResult.md)

#### Returns

`Promise`\<`void` \| [`GenerationHookResult`](GenerationHookResult.md)\>

***

### onBeforeGeneration()?

> `optional` **onBeforeGeneration**: (`context`) => `Promise`\<`void` \| [`GenerationHookContext`](GenerationHookContext.md)\>

Defined in: [packages/agentos/src/api/agent.ts:178](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L178)

Pre-generation hook, called before each LLM step.

#### Parameters

##### context

[`GenerationHookContext`](GenerationHookContext.md)

#### Returns

`Promise`\<`void` \| [`GenerationHookContext`](GenerationHookContext.md)\>

***

### onBeforeToolExecution()?

> `optional` **onBeforeToolExecution**: (`info`) => `Promise`\<[`ToolCallHookInfo`](ToolCallHookInfo.md) \| `null`\>

Defined in: [packages/agentos/src/api/agent.ts:182](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L182)

Pre-tool-execution hook.

#### Parameters

##### info

[`ToolCallHookInfo`](ToolCallHookInfo.md)

#### Returns

`Promise`\<[`ToolCallHookInfo`](ToolCallHookInfo.md) \| `null`\>

***

### onFallback()?

> `optional` **onFallback**: (`error`, `fallbackProvider`) => `void`

Defined in: [packages/agentos/src/api/agent.ts:128](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L128)

Callback invoked when a fallback provider is about to be tried.

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

### output?

> `optional` **output**: `unknown`

Defined in: [packages/agentos/src/api/types.ts:1317](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1317)

Output schema for structured generation.
Accepts a Zod schema at runtime; typed as `unknown` here to avoid a
hard dependency on the `zod` package in the types layer.

#### Inherited from

`BaseAgentConfig.output`

***

### permissions?

> `optional` **permissions**: `PermissionsConfig`

Defined in: [packages/agentos/src/api/types.ts:1298](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1298)

Fine-grained tool and resource permission overrides.

#### Inherited from

`BaseAgentConfig.permissions`

***

### personality?

> `optional` **personality**: `Partial`\<\{ `agreeableness`: `number`; `conscientiousness`: `number`; `emotionality`: `number`; `extraversion`: `number`; `honesty`: `number`; `openness`: `number`; \}\>

Defined in: [packages/agentos/src/api/types.ts:1247](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1247)

HEXACO-inspired personality trait overrides (0–1 scale).
Encoded as a human-readable trait string appended to the system prompt.

#### Inherited from

`BaseAgentConfig.personality`

***

### provenance?

> `optional` **provenance**: `ProvenanceConfig`

Defined in: [packages/agentos/src/api/types.ts:1319](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1319)

Provenance and audit-trail configuration.

#### Inherited from

`BaseAgentConfig.provenance`

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/types.ts:1234](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1234)

Provider name (e.g. `"openai"`, `"anthropic"`, `"ollama"`).
Auto-detected from environment API keys when omitted.

#### Inherited from

`BaseAgentConfig.provider`

***

### rag?

> `optional` **rag**: `RagConfig`

Defined in: [packages/agentos/src/api/types.ts:1286](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1286)

Retrieval-Augmented Generation configuration.

#### Inherited from

`BaseAgentConfig.rag`

***

### responseSchema?

> `optional` **responseSchema**: [`ZodType`](../@framers/namespaces/z/interfaces/ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../@framers/namespaces/z/namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>

Defined in: [packages/agentos/src/api/agent.ts:176](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L176)

Optional Zod schema for validating the LLM's structured output.

When provided, the agent's `generate()` result includes a `parsed` field
with the Zod-validated and typed output. JSON extraction and validation
happen automatically in the `onAfterGeneration` hook. On validation failure,
the agent retries internally (up to `controls.maxValidationRetries ?? 1`).

When omitted, behavior is unchanged — `result.parsed` is undefined.
This is a non-breaking additive change.

#### Example

```ts
import { z } from 'zod';
const myAgent = agent({
  name: 'Extractor',
  instructions: 'Extract entities as JSON',
  responseSchema: z.object({ entities: z.array(z.string()) }),
});
const result = await myAgent.generate('Find entities in: ...');
console.log(result.parsed?.entities); // string[]
```

***

### router?

> `optional` **router**: [`IModelRouter`](IModelRouter.md)

Defined in: [packages/agentos/src/api/agent.ts:130](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L130)

Model router for intelligent provider selection per-call.

***

### routerParams?

> `optional` **routerParams**: `Partial`\<[`ModelRouteParams`](ModelRouteParams.md)\>

Defined in: [packages/agentos/src/api/agent.ts:152](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L152)

Routing hints passed to the model router's `selectModel()` call.

Useful for declaring capability requirements up-front so the router
can pick a model that actually supports what the agent needs:

```ts
agent({
  name: 'World Architect',
  router: policyAwareRouter,
  routerParams: { requiredCapabilities: ['json_mode'] },
  output: WorldIdentitySchema,
});
```

When omitted, the router receives a minimal default params object
(taskHint only, plus `function_calling` in requiredCapabilities when
tools are declared).

***

### security?

> `optional` **security**: `object`

Defined in: [packages/agentos/src/api/types.ts:1296](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1296)

Security tier controlling permitted tools and capabilities.

#### tier

> **tier**: `SecurityTier`

#### Inherited from

`BaseAgentConfig.security`

***

### skills?

> `optional` **skills**: [`SkillEntry`](SkillEntry.md)[]

Defined in: [packages/agentos/src/api/agent.ts:196](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L196)

Optional skill entries to inject into the system prompt.
Skill content is appended to the system prompt as markdown sections.

***

### systemBlocks?

> `optional` **systemBlocks**: [`SystemContentBlock`](SystemContentBlock.md)[]

Defined in: [packages/agentos/src/api/agent.ts:203](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L203)

Structured system prompt blocks with cache breakpoints.
When provided, takes precedence over the assembled string from
`instructions`, `name`, `personality`, and `skills`.
Use this for prompt caching support with Anthropic.

***

### tools?

> `optional` **tools**: [`AdaptableToolInput`](../type-aliases/AdaptableToolInput.md)

Defined in: [packages/agentos/src/api/types.ts:1263](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1263)

Tools available to the agent on every call.

Accepts:
- a named high-level tool map
- an `ExternalToolRegistry` (`Record`, `Map`, or iterable)
- a prompt-only `ToolDefinitionForLLM[]`

#### Inherited from

`BaseAgentConfig.tools`

***

### usageLedger?

> `optional` **usageLedger**: [`AgentOSUsageLedgerOptions`](AgentOSUsageLedgerOptions.md)

Defined in: [packages/agentos/src/api/agent.ts:101](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L101)

Top-level usage ledger shorthand for backward compatibility.
When present, forwarded to `observability.usageLedger` internally.

***

### voice?

> `optional` **voice**: `VoiceConfig`

Defined in: [packages/agentos/src/api/types.ts:1304](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1304)

Voice interface configuration.

#### Inherited from

`BaseAgentConfig.voice`
