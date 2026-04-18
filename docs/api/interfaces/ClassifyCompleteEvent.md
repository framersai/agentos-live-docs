# Interface: ClassifyCompleteEvent

Defined in: [packages/agentos/src/query-router/types.ts:866](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L866)

Emitted when query classification completes successfully.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:871](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L871)

Duration of classification in milliseconds.

***

### result

> **result**: [`ClassificationResult`](ClassificationResult.md)

Defined in: [packages/agentos/src/query-router/types.ts:869](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L869)

The classification result.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:873](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L873)

Timestamp when classification completed.

***

### type

> **type**: `"classify:complete"`

Defined in: [packages/agentos/src/query-router/types.ts:867](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L867)
