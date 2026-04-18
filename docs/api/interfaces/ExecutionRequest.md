# Interface: ExecutionRequest

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:70](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L70)

Request to execute code in the sandbox.

## Properties

### args?

> `optional` **args**: `string`[]

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:80](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L80)

Command-line arguments

***

### code

> **code**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:76](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L76)

Code to execute

***

### config?

> `optional` **config**: `Partial`\<[`SandboxConfig`](SandboxConfig.md)\>

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:84](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L84)

Sandbox configuration overrides

***

### executionId?

> `optional` **executionId**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:72](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L72)

Unique execution ID

***

### files?

> `optional` **files**: [`SandboxFile`](SandboxFile.md)[]

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:82](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L82)

Input files

***

### language

> **language**: [`SandboxLanguage`](../type-aliases/SandboxLanguage.md)

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:74](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L74)

Programming language

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:86](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L86)

Metadata for tracking

***

### stdin?

> `optional` **stdin**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:78](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L78)

Input data (stdin)
