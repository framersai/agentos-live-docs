# Interface: AgencyOptions

Defined in: [packages/agentos/src/api/types.ts:1105](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1105)

Configuration for the `agency()` factory function.
Extends `BaseAgentConfig` with a required `agents` roster and optional
multi-agent orchestration settings.

## Example

```ts
import { agency, hitl } from '@framers/agentos';

const myAgency = agency({
  model: 'openai:gpt-4o',
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

Defined in: [packages/agentos/src/api/types.ts:1120](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1120)

Whether the orchestrator may override `strategy` at runtime based on
task complexity signals.

***

### agents

> **agents**: `Record`\<`string`, `BaseAgentConfig` \| `Agent`\>

Defined in: [packages/agentos/src/api/types.ts:1110](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1110)

Named roster of sub-agents.  Each value is either a `BaseAgentConfig`
object (the agency will instantiate it) or a pre-built `Agent` instance.

***

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/types.ts:971](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L971)

Override the provider API key instead of reading from environment variables.

#### Inherited from

`BaseAgentConfig.apiKey`

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/types.ts:973](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L973)

Override the provider base URL (useful for local proxies or Ollama).

#### Inherited from

`BaseAgentConfig.baseUrl`

***

### channels?

> `optional` **channels**: `Record`\<`string`, `Record`\<`string`, `unknown`\>\>

Defined in: [packages/agentos/src/api/types.ts:1028](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1028)

Channel adapter configurations keyed by channel name.
Values are channel-specific option objects passed through opaquely.

#### Inherited from

`BaseAgentConfig.channels`

***

### cognitiveMechanisms?

> `optional` **cognitiveMechanisms**: [`CognitiveMechanismsConfig`](CognitiveMechanismsConfig.md)

Defined in: [packages/agentos/src/api/types.ts:1065](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1065)

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

Defined in: [packages/agentos/src/api/types.ts:1042](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1042)

Resource limits (tokens, cost, time) applied to the entire run.

#### Inherited from

`BaseAgentConfig.controls`

***

### dependsOn?

> `optional` **dependsOn**: `string`[]

Defined in: [packages/agentos/src/api/types.ts:1049](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1049)

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

Defined in: [packages/agentos/src/api/types.ts:1007](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1007)

Runtime capability discovery configuration.

#### Inherited from

`BaseAgentConfig.discovery`

***

### emergent?

> `optional` **emergent**: `EmergentConfig`

Defined in: [packages/agentos/src/api/types.ts:1021](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1021)

Emergent agent synthesis configuration.

#### Inherited from

`BaseAgentConfig.emergent`

***

### guardrails?

> `optional` **guardrails**: `string`[] \| `GuardrailsConfig`

Defined in: [packages/agentos/src/api/types.ts:1013](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1013)

Guardrail policy identifiers or structured config.
- `string[]` — shorthand; applies to both input and output.
- `GuardrailsConfig` — full control with separate input/output lists.

#### Inherited from

`BaseAgentConfig.guardrails`

***

### hitl?

> `optional` **hitl**: [`HitlConfig`](HitlConfig.md)

Defined in: [packages/agentos/src/api/types.ts:1019](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1019)

Human-in-the-loop approval configuration.

#### Inherited from

`BaseAgentConfig.hitl`

***

### instructions?

> `optional` **instructions**: `string`

Defined in: [packages/agentos/src/api/types.ts:967](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L967)

Free-form system instructions prepended to the system prompt.

#### Inherited from

`BaseAgentConfig.instructions`

***

### maxRounds?

> `optional` **maxRounds**: `number`

Defined in: [packages/agentos/src/api/types.ts:1125](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1125)

Maximum number of orchestration rounds before the run is terminated.
Applies to iterative strategies like `"debate"` and `"review-loop"`.

***

### maxSteps?

> `optional` **maxSteps**: `number`

Defined in: [packages/agentos/src/api/types.ts:996](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L996)

Maximum number of agentic steps (LLM calls) per invocation. Defaults to `5`.

#### Inherited from

`BaseAgentConfig.maxSteps`

***

### memory?

> `optional` **memory**: `boolean` \| `MemoryConfig`

Defined in: [packages/agentos/src/api/types.ts:1003](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1003)

Memory configuration.
- `true` — enable in-memory conversation history with default settings.
- `false` — disable memory; every call is stateless.
- `MemoryConfig` — full control over memory subsystems.

#### Inherited from

`BaseAgentConfig.memory`

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/types.ts:960](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L960)

Model identifier. Accepted in two formats:
- `"provider:model"` — e.g. `"openai:gpt-4o"`.
- Plain model name when `provider` is also set.

#### Inherited from

`BaseAgentConfig.model`

***

### name?

> `optional` **name**: `string`

Defined in: [packages/agentos/src/api/types.ts:969](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L969)

Display name for the agent, injected into the system prompt.

#### Inherited from

`BaseAgentConfig.name`

***

### observability?

> `optional` **observability**: `ObservabilityConfig`

Defined in: [packages/agentos/src/api/types.ts:1038](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1038)

Observability and telemetry configuration.

#### Inherited from

`BaseAgentConfig.observability`

***

### on?

> `optional` **on**: [`AgencyCallbacks`](AgencyCallbacks.md)

Defined in: [packages/agentos/src/api/types.ts:1040](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1040)

Event callbacks fired at various lifecycle points during the run.

#### Inherited from

`BaseAgentConfig.on`

***

### output?

> `optional` **output**: `unknown`

Defined in: [packages/agentos/src/api/types.ts:1034](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1034)

Output schema for structured generation.
Accepts a Zod schema at runtime; typed as `unknown` here to avoid a
hard dependency on the `zod` package in the types layer.

#### Inherited from

`BaseAgentConfig.output`

***

### permissions?

> `optional` **permissions**: `PermissionsConfig`

Defined in: [packages/agentos/src/api/types.ts:1017](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1017)

Fine-grained tool and resource permission overrides.

#### Inherited from

`BaseAgentConfig.permissions`

***

### personality?

> `optional` **personality**: `Partial`\<\{ `agreeableness`: `number`; `conscientiousness`: `number`; `emotionality`: `number`; `extraversion`: `number`; `honesty`: `number`; `openness`: `number`; \}\>

Defined in: [packages/agentos/src/api/types.ts:978](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L978)

HEXACO-inspired personality trait overrides (0–1 scale).
Encoded as a human-readable trait string appended to the system prompt.

#### Inherited from

`BaseAgentConfig.personality`

***

### provenance?

> `optional` **provenance**: `ProvenanceConfig`

Defined in: [packages/agentos/src/api/types.ts:1036](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1036)

Provenance and audit-trail configuration.

#### Inherited from

`BaseAgentConfig.provenance`

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/types.ts:965](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L965)

Provider name (e.g. `"openai"`, `"anthropic"`, `"ollama"`).
Auto-detected from environment API keys when omitted.

#### Inherited from

`BaseAgentConfig.provider`

***

### rag?

> `optional` **rag**: `RagConfig`

Defined in: [packages/agentos/src/api/types.ts:1005](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1005)

Retrieval-Augmented Generation configuration.

#### Inherited from

`BaseAgentConfig.rag`

***

### security?

> `optional` **security**: `object`

Defined in: [packages/agentos/src/api/types.ts:1015](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1015)

Security tier controlling permitted tools and capabilities.

#### tier

> **tier**: `SecurityTier`

#### Inherited from

`BaseAgentConfig.security`

***

### strategy?

> `optional` **strategy**: [`AgencyStrategy`](../type-aliases/AgencyStrategy.md)

Defined in: [packages/agentos/src/api/types.ts:1115](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1115)

Orchestration strategy for coordinating sub-agents.
Defaults to `"sequential"` when omitted.

***

### tools?

> `optional` **tools**: [`AdaptableToolInput`](../type-aliases/AdaptableToolInput.md)

Defined in: [packages/agentos/src/api/types.ts:994](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L994)

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

Defined in: [packages/agentos/src/api/types.ts:1023](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1023)

Voice interface configuration.

#### Inherited from

`BaseAgentConfig.voice`
