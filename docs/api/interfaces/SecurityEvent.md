# Interface: SecurityEvent

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:153](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L153)

Security event detected during execution.

## Properties

### description

> **description**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:157](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L157)

Description of the event

***

### severity

> **severity**: `"critical"` \| `"low"` \| `"medium"` \| `"high"`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:161](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L161)

Severity

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:159](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L159)

Timestamp

***

### type

> **type**: `"resource_limit"` \| `"blocked_import"` \| `"blocked_syscall"` \| `"network_attempt"` \| `"filesystem_violation"`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:155](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L155)

Event type
