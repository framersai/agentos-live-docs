# Interface: SandboxExecutionRequest

Defined in: [packages/agentos/src/cognition/emergent/types.ts:171](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L171)

Input to the sandbox executor for running a single sandboxed tool invocation.

## Properties

### allowlist

> **allowlist**: [`SandboxAPI`](../type-aliases/SandboxAPI.md)[]

Defined in: [packages/agentos/src/cognition/emergent/types.ts:185](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L185)

APIs the sandbox is permitted to call. Anything not listed is blocked.

***

### code

> **code**: `string`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:175](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L175)

Source code of the sandboxed module (same format as `SandboxedToolSpec.code`).

***

### input

> **input**: `unknown`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:180](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L180)

The argument object passed to the `run(input)` entry point.

***

### memoryMB

> **memoryMB**: `number`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:193](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L193)

Nominal heap budget in megabytes for the sandbox execution.
The current node:vm-backed JavaScript executor reports heap deltas but does
not preemptively enforce this limit.

#### Default

```ts
128
```

***

### timeoutMs

> **timeoutMs**: `number`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:200](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L200)

Maximum wall-clock time in milliseconds before the sandbox is forcibly
killed and an error is returned.

#### Default

```ts
5000
```
