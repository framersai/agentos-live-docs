# Interface: WorldState

Defined in: [types.ts:82](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L82)

Runtime world state with typed record bags. Not everything is a flat numeric resource.

## Properties

### capacities

> **capacities**: `Record`\<`string`, `number`\>

Defined in: [types.ts:86](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L86)

Capacity constraints: life support, housing

***

### environment

> **environment**: `Record`\<`string`, `number` \| `string` \| `boolean`\>

Defined in: [types.ts:92](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L92)

Environment conditions

***

### metrics

> **metrics**: `Record`\<`string`, `number`\>

Defined in: [types.ts:84](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L84)

Numeric gauges: food, power, water, population, morale

***

### politics

> **politics**: `Record`\<`string`, `number` \| `string` \| `boolean`\>

Defined in: [types.ts:90](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L90)

Political/social pressures

***

### statuses

> **statuses**: `Record`\<`string`, `string` \| `boolean`\>

Defined in: [types.ts:88](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L88)

Categorical state: governance status, faction alignment
