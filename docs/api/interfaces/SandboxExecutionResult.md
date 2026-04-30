# Interface: SandboxExecutionResult

Defined in: [packages/agentos/src/emergent/types.ts:205](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/types.ts#L205)

Outcome of a single sandbox execution attempt.

## Properties

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/emergent/types.ts:220](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/types.ts#L220)

Human-readable error description, present when `success` is `false`.
Includes timeout, memory-exceeded, and thrown-exception cases.

***

### executionTimeMs

> **executionTimeMs**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:226](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/types.ts#L226)

Actual wall-clock execution time in milliseconds.
Populated regardless of success/failure.

***

### memoryUsedBytes

> **memoryUsedBytes**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:232](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/types.ts#L232)

Peak heap memory used by the sandbox process in bytes.
Populated when the runtime can measure it; otherwise `0`.

***

### output?

> `optional` **output**: `unknown`

Defined in: [packages/agentos/src/emergent/types.ts:214](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/types.ts#L214)

The resolved return value of `run()`, present only when `success` is `true`.

***

### success

> **success**: `boolean`

Defined in: [packages/agentos/src/emergent/types.ts:209](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/types.ts#L209)

`true` when `run()` resolved without throwing and within resource limits.
