# Interface: ScenarioUiDefinition

Defined in: [types.ts:161](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L161)

Tells the dashboard how to render scenario-specific UI elements.

## Properties

### departmentIcons

> **departmentIcons**: `Record`\<`string`, `string`\>

Defined in: [types.ts:165](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L165)

***

### eventRenderers

> **eventRenderers**: `Record`\<`string`, \{ `color`: `string`; `icon`: `string`; \}\>

Defined in: [types.ts:166](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L166)

***

### headerMetrics

> **headerMetrics**: `object`[]

Defined in: [types.ts:162](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L162)

#### format

> **format**: `"number"` \| `"percent"` \| `"currency"` \| `"duration"`

#### id

> **id**: `string`

***

### reportSections

> **reportSections**: (`"departments"` \| `"crisis"` \| `"decision"` \| `"outcome"` \| `"quotes"` \| `"causality"`)[]

Defined in: [types.ts:164](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L164)

***

### setupSections

> **setupSections**: (`"leaders"` \| `"personnel"` \| `"resources"` \| `"departments"` \| `"events"` \| `"models"` \| `"advanced"`)[]

Defined in: [types.ts:167](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L167)

***

### tooltipFields

> **tooltipFields**: `string`[]

Defined in: [types.ts:163](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L163)
