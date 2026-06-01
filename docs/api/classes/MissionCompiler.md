# Class: MissionCompiler

Defined in: [packages/agentos/src/orchestration/compiler/MissionCompiler.ts:193](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/compiler/MissionCompiler.ts#L193)

Static compiler that transforms a `MissionConfig` into a `CompiledExecutionGraph`.

The compiler is intentionally stateless — call `MissionCompiler.compile()` as many
times as needed; each invocation is fully isolated.

## Example

```ts
const ir = MissionCompiler.compile({
  name: 'research-mission',
  inputSchema: z.object({ topic: z.string() }),
  goalTemplate: 'Research {{topic}} and produce a summary',
  returnsSchema: z.object({ summary: z.string() }),
  plannerConfig: { strategy: 'linear', maxSteps: 5 },
  anchors: [],
});
```

## Constructors

### Constructor

> **new MissionCompiler**(): `MissionCompiler`

#### Returns

`MissionCompiler`

## Methods

### classifyGoal()

> `static` **classifyGoal**(`goalTemplate`): `"research"` \| `"creative"` \| `"qa"`

Defined in: [packages/agentos/src/orchestration/compiler/MissionCompiler.ts:433](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/compiler/MissionCompiler.ts#L433)

Auto-classify a goal template into the most appropriate plan template.
Used when `plannerConfig.style` is not set explicitly. Pure keyword/regex
matching — no LLM call. Returns `'research'` for ambiguous or empty
goals to preserve the prior default behaviour.

Detection rules:
  - `qa`       — question-shaped goals starting with "what is", "why does",
                 "how do I", "explain", "define", or short trailing-?
                 questions where a research+refine pipeline is overkill.
  - `creative` — artifact-producing goals starting with "write a",
                 "compose", "draft a", "design a", "imagine".
  - `research` — everything else (default).

The classifier is intentionally **prefix-only** — matching creative
verbs anywhere in the goal would misclassify research-shaped phrasing
like "Research how to write a tagline" or "Find articles about
composing music" as creative. Compound goals like "Research X and
write a poem about it" therefore fall through to research; authors
with compound goals should set `plannerConfig.style` explicitly.

Public so callers can ask the classifier directly without compiling a
mission, and so tests can exercise the matrix of goal patterns without
round-tripping through the whole compile() pipeline.

#### Parameters

##### goalTemplate

`string`

#### Returns

`"research"` \| `"creative"` \| `"qa"`

***

### compile()

> `static` **compile**(`config`): [`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

Defined in: [packages/agentos/src/orchestration/compiler/MissionCompiler.ts:209](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/compiler/MissionCompiler.ts#L209)

Compile a mission config into a `CompiledExecutionGraph`.

Uses the current stub planner that generates a simple phase-ordered plan based
on the mission goal template. Planner-backed decomposition is not wired into
this compiler yet.

#### Parameters

##### config

[`MissionConfig`](../interfaces/MissionConfig.md)

Fully-populated `MissionConfig` object produced by `MissionBuilder`.

#### Returns

[`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

A validated `CompiledExecutionGraph` ready for `GraphRuntime`.

#### Throws

When `GraphValidator.validate()` reports structural errors.
