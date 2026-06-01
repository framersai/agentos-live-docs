# Interface: ExecutionResult

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:121](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L121)

Result of code execution.

## Properties

### completedAt

> **completedAt**: `string`

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:139](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L139)

Timestamp when execution completed

***

### cpuTimeMs?

> `optional` **cpuTimeMs**: `number`

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:135](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L135)

CPU time used in milliseconds

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:131](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L131)

Execution duration in milliseconds

***

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:129](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L129)

Error message if execution failed

***

### executionId

> **executionId**: `string`

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:123](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L123)

Unique execution ID

***

### memoryUsedBytes?

> `optional` **memoryUsedBytes**: `number`

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:133](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L133)

Memory used in bytes

***

### output?

> `optional` **output**: [`ExecutionOutput`](ExecutionOutput.md)

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:127](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L127)

Output from execution

***

### securityEvents?

> `optional` **securityEvents**: [`SecurityEvent`](SecurityEvent.md)[]

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:147](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L147)

Security events detected

***

### startedAt

> **startedAt**: `string`

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:137](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L137)

Timestamp when execution started

***

### status

> **status**: [`ExecutionStatus`](../type-aliases/ExecutionStatus.md)

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:125](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L125)

Execution status

***

### truncated?

> `optional` **truncated**: `object`

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:141](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L141)

Whether execution was truncated due to limits

#### stderr?

> `optional` **stderr**: `boolean`

#### stdout?

> `optional` **stdout**: `boolean`

#### timeout?

> `optional` **timeout**: `boolean`
