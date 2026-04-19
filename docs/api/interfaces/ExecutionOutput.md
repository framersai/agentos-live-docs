# Interface: ExecutionOutput

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:92](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/sandbox/executor/ICodeSandbox.ts#L92)

Output from sandbox execution.

## Properties

### exitCode

> **exitCode**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:98](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/sandbox/executor/ICodeSandbox.ts#L98)

Exit code

***

### files?

> `optional` **files**: [`SandboxFile`](SandboxFile.md)[]

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:100](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/sandbox/executor/ICodeSandbox.ts#L100)

Output files generated

***

### stderr

> **stderr**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:96](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/sandbox/executor/ICodeSandbox.ts#L96)

Standard error

***

### stdout

> **stdout**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:94](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/sandbox/executor/ICodeSandbox.ts#L94)

Standard output
