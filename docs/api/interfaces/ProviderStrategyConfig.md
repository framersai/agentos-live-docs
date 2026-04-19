# Interface: ProviderStrategyConfig

Defined in: [packages/agentos/src/orchestration/planning/types.ts:70](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planning/types.ts#L70)

Full provider strategy configuration.

## Properties

### assignments?

> `optional` **assignments**: `Record`\<`string`, [`ExplicitAssignment`](ExplicitAssignment.md)\>

Defined in: [packages/agentos/src/orchestration/planning/types.ts:73](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planning/types.ts#L73)

Map of nodeId/role → explicit provider assignment. `_default` applies to unmatched nodes.

***

### fallback?

> `optional` **fallback**: [`ProviderStrategyName`](../type-aliases/ProviderStrategyName.md)

Defined in: [packages/agentos/src/orchestration/planning/types.ts:75](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planning/types.ts#L75)

Fallback strategy for unmatched nodes in `mixed` mode.

***

### strategy

> **strategy**: [`ProviderStrategyName`](../type-aliases/ProviderStrategyName.md)

Defined in: [packages/agentos/src/orchestration/planning/types.ts:71](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planning/types.ts#L71)
