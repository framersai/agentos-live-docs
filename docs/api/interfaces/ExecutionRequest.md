# Interface: ExecutionRequest

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:85](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L85)

Request to execute code in the sandbox.

## Properties

### args?

> `optional` **args**: `string`[]

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:95](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L95)

Command-line arguments

***

### code

> **code**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:91](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L91)

Code to execute

***

### config?

> `optional` **config**: `Partial`\<[`SandboxConfig`](SandboxConfig.md)\>

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:99](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L99)

Sandbox configuration overrides

***

### executionId?

> `optional` **executionId**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:87](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L87)

Unique execution ID

***

### files?

> `optional` **files**: [`SandboxFile`](SandboxFile.md)[]

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:97](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L97)

Input files

***

### language

> **language**: [`SandboxLanguage`](../type-aliases/SandboxLanguage.md)

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:89](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L89)

Programming language

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:101](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L101)

Metadata for tracking

***

### stdin?

> `optional` **stdin**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:93](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/sandbox/executor/ICodeSandbox.ts#L93)

Input data (stdin)
