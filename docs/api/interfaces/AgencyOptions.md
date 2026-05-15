# Interface: AgencyOptions

Defined in: [packages/agentos/src/api/types.ts:1388](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1388)

Configuration for the `agency()` factory function.
Extends `BaseAgentConfig` with a required `agents` roster and optional
multi-agent orchestration settings.

## Example

```ts
import { agency, hitl } from '@framers/agentos';

const myAgency = agency({
  provider: 'openai', model: 'gpt-4o',
  strategy: 'sequential',
  agents: {
    researcher: { instructions: 'Find relevant papers.' },
    writer:     { instructions: 'Write a clear summary.' },
  },
  controls: { maxTotalTokens: 50_000, onLimitReached: 'warn' },
  hitl: {
    approvals: { beforeTool: ['delete-file'], beforeReturn: true },
    handler: hitl.autoApprove(),
    timeoutMs: 30_000,
    onTimeout: 'reject',
  },
  on: {
    agentStart: (e) => console.log(`[${e.agent}] started`),
    agentEnd: (e) => console.log(`[${e.agent}] done in ${e.durationMs}ms`),
  },
});
```

## See

[agency](../functions/agency.md) -- the factory function that consumes this configuration.
See `BaseAgentConfig` for the shared config surface inherited by this interface.

## Extends

- `BaseAgentConfig`

## Properties

### adaptive?

> `optional` **adaptive**: `boolean`

Defined in: [packages/agentos/src/api/types.ts:1403](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1403)

Whether the orchestrator may override `strategy` at runtime based on
task complexity signals.

***

### agents

> **agents**: `Record`\<`string`, `BaseAgentConfig` \| `Agent`\>

Defined in: [packages/agentos/src/api/types.ts:1393](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1393)

Named roster of sub-agents.  Each value is either a `BaseAgentConfig`
object (the agency will instantiate it) or a pre-built `Agent` instance.

***

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

### instructions?

> `optional` **instructions**: `string`

Defined in: [packages/agentos/src/api/types.ts:1236](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1236)

Free-form system instructions prepended to the system prompt.

#### Inherited from

`BaseAgentConfig.instructions`

***

### maxRounds?

> `optional` **maxRounds**: `number`

Defined in: [packages/agentos/src/api/types.ts:1408](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1408)

Maximum number of orchestration rounds before the run is terminated.
Applies to iterative strategies like `"debate"` and `"review-loop"`.

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

### security?

> `optional` **security**: `object`

Defined in: [packages/agentos/src/api/types.ts:1296](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1296)

Security tier controlling permitted tools and capabilities.

#### tier

> **tier**: `SecurityTier`

#### Inherited from

`BaseAgentConfig.security`

***

### strategy?

> `optional` **strategy**: [`AgencyStrategy`](../type-aliases/AgencyStrategy.md)

Defined in: [packages/agentos/src/api/types.ts:1398](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1398)

Orchestration strategy for coordinating sub-agents.
Defaults to `"sequential"` when omitted.

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

### voice?

> `optional` **voice**: `VoiceConfig`

Defined in: [packages/agentos/src/api/types.ts:1304](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1304)

Voice interface configuration.

#### Inherited from

`BaseAgentConfig.voice`
