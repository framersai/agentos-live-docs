# Interface: NodeProviderAssignment

Defined in: [packages/agentos/src/orchestration/planning/types.ts:79](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planning/types.ts#L79)

Result of assigning a provider+model to a single node.

## Properties

### complexity

> **complexity**: `number`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:84](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planning/types.ts#L84)

Complexity score (0-1) used for balanced assignment.

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:82](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planning/types.ts#L82)

***

### nodeId

> **nodeId**: `string`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:80](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planning/types.ts#L80)

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:81](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planning/types.ts#L81)

***

### reason

> **reason**: `string`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:86](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/planning/types.ts#L86)

Human-readable reason for this assignment.
