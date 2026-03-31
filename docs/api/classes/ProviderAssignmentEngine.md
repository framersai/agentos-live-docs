# Class: ProviderAssignmentEngine

Defined in: [packages/agentos/src/orchestration/planning/ProviderAssignmentEngine.ts:41](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planning/ProviderAssignmentEngine.ts#L41)

Assigns LLM providers and models to graph nodes based on strategy.

## Constructors

### Constructor

> **new ProviderAssignmentEngine**(`availableProviders`): `ProviderAssignmentEngine`

Defined in: [packages/agentos/src/orchestration/planning/ProviderAssignmentEngine.ts:45](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planning/ProviderAssignmentEngine.ts#L45)

#### Parameters

##### availableProviders

`string`[]

#### Returns

`ProviderAssignmentEngine`

## Methods

### assign()

> **assign**(`nodes`, `config`): [`NodeProviderAssignment`](../interfaces/NodeProviderAssignment.md)[]

Defined in: [packages/agentos/src/orchestration/planning/ProviderAssignmentEngine.ts:57](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planning/ProviderAssignmentEngine.ts#L57)

Assign providers/models to all nodes in a graph.

#### Parameters

##### nodes

`AnnotatedNode`[]

Graph nodes, optionally annotated with `complexity` (0-1).

##### config

[`ProviderStrategyConfig`](../interfaces/ProviderStrategyConfig.md)

Strategy configuration.

#### Returns

[`NodeProviderAssignment`](../interfaces/NodeProviderAssignment.md)[]

***

### checkAvailability()

> **checkAvailability**(`assignments`): `object`

Defined in: [packages/agentos/src/orchestration/planning/ProviderAssignmentEngine.ts:77](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/planning/ProviderAssignmentEngine.ts#L77)

Check whether all required providers are available (have API keys).

#### Parameters

##### assignments

[`NodeProviderAssignment`](../interfaces/NodeProviderAssignment.md)[]

#### Returns

`object`

##### available

> **available**: `boolean`

##### missing

> **missing**: `string`[]
