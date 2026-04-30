# Class: GraphCompiler

Defined in: [packages/agentos/src/orchestration/compiler/GraphCompiler.ts:91](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/compiler/GraphCompiler.ts#L91)

Stateless compiler that transforms AgentGraph builder state into a `CompiledExecutionGraph`.

Compilation steps:
1. Flatten the `nodes` Map into a plain array (preserving insertion order).
2. Copy the `edges` array without transformation.
3. Lower each Zod state schema to a JSON Schema object via `lowerZodToJsonSchema`.
4. Assign a unique `id` based on `name` and the current timestamp.
5. Forward `reducers`, `memoryConsistency`, and `checkpointPolicy` unchanged.

## Example

```ts
const ir = GraphCompiler.compile({
  name: 'my-agent',
  nodes,
  edges,
  stateSchema: { input: z.object({ topic: z.string() }), scratch: z.object({}), artifacts: z.object({}) },
  reducers: {},
  memoryConsistency: 'snapshot',
  checkpointPolicy: 'none',
});
```

## Constructors

### Constructor

> **new GraphCompiler**(): `GraphCompiler`

#### Returns

`GraphCompiler`

## Methods

### compile()

> `static` **compile**(`input`): [`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

Defined in: [packages/agentos/src/orchestration/compiler/GraphCompiler.ts:101](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/compiler/GraphCompiler.ts#L101)

Compile builder state into a `CompiledExecutionGraph` IR object.

This method is **pure** — it reads from `input` and returns a new object without
mutating any of its arguments.

#### Parameters

##### input

[`GraphCompilerInput`](../interfaces/GraphCompilerInput.md)

The full set of builder state required for compilation.

#### Returns

[`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

A `CompiledExecutionGraph` ready for validation and execution.
