# Interface: SandboxExecutionRequest

Defined in: [packages/agentos/src/emergent/types.ts:171](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L171)

Input to the sandbox executor for running a single sandboxed tool invocation.

## Properties

### allowlist

> **allowlist**: [`SandboxAPI`](../type-aliases/SandboxAPI.md)[]

Defined in: [packages/agentos/src/emergent/types.ts:185](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L185)

APIs the sandbox is permitted to call. Anything not listed is blocked.

***

### code

> **code**: `string`

Defined in: [packages/agentos/src/emergent/types.ts:175](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L175)

Source code of the sandboxed module (same format as `SandboxedToolSpec.code`).

***

### input

> **input**: `unknown`

Defined in: [packages/agentos/src/emergent/types.ts:180](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L180)

The argument object passed to the `run(input)` entry point.

***

### memoryMB

> **memoryMB**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:192](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L192)

Maximum heap memory in megabytes the sandbox process may consume.
The executor terminates the process if this limit is exceeded.

#### Default

```ts
128
```

***

### timeoutMs

> **timeoutMs**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:199](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L199)

Maximum wall-clock time in milliseconds before the sandbox is forcibly
killed and an error is returned.

#### Default

```ts
5000
```
