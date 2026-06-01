# Interface: ForgeToolRequest

Defined in: [packages/agentos/src/cognition/emergent/types.ts:536](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L536)

Request payload for the `forge_tool` system tool.

An agent submits this to request the creation of a new emergent tool. The
engine validates the request, runs the judge, and returns a [ForgeResult](../type-aliases/ForgeResult.md).

## Properties

### description

> **description**: `string`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:547](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L547)

Natural language description of the tool's purpose and behaviour.
Used verbatim as the tool's description in the LLM tool list.

***

### implementation

> **implementation**: [`ToolImplementation`](../type-aliases/ToolImplementation.md)

Defined in: [packages/agentos/src/cognition/emergent/types.ts:562](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L562)

Implementation specification — composable pipeline or sandboxed code.

***

### inputSchema

> **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/cognition/emergent/types.ts:552](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L552)

JSON Schema for the tool's input arguments.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:541](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L541)

Desired machine-readable name for the new tool.
Must be unique among tools currently visible to the requesting agent.

***

### outputSchema

> **outputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/cognition/emergent/types.ts:557](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L557)

JSON Schema for the tool's expected output.

***

### testCases

> **testCases**: \[[`ForgeTestCase`](ForgeTestCase.md), `...ForgeTestCase[]`\]

Defined in: [packages/agentos/src/cognition/emergent/types.ts:568](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L568)

One or more test cases the judge uses to evaluate correctness.
At least one test case is required for the forge request to be accepted.
