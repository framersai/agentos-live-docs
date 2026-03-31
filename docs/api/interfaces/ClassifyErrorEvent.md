# Interface: ClassifyErrorEvent

Defined in: [packages/agentos/src/query-router/types.ts:865](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L865)

Emitted when query classification fails.

## Properties

### error

> **error**: `Error`

Defined in: [packages/agentos/src/query-router/types.ts:868](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L868)

The error that caused classification to fail.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:870](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L870)

Timestamp when the error occurred.

***

### type

> **type**: `"classify:error"`

Defined in: [packages/agentos/src/query-router/types.ts:866](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L866)
