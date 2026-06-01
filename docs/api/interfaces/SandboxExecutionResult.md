# Interface: SandboxExecutionResult

Defined in: [packages/agentos/src/cognition/emergent/types.ts:206](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L206)

Outcome of a single sandbox execution attempt.

## Properties

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:222](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L222)

Human-readable error description, present when `success` is `false`.
Includes timeout and thrown-exception cases. A future isolate-backed
runtime may also report memory-exceeded cases.

***

### executionTimeMs

> **executionTimeMs**: `number`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:228](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L228)

Actual wall-clock execution time in milliseconds.
Populated regardless of success/failure.

***

### memoryUsedBytes

> **memoryUsedBytes**: `number`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:234](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L234)

Observed heap delta for the sandbox execution in bytes.
Populated when the runtime can measure it; otherwise `0`.

***

### output?

> `optional` **output**: `unknown`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:215](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L215)

The resolved return value of `run()`, present only when `success` is `true`.

***

### success

> **success**: `boolean`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:210](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L210)

`true` when `run()` resolved without throwing and within resource limits.
