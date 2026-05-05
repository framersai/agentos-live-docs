# Interface: SandboxStats

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:167](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L167)

Statistics about sandbox usage.

## Properties

### avgDurationMs

> **avgDurationMs**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:179](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L179)

Average execution time

***

### avgMemoryBytes

> **avgMemoryBytes**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:181](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L181)

Average memory usage

***

### byLanguage

> **byLanguage**: `Record`\<[`SandboxLanguage`](../type-aliases/SandboxLanguage.md), `number`\>

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:183](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L183)

Executions by language

***

### failedExecutions

> **failedExecutions**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:173](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L173)

Failed executions

***

### killedExecutions

> **killedExecutions**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:177](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L177)

Killed executions

***

### securityEventsCount

> **securityEventsCount**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:185](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L185)

Security events count

***

### successfulExecutions

> **successfulExecutions**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:171](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L171)

Successful executions

***

### timedOutExecutions

> **timedOutExecutions**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:175](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L175)

Timed out executions

***

### totalExecutions

> **totalExecutions**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:169](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L169)

Total executions
