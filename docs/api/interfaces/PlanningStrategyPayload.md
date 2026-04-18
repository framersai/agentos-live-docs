# Interface: PlanningStrategyPayload

Defined in: [packages/agentos/src/extensions/types.ts:264](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L264)

Planning strategy payload for custom planning algorithms.
Strategies can override how plans are generated, refined, and executed.

## Properties

### description

> **description**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:268](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L268)

Strategy description

***

### generatePlan()

> **generatePlan**: (`goal`, `context`) => `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/extensions/types.ts:278](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L278)

The planning function to execute

#### Parameters

##### goal

`string`

##### context

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`unknown`\>

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:266](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L266)

Unique strategy name (e.g., 'tree-of-thought', 'reflexion', 'custom-heuristic')

***

### priority

> **priority**: `number`

Defined in: [packages/agentos/src/extensions/types.ts:270](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L270)

Priority order when multiple strategies match (higher = preferred)

***

### refinePlan()?

> `optional` **refinePlan**: (`plan`, `feedback`) => `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/extensions/types.ts:280](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L280)

Optional refinement function

#### Parameters

##### plan

`unknown`

##### feedback

`unknown`

#### Returns

`Promise`\<`unknown`\>

***

### shouldActivate()?

> `optional` **shouldActivate**: (`context`) => `boolean`

Defined in: [packages/agentos/src/extensions/types.ts:272](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L272)

Optional condition function to determine if this strategy should be used

#### Parameters

##### context

###### agentCapabilities

`string`[]

###### complexity

`number`

###### goal

`string`

#### Returns

`boolean`
