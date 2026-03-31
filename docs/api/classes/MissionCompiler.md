# Class: MissionCompiler

Defined in: [packages/agentos/src/orchestration/compiler/MissionCompiler.ts:159](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/compiler/MissionCompiler.ts#L159)

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

### compile()

> `static` **compile**(`config`): [`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

Defined in: [packages/agentos/src/orchestration/compiler/MissionCompiler.ts:175](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/compiler/MissionCompiler.ts#L175)

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
