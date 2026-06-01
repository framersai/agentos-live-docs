# Interface: ExecutionOutput

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:107](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L107)

Output from sandbox execution.

## Properties

### exitCode

> **exitCode**: `number`

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:113](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L113)

Exit code

***

### files?

> `optional` **files**: [`SandboxFile`](SandboxFile.md)[]

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:115](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L115)

Output files generated

***

### stderr

> **stderr**: `string`

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:111](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L111)

Standard error

***

### stdout

> **stdout**: `string`

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:109](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L109)

Standard output
