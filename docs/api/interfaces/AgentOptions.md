# Interface: AgentOptions

Defined in: [packages/agentos/src/api/agent.ts:99](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L99)

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

Defined in: [packages/agentos/src/api/types.ts:1253](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1253)

Override the provider API key instead of reading from environment variables.

#### Inherited from

`BaseAgentConfig.apiKey`

***

### avatar?

> `optional` **avatar**: `AvatarConfig`

Defined in: [packages/agentos/src/api/types.ts:1340](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1340)

Avatar visual presentation configuration.

#### Inherited from

`BaseAgentConfig.avatar`

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/types.ts:1255](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1255)

Override the provider base URL (useful for local proxies or Ollama).

#### Inherited from

`BaseAgentConfig.baseUrl`

***

### chainOfThought?

> `optional` **chainOfThought**: `string` \| `boolean`

Defined in: [packages/agentos/src/api/agent.ts:111](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L111)

Chain-of-thought reasoning instruction.
- `false` — disable CoT injection.
- `true` (default for agents) — inject the default CoT instruction when tools are present.
- `string` — inject a custom CoT instruction when tools are present.

***

### channels?

> `optional` **channels**: `Record`\<`string`, `Record`\<`string`, `unknown`\>\>

Defined in: [packages/agentos/src/api/types.ts:1345](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1345)

Channel adapter configurations keyed by channel name.
Values are channel-specific option objects passed through opaquely.

#### Inherited from

`BaseAgentConfig.channels`

***

### cognitiveMechanisms?

> `optional` **cognitiveMechanisms**: [`CognitiveMechanismsConfig`](CognitiveMechanismsConfig.md)

Defined in: [packages/agentos/src/api/types.ts:1382](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1382)

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

Defined in: [packages/agentos/src/api/types.ts:1359](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1359)

Resource limits (tokens, cost, time) applied to the entire run.

#### Inherited from

`BaseAgentConfig.controls`

***

### dependsOn?

> `optional` **dependsOn**: `string`[]

Defined in: [packages/agentos/src/api/types.ts:1366](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1366)

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

Defined in: [packages/agentos/src/api/types.ts:1322](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1322)

Runtime capability discovery configuration.

#### Inherited from

`BaseAgentConfig.discovery`

***

### emergent?

> `optional` **emergent**: `EmergentConfig`

Defined in: [packages/agentos/src/api/types.ts:1336](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1336)

Emergent agent synthesis configuration.

#### Inherited from

`BaseAgentConfig.emergent`

***

### fallbackProviders?

> `optional` **fallbackProviders**: [`FallbackProviderEntry`](FallbackProviderEntry.md)[]

Defined in: [packages/agentos/src/api/agent.ts:124](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L124)

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

Defined in: [packages/agentos/src/api/types.ts:1328](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1328)

Guardrail policy identifiers or structured config.
- `string[]` — shorthand; applies to both input and output.
- `GuardrailsConfig` — full control with separate input/output lists.

#### Inherited from

`BaseAgentConfig.guardrails`

***

### hitl?

> `optional` **hitl**: [`HitlConfig`](HitlConfig.md)

Defined in: [packages/agentos/src/api/types.ts:1334](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1334)

Human-in-the-loop approval configuration.

#### Inherited from

`BaseAgentConfig.hitl`

***

### hostPolicy?

> `optional` **hostPolicy**: [`HostLLMPolicy`](HostLLMPolicy.md)

Defined in: [packages/agentos/src/api/agent.ts:135](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L135)

Host-level routing hints forwarded to the high-level generation helpers.

***

### instructions?

> `optional` **instructions**: `string`

Defined in: [packages/agentos/src/api/types.ts:1249](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1249)

Free-form system instructions prepended to the system prompt.

#### Inherited from

`BaseAgentConfig.instructions`

***

### maxSteps?

> `optional` **maxSteps**: `number`

Defined in: [packages/agentos/src/api/types.ts:1278](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1278)

