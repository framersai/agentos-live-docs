# Interface: ExecutionOutput

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:92](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L92)

Output from sandbox execution.

## Properties

### exitCode

> **exitCode**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:98](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L98)

Exit code

***

### files?

> `optional` **files**: [`SandboxFile`](SandboxFile.md)[]

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:100](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L100)

Output files generated

***

### stderr

> **stderr**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:96](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L96)

Standard error

***

### stdout

> **stdout**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:94](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L94)

Standard output
