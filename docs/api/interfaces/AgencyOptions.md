# Interface: AgencyOptions

Defined in: [packages/agentos/src/api/types.ts:1532](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1532)

Configuration for the `agency()` factory function.
Extends `BaseAgentConfig` with a required `agents` roster and optional
multi-agent orchestration settings.

## Example

```ts
import { agency, hitl } from '@framers/agentos';

const myAgency = agency({
  provider: 'openai',
  model: 'gpt-4o',
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

Defined in: [packages/agentos/src/api/types.ts:1547](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1547)

Whether the orchestrator may override `strategy` at runtime based on
task complexity signals.

***

### agents

> **agents**: `Record`\<`string`, `BaseAgentConfig` \| `Agent`\>

Defined in: [packages/agentos/src/api/types.ts:1537](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1537)

Named roster of sub-agents.  Each value is either a `BaseAgentConfig`
object (the agency will instantiate it) or a pre-built `Agent` instance.

***

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

### instructions?

> `optional` **instructions**: `string`

Defined in: [packages/agentos/src/api/types.ts:1249](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1249)

Free-form system instructions prepended to the system prompt.

#### Inherited from

`BaseAgentConfig.instructions`

***

### maxRounds?

> `optional` **maxRounds**: `number`

Defined in: [packages/agentos/src/api/types.ts:1552](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1552)

Maximum number of orchestration rounds before the run is terminated.
Applies to iterative strategies like `"debate"` and `"review-loop"`.

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

### security?

> `optional` **security**: `object`

Defined in: [packages/agentos/src/api/types.ts:1330](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1330)

Security tier controlling permitted tools and capabilities.

#### tier

> **tier**: `SecurityTier`

#### Inherited from

`BaseAgentConfig.security`

***

### strategy?

> `optional` **strategy**: [`AgencyStrategy`](../type-aliases/AgencyStrategy.md)

Defined in: [packages/agentos/src/api/types.ts:1542](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1542)

Orchestration strategy for coordinating sub-agents.
Defaults to `"sequential"` when omitted.

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
