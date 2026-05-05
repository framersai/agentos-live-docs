# Interface: RetrieveFallbackEvent

Defined in: [packages/agentos/src/query-router/types.ts:964](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L964)

Emitted when a retrieval fallback strategy is activated.

## Properties

### reason

> **reason**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:969](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L969)

Reason the fallback was triggered.

***

### strategy

> **strategy**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:967](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L967)

Name of the fallback strategy activated (e.g., 'keyword-fallback').

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:971](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L971)

Timestamp of the event.

***

### type

> **type**: `"retrieve:fallback"`

Defined in: [packages/agentos/src/query-router/types.ts:965](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L965)