Maximum number of agentic steps (LLM calls) per invocation. Defaults to `5`.

#### Inherited from

`BaseAgentConfig.maxSteps`

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [packages/agentos/src/api/types.ts:1311](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1311)

Upper bound on completion tokens for each LLM call the agent makes.
Forwarded to the underlying `generateText` / `streamText` call on
every `generate()`, `stream()`, and `session.send()` invocation.

Caps tail spend when a model misbehaves and yaps past the intended
output size. Omit to use the provider default — AnthropicProvider
defaults to 16000 (set 2026-05-17; was 4096), OpenAIProvider
defaults to 4096, GeminiProvider defaults to 8192. Set to ~2× the
agent's typical response size so normal calls finish naturally
and only runaway generations hit the cap.

#### Example

```ts
// Cap a roleplay agent at 1024 — short turns, fast feedback.
const companion = agent({
  provider: 'anthropic',
  model: 'claude-sonnet-4-6',
  instructions: 'Reply in character. 2-3 sentences.',
  maxTokens: 1024,
});

// Tool-use agent emitting verbose JSON — go big so structured
// output doesn't truncate mid-token. Opus 4.7 supports 32000.
const codegen = agent({
  provider: 'anthropic',
  model: 'claude-opus-4-7',
  tools: { GenerateCode, RunTests, JudgeOutput },
  maxTokens: 16000,
});
```

#### Inherited from

`BaseAgentConfig.maxTokens`

***

### memory?

> `optional` **memory**: `boolean` \| `MemoryConfig`

Defined in: [packages/agentos/src/api/types.ts:1318](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1318)

Memory configuration.
- `true` — enable in-memory conversation history with default settings.
- `false` — disable memory; every call is stateless.
- `MemoryConfig` — full control over memory subsystems.

#### Inherited from

`BaseAgentConfig.memory`

***

### memoryProvider?

> `optional` **memoryProvider**: [`AgentMemoryProvider`](AgentMemoryProvider.md)

Defined in: [packages/agentos/src/api/agent.ts:194](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L194)

Optional memory provider. When provided, memory auto-wires on all four
agent call paths (see [AgentMemoryProvider](AgentMemoryProvider.md) for hook contract).

- `getContext` runs before each LLM call; result prepended as a system
  message.
- `observe` runs after each LLM call as fire-and-forget.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/types.ts:1242](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1242)

Model identifier. Accepted in two formats:
- Plain model name (e.g. `"gpt-4o"`) when `provider` is also set. Preferred.
- `"provider:model"` combined string (e.g. `"openai:gpt-4o"`).

#### Inherited from

`BaseAgentConfig.model`

***

### name?

> `optional` **name**: `string`

Defined in: [packages/agentos/src/api/types.ts:1251](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1251)

Display name for the agent, injected into the system prompt.

#### Inherited from

`BaseAgentConfig.name`

***

### observability?

> `optional` **observability**: `ObservabilityConfig`

Defined in: [packages/agentos/src/api/types.ts:1355](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1355)

Observability and telemetry configuration.

#### Inherited from

`BaseAgentConfig.observability`

***

### on?

> `optional` **on**: [`AgencyCallbacks`](AgencyCallbacks.md)

Defined in: [packages/agentos/src/api/types.ts:1357](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1357)

Event callbacks fired at various lifecycle points during the run.

#### Inherited from

`BaseAgentConfig.on`

***

### onAfterGeneration()?

> `optional` **onAfterGeneration**: (`result`) => `Promise`\<`void` \| [`GenerationHookResult`](GenerationHookResult.md)\>

Defined in: [packages/agentos/src/api/agent.ts:183](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L183)

Post-generation hook, called after each LLM step.

#### Parameters

##### result

[`GenerationHookResult`](GenerationHookResult.md)

#### Returns

`Promise`\<`void` \| [`GenerationHookResult`](GenerationHookResult.md)\>

