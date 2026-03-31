# Interface: AgentOSTurnPlanningConfig

Defined in: [packages/agentos/src/api/AgentOS.ts:300](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/AgentOS.ts#L300)

## Extends

- [`TurnPlannerConfig`](TurnPlannerConfig.md)

## Properties

### allowRequestOverrides?

> `optional` **allowRequestOverrides**: `boolean`

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:44](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/turn-planner/TurnPlanner.ts#L44)

#### Inherited from

[`TurnPlannerConfig`](TurnPlannerConfig.md).[`allowRequestOverrides`](TurnPlannerConfig.md#allowrequestoverrides)

***

### defaultToolFailureMode?

> `optional` **defaultToolFailureMode**: [`ToolFailureMode`](../type-aliases/ToolFailureMode.md)

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:43](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/turn-planner/TurnPlanner.ts#L43)

#### Inherited from

[`TurnPlannerConfig`](TurnPlannerConfig.md).[`defaultToolFailureMode`](TurnPlannerConfig.md#defaulttoolfailuremode)

***

### discovery?

> `optional` **discovery**: [`TurnPlannerDiscoveryConfig`](TurnPlannerDiscoveryConfig.md) & `object`

Defined in: [packages/agentos/src/api/AgentOS.ts:301](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/AgentOS.ts#L301)

#### Type Declaration

##### autoInitializeEngine?

> `optional` **autoInitializeEngine**: `boolean`

When true, AgentOS automatically creates a capability discovery engine
using active tools/extensions/channels.

##### config?

> `optional` **config**: `Partial`\<`CapabilityDiscoveryConfig`\>

Optional low-level discovery engine tuning.

##### embeddingDimension?

> `optional` **embeddingDimension**: `number`

Optional embedding dimension override.

##### embeddingModelId?

> `optional` **embeddingModelId**: `string`

Optional override for discovery embedding model.

##### engine?

> `optional` **engine**: `ICapabilityDiscoveryEngine`

Optional pre-built discovery engine. If provided, AgentOS uses this and
skips auto-initialization.

##### registerMetaTool?

> `optional` **registerMetaTool**: `boolean`

Register the `discover_capabilities` meta-tool after engine initialization.

##### sources?

> `optional` **sources**: [`AgentOSCapabilityDiscoverySources`](AgentOSCapabilityDiscoverySources.md)

Optional explicit capability sources to merge with runtime-derived sources.

#### Overrides

[`TurnPlannerConfig`](TurnPlannerConfig.md).[`discovery`](TurnPlannerConfig.md#discovery)

***

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [packages/agentos/src/orchestration/turn-planner/TurnPlanner.ts:42](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/turn-planner/TurnPlanner.ts#L42)

#### Inherited from

[`TurnPlannerConfig`](TurnPlannerConfig.md).[`enabled`](TurnPlannerConfig.md#enabled)
