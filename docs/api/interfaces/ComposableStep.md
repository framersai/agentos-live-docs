# Interface: ComposableStep

Defined in: [packages/agentos/src/emergent/types.ts:70](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L70)

A single step in a composable tool pipeline.

Steps are executed sequentially. Each step invokes an existing registered tool
by name and maps values from the pipeline's shared input namespace into the
step's arguments using reference expressions.

Reference expression syntax (resolved at runtime):
- `"$input"` — the original input to the composable tool.
- `"$prev"`  — the output of the immediately preceding step.
- `"$steps.<stepName>"` — the output of a named step.
- Any other literal value is used as-is.

## Properties

### condition?

> `optional` **condition**: `string`

Defined in: [packages/agentos/src/emergent/types.ts:104](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L104)

Optional JSONata / simple expression evaluated against `$prev` before
executing this step. When the expression evaluates to falsy, the step is
skipped and its output is `null`.

#### Example

```ts
"$prev.totalCount > 0"
```

***

### inputMapping

> **inputMapping**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/emergent/types.ts:95](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L95)

Input argument mapping for the tool invocation.
Keys are the tool's argument names; values are literal values or reference
expressions (`$input`, `$prev`, `$steps.<name>`).

#### Example

```ts
{ query: "$input.searchTerm", maxResults: 5 }
```

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/emergent/types.ts:76](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L76)

Unique name for this step within the pipeline.
Used for cross-step references via `$steps.<stepName>`.

#### Example

```ts
"fetchUser"
```

***

### tool

> **tool**: `string`

Defined in: [packages/agentos/src/emergent/types.ts:83](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L83)

The registered tool name to invoke for this step.
Must match the `name` property of an `ITool` available to the agent.

#### Example

```ts
"web_search"
```
