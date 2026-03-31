# Interface: RetryPolicy

Defined in: [packages/agentos/src/orchestration/ir/types.ts:269](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L269)

Governs automatic retry behaviour for transient node failures.

## Properties

### backoff

> **backoff**: `"exponential"` \| `"linear"` \| `"fixed"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:271](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L271)

Wait time growth strategy between attempts.

***

### backoffMs

> **backoffMs**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:272](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L272)

Base wait duration in milliseconds.

***

### maxAttempts

> **maxAttempts**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:270](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L270)

Total number of attempts (including the first).

***

### retryOn?

> `optional` **retryOn**: `string`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:273](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L273)

Optional allowlist of error codes/names that trigger retry.
                        When absent, all errors are retried up to `maxAttempts`.
