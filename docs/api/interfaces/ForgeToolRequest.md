# Interface: ForgeToolRequest

Defined in: [packages/agentos/src/emergent/types.ts:534](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L534)

Request payload for the `forge_tool` system tool.

An agent submits this to request the creation of a new emergent tool. The
engine validates the request, runs the judge, and returns a [ForgeResult](ForgeResult.md).

## Properties

### description

> **description**: `string`

Defined in: [packages/agentos/src/emergent/types.ts:545](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L545)

Natural language description of the tool's purpose and behaviour.
Used verbatim as the tool's description in the LLM tool list.

***

### implementation

> **implementation**: [`ToolImplementation`](../type-aliases/ToolImplementation.md)

Defined in: [packages/agentos/src/emergent/types.ts:560](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L560)

Implementation specification — composable pipeline or sandboxed code.

***

### inputSchema

> **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/emergent/types.ts:550](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L550)

JSON Schema for the tool's input arguments.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/emergent/types.ts:539](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L539)

Desired machine-readable name for the new tool.
Must be unique among tools currently visible to the requesting agent.

***

### outputSchema

> **outputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/emergent/types.ts:555](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L555)

JSON Schema for the tool's expected output.

***

### testCases

> **testCases**: \[[`ForgeTestCase`](ForgeTestCase.md), `...ForgeTestCase[]`\]

Defined in: [packages/agentos/src/emergent/types.ts:566](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L566)

One or more test cases the judge uses to evaluate correctness.
At least one test case is required for the forge request to be accepted.
