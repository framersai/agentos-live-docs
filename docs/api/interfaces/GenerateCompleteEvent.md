# Interface: GenerateCompleteEvent

Defined in: [packages/agentos/src/query-router/types.ts:1020](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/types.ts#L1020)

Emitted when answer generation completes.

## Properties

### answerLength

> **answerLength**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1023](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/types.ts#L1023)

Length of the generated answer in characters.

***

### citationCount

> **citationCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1025](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/types.ts#L1025)

Number of source citations in the answer.

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1027](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/types.ts#L1027)

Duration of generation in milliseconds.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1029](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/types.ts#L1029)

Timestamp when generation completed.

***

### type

> **type**: `"generate:complete"`

Defined in: [packages/agentos/src/query-router/types.ts:1021](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/types.ts#L1021)
