# Interface: ClassifyCompleteEvent

Defined in: [packages/agentos/src/query-router/types.ts:852](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L852)

Emitted when query classification completes successfully.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:857](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L857)

Duration of classification in milliseconds.

***

### result

> **result**: [`ClassificationResult`](ClassificationResult.md)

Defined in: [packages/agentos/src/query-router/types.ts:855](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L855)

The classification result.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:859](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L859)

Timestamp when classification completed.

***

### type

> **type**: `"classify:complete"`

Defined in: [packages/agentos/src/query-router/types.ts:853](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L853)
