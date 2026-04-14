# Interface: ClassifyErrorEvent

Defined in: [packages/agentos/src/query-router/types.ts:879](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L879)

Emitted when query classification fails.

## Properties

### error

> **error**: `Error`

Defined in: [packages/agentos/src/query-router/types.ts:882](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L882)

The error that caused classification to fail.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:884](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L884)

Timestamp when the error occurred.

***

### type

> **type**: `"classify:error"`

Defined in: [packages/agentos/src/query-router/types.ts:880](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L880)
