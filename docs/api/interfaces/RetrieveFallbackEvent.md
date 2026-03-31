# Interface: RetrieveFallbackEvent

Defined in: [packages/agentos/src/query-router/types.ts:953](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/types.ts#L953)

Emitted when a retrieval fallback strategy is activated.

## Properties

### reason

> **reason**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:958](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/types.ts#L958)

Reason the fallback was triggered.

***

### strategy

> **strategy**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:956](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/types.ts#L956)

Name of the fallback strategy activated (e.g., 'keyword-fallback').

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:960](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/types.ts#L960)

Timestamp of the event.

***

### type

> **type**: `"retrieve:fallback"`

Defined in: [packages/agentos/src/query-router/types.ts:954](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/types.ts#L954)
