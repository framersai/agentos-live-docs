# Interface: TurnEvent

Defined in: [apps/paracosm/src/engine/core/state.ts:208](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L208)

## Properties

### agentId?

> `optional` **agentId**: `string`

Defined in: [apps/paracosm/src/engine/core/state.ts:213](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L213)

***

### cause?

> `optional` **cause**: `string`

Defined in: [apps/paracosm/src/engine/core/state.ts:218](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L218)

For death events: the specific cause (natural causes, radiation
 cancer, starvation, despair, fatal fracture, accident: X). Lets
 downstream reporting break deaths down by cause instead of
 reporting a faceless total.

***

### data?

> `optional` **data**: `Record`\<`string`, `unknown`\>

Defined in: [apps/paracosm/src/engine/core/state.ts:219](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L219)

***

### description

> **description**: `string`

Defined in: [apps/paracosm/src/engine/core/state.ts:212](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L212)

***

### time

> **time**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:210](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L210)

***

### turn

> **turn**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:209](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L209)

***

### type

> **type**: `"crisis"` \| `"decision"` \| `"birth"` \| `"death"` \| `"promotion"` \| `"relationship"` \| `"tool_forge"` \| `"system"`

Defined in: [apps/paracosm/src/engine/core/state.ts:211](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L211)
