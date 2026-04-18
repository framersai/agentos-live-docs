# Interface: SandboxConfig

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:32](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L32)

Configuration for the sandbox environment.

## Properties

### allowedPaths?

> `optional` **allowedPaths**: `string`[]

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:48](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L48)

Allowed filesystem paths (if allowFilesystem is true)

***

### allowFilesystem?

> `optional` **allowFilesystem**: `boolean`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:46](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L46)

Whether to allow filesystem access

***

### allowNetwork?

> `optional` **allowNetwork**: `boolean`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:44](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L44)

Whether to allow network access

***

### blockedModules?

> `optional` **blockedModules**: `string`[]

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:50](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L50)

Blocked imports/modules

***

### envVars?

> `optional` **envVars**: `Record`\<`string`, `string`\>

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:40](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L40)

Environment variables to inject

***

### maxCpuTimeMs?

> `optional` **maxCpuTimeMs**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:52](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L52)

Maximum CPU time in milliseconds

***

### maxMemoryBytes?

> `optional` **maxMemoryBytes**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:36](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L36)

Maximum memory in bytes

***

### maxOutputBytes?

> `optional` **maxOutputBytes**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:38](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L38)

Maximum output size in bytes

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:34](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L34)

Maximum execution time in milliseconds

***

### workingDir?

> `optional` **workingDir**: `string`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:42](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/sandbox/executor/ICodeSandbox.ts#L42)

Working directory for execution
