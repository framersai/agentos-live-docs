# Interface: TurnEvent

Defined in: [core/state.ts:195](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/core/state.ts#L195)

## Properties

### agentId?

> `optional` **agentId**: `string`

Defined in: [core/state.ts:200](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/core/state.ts#L200)

***

### cause?

> `optional` **cause**: `string`

Defined in: [core/state.ts:205](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/core/state.ts#L205)

For death events: the specific cause (natural causes, radiation
 cancer, starvation, despair, fatal fracture, accident: X). Lets
 downstream reporting break deaths down by cause instead of
 reporting a faceless total.

***

### data?

> `optional` **data**: `Record`\<`string`, `unknown`\>

Defined in: [core/state.ts:206](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/core/state.ts#L206)

***

### description

> **description**: `string`

Defined in: [core/state.ts:199](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/core/state.ts#L199)

***

### turn

> **turn**: `number`

Defined in: [core/state.ts:196](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/core/state.ts#L196)

***

### type

> **type**: `"crisis"` \| `"decision"` \| `"birth"` \| `"death"` \| `"promotion"` \| `"relationship"` \| `"tool_forge"` \| `"system"`

Defined in: [core/state.ts:198](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/core/state.ts#L198)

***

### year

> **year**: `number`

Defined in: [core/state.ts:197](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/core/state.ts#L197)
