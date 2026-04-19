# Interface: SandboxStats

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:152](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/sandbox/executor/ICodeSandbox.ts#L152)

Statistics about sandbox usage.

## Properties

### avgDurationMs

> **avgDurationMs**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:164](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/sandbox/executor/ICodeSandbox.ts#L164)

Average execution time

***

### avgMemoryBytes

> **avgMemoryBytes**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:166](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/sandbox/executor/ICodeSandbox.ts#L166)

Average memory usage

***

### byLanguage

> **byLanguage**: `Record`\<[`SandboxLanguage`](../type-aliases/SandboxLanguage.md), `number`\>

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:168](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/sandbox/executor/ICodeSandbox.ts#L168)

Executions by language

***

### failedExecutions

> **failedExecutions**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:158](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/sandbox/executor/ICodeSandbox.ts#L158)

Failed executions

***

### killedExecutions

> **killedExecutions**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:162](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/sandbox/executor/ICodeSandbox.ts#L162)

Killed executions

***

### securityEventsCount

> **securityEventsCount**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:170](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/sandbox/executor/ICodeSandbox.ts#L170)

Security events count

***

### successfulExecutions

> **successfulExecutions**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:156](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/sandbox/executor/ICodeSandbox.ts#L156)

Successful executions

***

### timedOutExecutions

> **timedOutExecutions**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:160](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/sandbox/executor/ICodeSandbox.ts#L160)

Timed out executions

***

### totalExecutions

> **totalExecutions**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:154](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/sandbox/executor/ICodeSandbox.ts#L154)

Total executions
