# Interface: FunctionCallResult

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:421](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L421)

Result of a single function call.

## Properties

### arguments

> **arguments**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:426](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L426)

Arguments passed to the function

***

### argumentsValid

> **argumentsValid**: `boolean`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:429](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L429)

Whether arguments validated against schema

***

### callId

> **callId**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:441](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L441)

Unique ID for this call (for multi-turn conversations)

***

### executionError?

> `optional` **executionError**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:438](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L438)

Error during execution (if any)

***

### executionResult?

> `optional` **executionResult**: `unknown`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:435](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L435)

Result of executing the function (if handler provided)

***

### functionName

> **functionName**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:423](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L423)

Function that was called

***

### validationErrors?

> `optional` **validationErrors**: [`ValidationIssue`](ValidationIssue.md)[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:432](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/structured/output/IStructuredOutputManager.ts#L432)

Validation errors for arguments
