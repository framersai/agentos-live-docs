# Interface: ToolExecutionResult\<TOutput\>

Defined in: [packages/agentos/src/core/tools/ITool.ts:49](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/tools/ITool.ts#L49)

Defines the standardized outcome of a tool's execution.
It captures whether the execution was successful, the resulting output data,
or any error information if it failed.

## Interface

ToolExecutionResult

## Type Parameters

### TOutput

`TOutput` = `any`

The expected type of the `output` data if the tool executes successfully. Defaults to `any`.

## Properties

### contentType?

> `optional` **contentType**: `string`

Defined in: [packages/agentos/src/core/tools/ITool.ts:53](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/tools/ITool.ts#L53)

The MIME type of the `output` data.
Defaults to "application/json". Other common types include "text/plain", "image/png", etc.
This helps consumers of the tool result to correctly interpret the output.

***

### details?

> `optional` **details**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/tools/ITool.ts:54](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/tools/ITool.ts#L54)

An optional object for any additional details or metadata
about the execution or error. This can include things like error codes, stack traces (for debugging),
performance metrics, or other contextual information.

***

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/core/tools/ITool.ts:52](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/tools/ITool.ts#L52)

A human-readable error message if the execution failed (`success` is `false`).

***

### output?

> `optional` **output**: `TOutput`

Defined in: [packages/agentos/src/core/tools/ITool.ts:51](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/tools/ITool.ts#L51)

The output data from the tool if successful. The structure
of this data should ideally conform to the tool's `outputSchema` (if defined).

***

### success

> **success**: `boolean`

Defined in: [packages/agentos/src/core/tools/ITool.ts:50](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/tools/ITool.ts#L50)

Indicates whether the tool execution was successful. `true` for success, `false` for failure.
