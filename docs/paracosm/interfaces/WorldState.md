# Interface: WorldState

Defined in: [types.ts:89](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L89)

Runtime world state with typed record bags. Not everything is a flat numeric resource.

## Properties

### capacities

> **capacities**: `Record`\<`string`, `number`\>

Defined in: [types.ts:93](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L93)

Capacity constraints: life support, housing

***

### environment

> **environment**: `Record`\<`string`, `number` \| `string` \| `boolean`\>

Defined in: [types.ts:99](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L99)

Environment conditions

***

### metrics

> **metrics**: `Record`\<`string`, `number`\>

Defined in: [types.ts:91](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L91)

Numeric gauges: food, power, water, population, morale

***

### politics

> **politics**: `Record`\<`string`, `number` \| `string` \| `boolean`\>

Defined in: [types.ts:97](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L97)

Political/social pressures

***

### statuses

> **statuses**: `Record`\<`string`, `string` \| `boolean`\>

Defined in: [types.ts:95](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L95)

Categorical state: governance status, faction alignment
