# Interface: SecurityEvent

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:138](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/ICodeSandbox.ts#L138)

Security event detected during execution.

## Properties

### description

> **description**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:142](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/ICodeSandbox.ts#L142)

Description of the event

***

### severity

> **severity**: `"critical"` \| `"low"` \| `"medium"` \| `"high"`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:146](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/ICodeSandbox.ts#L146)

Severity

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:144](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/ICodeSandbox.ts#L144)

Timestamp

***

### type

> **type**: `"resource_limit"` \| `"blocked_import"` \| `"blocked_syscall"` \| `"network_attempt"` \| `"filesystem_violation"`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:140](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/ICodeSandbox.ts#L140)

Event type
