# Interface: WorldState

Defined in: [engine/types.ts:89](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L89)

Runtime world state with typed record bags. Not everything is a flat numeric resource.

## Properties

### capacities

> **capacities**: `Record`\<`string`, `number`\>

Defined in: [engine/types.ts:93](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L93)

Capacity constraints: life support, housing

***

### environment

> **environment**: `Record`\<`string`, `number` \| `string` \| `boolean`\>

Defined in: [engine/types.ts:99](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L99)

Environment conditions

***

### metrics

> **metrics**: `Record`\<`string`, `number`\>

Defined in: [engine/types.ts:91](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L91)

Numeric gauges: food, power, water, population, morale

***

### politics

> **politics**: `Record`\<`string`, `number` \| `string` \| `boolean`\>

Defined in: [engine/types.ts:97](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L97)

Political/social pressures

***

### statuses

> **statuses**: `Record`\<`string`, `string` \| `boolean`\>

Defined in: [engine/types.ts:95](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L95)

Categorical state: governance status, faction alignment
