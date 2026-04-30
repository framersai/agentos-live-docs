# Interface: GenerateCompleteEvent

Defined in: [packages/agentos/src/query-router/types.ts:1031](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1031)

Emitted when answer generation completes.

## Properties

### answerLength

> **answerLength**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1034](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1034)

Length of the generated answer in characters.

***

### citationCount

> **citationCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1036](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1036)

Number of source citations in the answer.

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1038](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1038)

Duration of generation in milliseconds.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1040](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1040)

Timestamp when generation completed.

***

### type

> **type**: `"generate:complete"`

Defined in: [packages/agentos/src/query-router/types.ts:1032](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1032)
