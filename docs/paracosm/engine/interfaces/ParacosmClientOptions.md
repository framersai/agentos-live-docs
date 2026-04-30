# Interface: ParacosmClientOptions

Defined in: [apps/paracosm/src/runtime/client.ts:37](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/client.ts#L37)

Options passed to `createParacosmClient`. Every field is optional and composes with env-var reads.

## Properties

### compilerModel?

> `optional` **compilerModel**: `string`

Defined in: [apps/paracosm/src/runtime/client.ts:72](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/client.ts#L72)

Model to use for compile-time LLM calls. Env fallback:
`PARACOSM_COMPILER_MODEL`. If omitted the compiler picks a
provider-default (gpt-5.4-mini on OpenAI, claude-sonnet-4-6 on
Anthropic).

***

### compilerProvider?

> `optional` **compilerProvider**: [`LlmProvider`](../type-aliases/LlmProvider.md)

Defined in: [apps/paracosm/src/runtime/client.ts:65](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/client.ts#L65)

Provider to use for compile-time LLM calls in `client.compileScenario`.
Defaults to `provider` when unset so most users only configure one
provider. Env fallback: `PARACOSM_COMPILER_PROVIDER`.

***

### costPreset?

> `optional` **costPreset**: [`CostPreset`](../type-aliases/CostPreset.md)

Defined in: [apps/paracosm/src/runtime/client.ts:48](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/client.ts#L48)

Default cost preset. Env fallback: `PARACOSM_COST_PRESET=quality`
or `=economy`.

***

### models?

> `optional` **models**: `Partial`\<[`SimulationModelConfig`](SimulationModelConfig.md)\>

Defined in: [apps/paracosm/src/runtime/client.ts:59](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/client.ts#L59)

Per-role model pins. Env fallbacks:
  PARACOSM_MODEL_COMMANDER, PARACOSM_MODEL_DEPARTMENTS,
  PARACOSM_MODEL_JUDGE, PARACOSM_MODEL_DIRECTOR,
  PARACOSM_MODEL_AGENT_REACTIONS
Merged at the per-role level, not whole-object: setting
`models: { departments: 'gpt-5.4' }` pins departments but leaves
commander / director / judge / agentReactions flowing from the
preset as before.

***

### provider?

> `optional` **provider**: [`LlmProvider`](../type-aliases/LlmProvider.md)

Defined in: [apps/paracosm/src/runtime/client.ts:43](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/client.ts#L43)

Default provider for `runSimulation` / `runBatch`. Env fallback:
`PARACOSM_PROVIDER=openai` or `=anthropic`. Per-call `opts.provider`
still wins.
