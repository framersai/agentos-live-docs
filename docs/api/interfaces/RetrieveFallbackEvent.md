# Interface: RetrieveFallbackEvent

Defined in: [packages/agentos/src/query-router/types.ts:939](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L939)

Emitted when a retrieval fallback strategy is activated.

## Properties

### reason

> **reason**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:944](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L944)

Reason the fallback was triggered.

***

### strategy

> **strategy**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:942](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L942)

Name of the fallback strategy activated (e.g., 'keyword-fallback').

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:946](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L946)

Timestamp of the event.

***

### type

> **type**: `"retrieve:fallback"`

Defined in: [packages/agentos/src/query-router/types.ts:940](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L940)