***

### onBeforeGeneration()?

> `optional` **onBeforeGeneration**: (`context`) => `Promise`\<`void` \| [`GenerationHookContext`](GenerationHookContext.md)\>

Defined in: [packages/agentos/src/api/agent.ts:181](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L181)

Pre-generation hook, called before each LLM step.

#### Parameters

##### context

[`GenerationHookContext`](GenerationHookContext.md)

#### Returns

`Promise`\<`void` \| [`GenerationHookContext`](GenerationHookContext.md)\>

***

### onBeforeToolExecution()?

> `optional` **onBeforeToolExecution**: (`info`) => `Promise`\<[`ToolCallHookInfo`](ToolCallHookInfo.md) \| `null`\>

Defined in: [packages/agentos/src/api/agent.ts:185](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L185)

Pre-tool-execution hook.

#### Parameters

##### info

[`ToolCallHookInfo`](ToolCallHookInfo.md)

#### Returns

`Promise`\<[`ToolCallHookInfo`](ToolCallHookInfo.md) \| `null`\>

***

### onFallback()?

> `optional` **onFallback**: (`error`, `fallbackProvider`) => `void`

Defined in: [packages/agentos/src/api/agent.ts:131](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L131)

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

Defined in: [packages/agentos/src/api/types.ts:1351](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1351)

Output schema for structured generation.
Accepts a Zod schema at runtime; typed as `unknown` here to avoid a
hard dependency on the `zod` package in the types layer.

#### Inherited from

`BaseAgentConfig.output`

***

### permissions?

> `optional` **permissions**: `PermissionsConfig`

Defined in: [packages/agentos/src/api/types.ts:1332](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1332)

Fine-grained tool and resource permission overrides.

#### Inherited from

`BaseAgentConfig.permissions`

***

### personality?

> `optional` **personality**: `Partial`\<\{ `agreeableness`: `number`; `conscientiousness`: `number`; `emotionality`: `number`; `extraversion`: `number`; `honesty`: `number`; `openness`: `number`; \}\>

Defined in: [packages/agentos/src/api/types.ts:1260](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1260)

HEXACO-inspired personality trait overrides (0–1 scale).
Encoded as a human-readable trait string appended to the system prompt.

#### Inherited from

`BaseAgentConfig.personality`

***

### provenance?

> `optional` **provenance**: `AgencyProvenanceConfig`

Defined in: [packages/agentos/src/api/types.ts:1353](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1353)

Provenance and audit-trail configuration.

#### Inherited from

`BaseAgentConfig.provenance`

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/types.ts:1247](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1247)

Provider name (e.g. `"openai"`, `"anthropic"`, `"ollama"`).
Auto-detected from environment API keys when omitted.

#### Inherited from

`BaseAgentConfig.provider`

***

### rag?

> `optional` **rag**: `RagConfig`

Defined in: [packages/agentos/src/api/types.ts:1320](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1320)

Retrieval-Augmented Generation configuration.

#### Inherited from

`BaseAgentConfig.rag`

***

### responseSchema?

