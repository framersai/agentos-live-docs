# Interface: SelfImprovementConfig

Defined in: [packages/agentos/src/emergent/SelfImprovementConfig.ts:29](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/SelfImprovementConfig.ts#L29)

Configuration for bounded autonomous self-improvement.

Controls four self-improvement capabilities:
- **Personality**: HEXACO trait mutation with per-session budgets and decay.
- **Skills**: Runtime skill enable/disable with allowlist gating.
- **Workflows**: Tool composition with step limits and tool allowlists.
- **Self-evaluation**: LLM-based self-scoring with parameter adjustment.

All capabilities require `enabled: true` as a master switch. Individual
sub-system settings provide additional fine-grained control.

## Properties

### enabled

> **enabled**: `boolean`

Defined in: [packages/agentos/src/emergent/SelfImprovementConfig.ts:35](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/SelfImprovementConfig.ts#L35)

Master switch for all self-improvement tools.
When `false`, no self-improvement tools are registered with the engine.

#### Default

```ts
false
```

***

### personality

> **personality**: `object`

Defined in: [packages/agentos/src/emergent/SelfImprovementConfig.ts:44](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/SelfImprovementConfig.ts#L44)

Configuration for bounded personality trait mutation.

Personality mutations modify HEXACO dimensions at runtime, subject to
per-session delta budgets and Ebbinghaus-style decay toward baseline
values during consolidation cycles.

#### decayRate

> **decayRate**: `number`

Decay rate toward baseline per consolidation cycle.

Each consolidation cycle reduces every mutation's strength by this
amount. Mutations whose strength falls below 0.1 are pruned.

##### Default

```ts
0.05
```

#### maxDeltaPerSession

> **maxDeltaPerSession**: `number`

Maximum absolute delta per trait per session.

Limits how far any single HEXACO dimension can shift in a single
agent session. Deltas exceeding this budget are clamped.

##### Default

```ts
0.15
```

#### persistWithDecay

> **persistWithDecay**: `boolean`

Whether to persist mutations across sessions with strength decay.

When `true`, mutations are written to the PersonalityMutationStore
and gradually decay toward baseline via the ConsolidationLoop.
When `false`, mutations are session-scoped only.

##### Default

```ts
true
```

***

### selfEval

> **selfEval**: `object`

Defined in: [packages/agentos/src/emergent/SelfImprovementConfig.ts:140](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/SelfImprovementConfig.ts#L140)

Configuration for self-evaluation and strategy adjustment.

The agent can evaluate its own responses, score them on multiple
criteria, and adjust operational parameters (temperature, verbosity,
personality) based on the evaluation results.

#### adjustableParams

> **adjustableParams**: `string`[]

Parameters the agent is permitted to adjust via self-evaluation.

Common adjustable parameters:
- `'temperature'` — LLM sampling temperature.
- `'verbosity'` — Response length preference.
- `'personality'` — Any HEXACO trait delta via a `{ trait, delta }` payload.
- explicit trait names such as `'openness'` or `'agreeableness'`.

##### Default

```ts
['temperature', 'verbosity', 'personality']
```

#### autoAdjust

> **autoAdjust**: `boolean`

Whether to auto-apply suggested adjustments after evaluation.

When `true`, the self-evaluate tool applies parameter adjustments
immediately. When `false`, adjustments are returned as suggestions
only and require explicit confirmation.

##### Default

```ts
true
```

#### evaluationModel?

> `optional` **evaluationModel**: `string`

Optional model override for the evaluation judge.

When omitted, the tool auto-detects the current text runtime and uses
its cheapest configured text model when available, falling back to
`openai:gpt-4o-mini`.

##### Default

```ts
auto-detected cheap text model
```

#### maxEvaluationsPerSession

> **maxEvaluationsPerSession**: `number`

Maximum number of self-evaluations allowed per session.

Prevents excessive LLM calls for self-scoring. Further evaluation
requests beyond this limit are rejected.

##### Default

```ts
10
```

***

### skills

> **skills**: `object`

Defined in: [packages/agentos/src/emergent/SelfImprovementConfig.ts:80](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/SelfImprovementConfig.ts#L80)

Configuration for runtime skill management.

Controls which skills the agent can enable/disable at runtime and
whether human-in-the-loop approval is required for new skill categories.

#### allowlist

> **allowlist**: `string`[]

Skill IDs or patterns the agent is allowed to enable.

Supports three matching modes:
- `['*']` — All skills are allowed (default).
- `['category:X']` — Skills in category `X` are allowed.
- `['skillId']` — Exact skill ID match.

##### Default

```ts
['*']
```

#### requireApprovalForNewCategories

> **requireApprovalForNewCategories**: `boolean`

Whether to require HITL approval for skills in new categories.

When `true`, enabling a skill whose category is not yet represented
among active skills returns a `requires_approval` status instead of
enabling immediately.

##### Default

```ts
true
```

***

### workflows

> **workflows**: `object`

Defined in: [packages/agentos/src/emergent/SelfImprovementConfig.ts:111](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/SelfImprovementConfig.ts#L111)

Configuration for runtime workflow composition.

Workflows are multi-step tool pipelines created by the agent at runtime.
Steps execute sequentially with reference resolution (`$input`, `$prev`,
`$steps[N]`) between them.

#### allowedTools

> **allowedTools**: `string`[]

Tool names or patterns the agent may compose into workflows.

- `['*']` — All registered tools are allowed (default).
- `['toolName']` — Only the listed tools may appear as workflow steps.

The `create_workflow` tool is always excluded to prevent recursion.

##### Default

```ts
['*']
```

#### maxSteps

> **maxSteps**: `number`

Maximum number of steps per composed workflow.

Prevents unbounded pipeline creation. Workflows exceeding this
limit are rejected at creation time.

##### Default

```ts
10
```
