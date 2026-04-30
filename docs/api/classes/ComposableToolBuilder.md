# Class: ComposableToolBuilder

Defined in: [packages/agentos/src/emergent/ComposableToolBuilder.ts:94](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/ComposableToolBuilder.ts#L94)

Builds composite `ITool` instances by chaining existing tool invocations.

Each invocation is described by a [ComposableStep](../interfaces/ComposableStep.md) that maps values from
a shared pipeline context into the step tool's arguments via a lightweight
reference expression syntax:

| Expression | Resolves to |
|---|---|
| `"$input.foo"` | `args.foo` from the composite tool's own input |
| `"$input"` | the whole input object |
| `"$prev.bar"` | `bar` from the previous step's output |
| `"$prev"` | the previous step's full output |
| `"$steps[0].output.data"` | `output.data` from the first step's output |
| `"$steps[0]"` | the first step's full output |
| anything else | used as a literal value without transformation |

Reference expressions nested inside plain objects are resolved recursively, so
`{ query: "$input.topic", limit: 10 }` becomes `{ query: "actual-topic", limit: 10 }`.

Safe by construction — all tool invocations are delegated to the `executeTool`
callback supplied at construction time. The builder never holds a reference to
any tool registry.

## Example

```ts
const builder = new ComposableToolBuilder(async (toolName, args, ctx) => {
  const tool = registry.get(toolName);
  return tool.execute(args, ctx);
});

const spec: ComposableToolSpec = {
  mode: 'compose',
  steps: [
    { name: 'search', tool: 'web_search', inputMapping: { query: '$input.topic' } },
    { name: 'summarise', tool: 'summarise_text', inputMapping: { text: '$prev.snippet' } },
  ],
};

const tool = builder.build('research', 'Search then summarise a topic', schema, spec);
const result = await tool.execute({ topic: 'quantum computing' }, ctx);
```

## Constructors

### Constructor

> **new ComposableToolBuilder**(`executeTool`, `options?`): `ComposableToolBuilder`

Defined in: [packages/agentos/src/emergent/ComposableToolBuilder.ts:112](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/ComposableToolBuilder.ts#L112)

#### Parameters

##### executeTool

(`toolName`, `args`, `context`) => `Promise`\<[`ToolExecutionResult`](../interfaces/ToolExecutionResult.md)\<`any`\>\>

Callback invoked for each pipeline step. Receives the
  target tool name, the resolved argument object, and the outer execution
  context forwarded from the composite tool's own `execute` call.
  Must return a [ToolExecutionResult](../interfaces/ToolExecutionResult.md); a `success: false` result aborts
  the remainder of the pipeline.

##### options?

Optional builder configuration.

###### strictMode?

`boolean`

When true, unresolved reference expressions
  throw an error instead of falling through as literal strings.

#### Returns

`ComposableToolBuilder`

## Properties

### strictMode

> `readonly` **strictMode**: `boolean`

Defined in: [packages/agentos/src/emergent/ComposableToolBuilder.ts:100](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/ComposableToolBuilder.ts#L100)

When true, unresolved `$`-prefixed reference expressions throw instead
of silently passing through as literal strings. Useful for development
and testing to catch typos in inputMapping expressions early.

## Methods

### build()

> **build**(`name`, `description`, `inputSchema`, `spec`): [`ITool`](../interfaces/ITool.md)

Defined in: [packages/agentos/src/emergent/ComposableToolBuilder.ts:150](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/ComposableToolBuilder.ts#L150)

Build an `ITool`-compatible object from a [ComposableToolSpec](../interfaces/ComposableToolSpec.md).

The returned tool can be registered directly with any tool orchestrator that
accepts `ITool`. Its `execute` method runs the step pipeline sequentially,
threading outputs through the reference resolution system.

#### Parameters

##### name

`string`

Machine-readable tool name exposed to the LLM (e.g. `"research_topic"`).

##### description

`string`

Natural language description of what the composite tool does.

##### inputSchema

[`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

JSON Schema describing the arguments the composite tool accepts.

##### spec

[`ComposableToolSpec`](../interfaces/ComposableToolSpec.md)

The composable pipeline specification to execute.

#### Returns

[`ITool`](../interfaces/ITool.md)

A fully-formed `ITool` instance whose `execute` method runs the pipeline.

#### Example

```ts
const tool = builder.build(
  'fetch_and_summarise',
  'Fetch a URL then return a one-paragraph summary.',
  { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] },
  spec,
);
```

***

### validate()

> **validate**(`spec`): `object`

Defined in: [packages/agentos/src/emergent/ComposableToolBuilder.ts:238](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/ComposableToolBuilder.ts#L238)

Validate a [ComposableToolSpec](../interfaces/ComposableToolSpec.md) before building.

Performs structural checks only — it does not verify that the referenced tool
names are actually registered in any registry. Use this method to give early,
actionable feedback before attempting to [build](#build) a tool.

Checks performed:
1. `spec.steps` must be a non-empty array.
2. Every step must have a non-empty `tool` string.

#### Parameters

##### spec

[`ComposableToolSpec`](../interfaces/ComposableToolSpec.md)

The spec to validate.

#### Returns

`object`

`{ valid: true }` when the spec passes all checks, or
  `{ valid: false, errors: string[] }` with one message per failing check.

##### errors?

> `optional` **errors**: `string`[]

##### valid

> **valid**: `boolean`

#### Example

```ts
const result = builder.validate(spec);
if (!result.valid) {
  console.error('Invalid spec:', result.errors);
}
```
