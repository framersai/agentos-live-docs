# Interface: TurnPlannerDiscoveryConfig

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:24](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/turn-planner/TurnPlanner.ts#L24)

## Properties

### defaultKind?

> `optional` **defaultKind**: `CapabilityKind` \| `"any"`

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:27](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/turn-planner/TurnPlanner.ts#L27)

***

### defaultToolSelectionMode?

> `optional` **defaultToolSelectionMode**: [`ToolSelectionMode`](../type-aliases/ToolSelectionMode.md)

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:29](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/turn-planner/TurnPlanner.ts#L29)

***

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:25](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/turn-planner/TurnPlanner.ts#L25)

***

### includePromptContext?

> `optional` **includePromptContext**: `boolean`

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:28](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/turn-planner/TurnPlanner.ts#L28)

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:34](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/turn-planner/TurnPlanner.ts#L34)

Number of retry attempts after the initial discovery call.
Example: `1` = up to 2 total attempts.

***

### onlyAvailable?

> `optional` **onlyAvailable**: `boolean`

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:26](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/turn-planner/TurnPlanner.ts#L26)

***

### retryBackoffMs?

> `optional` **retryBackoffMs**: `number`

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:38](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/turn-planner/TurnPlanner.ts#L38)

Delay between discovery retries in milliseconds.
