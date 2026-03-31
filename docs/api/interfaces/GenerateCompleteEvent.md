# Interface: GenerateCompleteEvent

Defined in: [packages/agentos/src/query-router/types.ts:1006](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1006)

Emitted when answer generation completes.

## Properties

### answerLength

> **answerLength**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1009](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1009)

Length of the generated answer in characters.

***

### citationCount

> **citationCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1011](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1011)

Number of source citations in the answer.

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1013](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1013)

Duration of generation in milliseconds.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1015](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1015)

Timestamp when generation completed.

***

### type

> **type**: `"generate:complete"`

Defined in: [packages/agentos/src/query-router/types.ts:1007](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1007)
