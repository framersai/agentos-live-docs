# Interface: TurnEvent

Defined in: [apps/paracosm/src/engine/core/state.ts:203](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L203)

## Properties

### agentId?

> `optional` **agentId**: `string`

Defined in: [apps/paracosm/src/engine/core/state.ts:208](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L208)

***

### cause?

> `optional` **cause**: `string`

Defined in: [apps/paracosm/src/engine/core/state.ts:213](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L213)

For death events: the specific cause (natural causes, radiation
 cancer, starvation, despair, fatal fracture, accident: X). Lets
 downstream reporting break deaths down by cause instead of
 reporting a faceless total.

***

### data?

> `optional` **data**: `Record`\<`string`, `unknown`\>

Defined in: [apps/paracosm/src/engine/core/state.ts:214](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L214)

***

### description

> **description**: `string`

Defined in: [apps/paracosm/src/engine/core/state.ts:207](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L207)

***

### time

> **time**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:205](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L205)

***

### turn

> **turn**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:204](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L204)

***

### type

> **type**: `"crisis"` \| `"decision"` \| `"birth"` \| `"death"` \| `"promotion"` \| `"relationship"` \| `"tool_forge"` \| `"system"`

Defined in: [apps/paracosm/src/engine/core/state.ts:206](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L206)
