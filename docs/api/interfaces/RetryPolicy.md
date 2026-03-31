# Interface: RetryPolicy

Defined in: [packages/agentos/src/orchestration/ir/types.ts:231](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L231)

Governs automatic retry behaviour for transient node failures.

## Properties

### backoff

> **backoff**: `"exponential"` \| `"linear"` \| `"fixed"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:233](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L233)

Wait time growth strategy between attempts.

***

### backoffMs

> **backoffMs**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:234](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L234)

Base wait duration in milliseconds.

***

### maxAttempts

> **maxAttempts**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:232](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L232)

Total number of attempts (including the first).

***

### retryOn?

> `optional` **retryOn**: `string`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:235](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L235)

Optional allowlist of error codes/names that trigger retry.
                        When absent, all errors are retried up to `maxAttempts`.
