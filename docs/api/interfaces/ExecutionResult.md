# Interface: ExecutionResult

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:106](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/sandbox/executor/ICodeSandbox.ts#L106)

Result of code execution.

## Properties

### completedAt

> **completedAt**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:124](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/sandbox/executor/ICodeSandbox.ts#L124)

Timestamp when execution completed

***

### cpuTimeMs?

> `optional` **cpuTimeMs**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:120](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/sandbox/executor/ICodeSandbox.ts#L120)

CPU time used in milliseconds

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:116](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/sandbox/executor/ICodeSandbox.ts#L116)

Execution duration in milliseconds

***

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:114](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/sandbox/executor/ICodeSandbox.ts#L114)

Error message if execution failed

***

### executionId

> **executionId**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:108](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/sandbox/executor/ICodeSandbox.ts#L108)

Unique execution ID

***

### memoryUsedBytes?

> `optional` **memoryUsedBytes**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:118](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/sandbox/executor/ICodeSandbox.ts#L118)

Memory used in bytes

***

### output?

> `optional` **output**: [`ExecutionOutput`](ExecutionOutput.md)

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:112](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/sandbox/executor/ICodeSandbox.ts#L112)

Output from execution

***

### securityEvents?

> `optional` **securityEvents**: [`SecurityEvent`](SecurityEvent.md)[]

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:132](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/sandbox/executor/ICodeSandbox.ts#L132)

Security events detected

***

### startedAt

> **startedAt**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:122](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/sandbox/executor/ICodeSandbox.ts#L122)

Timestamp when execution started

***

### status

> **status**: [`ExecutionStatus`](../type-aliases/ExecutionStatus.md)

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:110](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/sandbox/executor/ICodeSandbox.ts#L110)

Execution status

***

### truncated?

> `optional` **truncated**: `object`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:126](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/sandbox/executor/ICodeSandbox.ts#L126)

Whether execution was truncated due to limits

#### stderr?

> `optional` **stderr**: `boolean`

#### stdout?

> `optional` **stdout**: `boolean`

#### timeout?

> `optional` **timeout**: `boolean`