> `optional` **responseSchema**: [`ZodType`](../@framers/namespaces/z/interfaces/ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../@framers/namespaces/z/namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>

Defined in: [packages/agentos/src/api/agent.ts:179](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L179)

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

Defined in: [packages/agentos/src/api/agent.ts:133](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L133)

Model router for intelligent provider selection per-call.

***

### routerParams?

> `optional` **routerParams**: `Partial`\<[`ModelRouteParams`](ModelRouteParams.md)\>

Defined in: [packages/agentos/src/api/agent.ts:155](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L155)

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

Defined in: [packages/agentos/src/api/types.ts:1330](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1330)

Security tier controlling permitted tools and capabilities.

#### tier

> **tier**: `SecurityTier`

#### Inherited from

`BaseAgentConfig.security`

***

### skills?

> `optional` **skills**: [`SkillEntry`](SkillEntry.md)[]

Defined in: [packages/agentos/src/api/agent.ts:199](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L199)

Optional skill entries to inject into the system prompt.
Skill content is appended to the system prompt as markdown sections.

***

### soul?

> `optional` **soul**: `string` \| \{ `content`: `string`; \} \| \{ `path`: `string`; \}

Defined in: [packages/agentos/src/api/agent.ts:238](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L238)

Per-agent identity loaded from a SOUL.md workspace (the OpenClaw / aaronjmars-soul.md
convention). Three forms are accepted:

- **Workspace path** — points at a directory containing SOUL.md and optional
  companion files (STYLE.md, IDENTITY.md, AGENTS.md, MEMORY.md, examples/):
  ```ts
  agent({ provider: 'anthropic', soul: '~/.agentos/agents/aria' });
  ```

- **Direct file path** — points at a single SOUL.md file:
  ```ts
  agent({ provider: 'anthropic', soul: './personas/aria.soul.md' });
  ```

- **Inline content** — pass the soul markdown directly (useful for tests and
  ephemeral agents):
  ```ts
  agent({ provider: 'anthropic', soul: { content: SOUL_MARKDOWN_STRING } });
  ```

Loading semantics: at agent boot the runtime reads SOUL.md, parses YAML
frontmatter into an `IPersonaDefinition` (HEXACO traits, voice, mood,
hardLimits), and injects the markdown body as the FIRST system message —
before `instructions`, `chainOfThought`, `personality`, or `skills`. STYLE.md
is appended as a second system message when present.

#### See

 - loadSoul in `@framers/agentos/cognition/substrate/personas/SoulLoader`
for the loader implementation and full SOUL.md format spec.
 - https://github.com/aaronjmars/soul.md for the cross-framework convention.

***

### systemBlocks?

> `optional` **systemBlocks**: [`SystemContentBlock`](SystemContentBlock.md)[]

Defined in: [packages/agentos/src/api/agent.ts:206](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L206)

Structured system prompt blocks with cache breakpoints.
When provided, takes precedence over the assembled string from
`instructions`, `name`, `personality`, and `skills`.
Use this for prompt caching support with Anthropic.

***

### tools?

> `optional` **tools**: [`AdaptableToolInput`](../type-aliases/AdaptableToolInput.md)

Defined in: [packages/agentos/src/api/types.ts:1276](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1276)

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

Defined in: [packages/agentos/src/api/agent.ts:104](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L104)

Top-level usage ledger shorthand. When present, forwarded to
`observability.usageLedger` internally.

***

### verifyCitations?

> `optional` **verifyCitations**: `VerifyCitationsConfig`

Defined in: [packages/agentos/src/api/types.ts:1415](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1415)

Auto-verify citations after every generation.

When set, the agent retrieves sources for each user input, runs
generation, then scores each atomic claim in the response against the
retrieved sources via `CitationVerifier`. The resulting `VerifiedResponse`
is attached to the generation result's `grounding` field — no separate
`verifier.verify(text, sources)` call needed.

Pass a config object with the embedding function and the source
retriever the verifier should use:

#### Example

```ts
const docsAgent = agent({
  provider: 'openai',
  model: 'gpt-4o',
  verifyCitations: {
    embedFn:  (texts) => embeddingManager.embedBatch(texts),
    retrieve: (query) => retriever.search(query),
  },
});

const result = await docsAgent.generate('How do I configure a guardrail?');
console.log(result.text);
console.log(result.grounding?.overallGrounded);
for (const claim of result.grounding?.claims ?? []) {
  if (claim.verdict !== 'supported') console.warn(claim.text);
}
```

#### Inherited from

`BaseAgentConfig.verifyCitations`

***

### voice?

> `optional` **voice**: `VoiceConfig`

Defined in: [packages/agentos/src/api/types.ts:1338](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1338)

Voice interface configuration.

#### Inherited from

`BaseAgentConfig.voice`
