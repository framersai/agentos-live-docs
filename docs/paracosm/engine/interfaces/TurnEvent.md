# Interface: TurnEvent

Defined in: [engine/core/state.ts:195](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/state.ts#L195)

## Properties

### agentId?

> `optional` **agentId**: `string`

Defined in: [engine/core/state.ts:200](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/state.ts#L200)

***

### cause?

> `optional` **cause**: `string`

Defined in: [engine/core/state.ts:205](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/state.ts#L205)

For death events: the specific cause (natural causes, radiation
 cancer, starvation, despair, fatal fracture, accident: X). Lets
 downstream reporting break deaths down by cause instead of
 reporting a faceless total.

***

### data?

> `optional` **data**: `Record`\<`string`, `unknown`\>

Defined in: [engine/core/state.ts:206](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/state.ts#L206)

***

### description

> **description**: `string`

Defined in: [engine/core/state.ts:199](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/state.ts#L199)

***

### turn

> **turn**: `number`

Defined in: [engine/core/state.ts:196](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/state.ts#L196)

***

### type

> **type**: `"crisis"` \| `"decision"` \| `"birth"` \| `"death"` \| `"promotion"` \| `"relationship"` \| `"tool_forge"` \| `"system"`

Defined in: [engine/core/state.ts:198](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/state.ts#L198)

***

### year

> **year**: `number`

Defined in: [engine/core/state.ts:197](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/state.ts#L197)
