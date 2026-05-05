# Interface: ScenarioUiDefinition

Defined in: [apps/paracosm/src/engine/types.ts:185](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L185)

Tells the dashboard how to render scenario-specific UI elements.

## Properties

### departmentIcons

> **departmentIcons**: `Record`\<`string`, `string`\>

Defined in: [apps/paracosm/src/engine/types.ts:189](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L189)

***

### eventRenderers

> **eventRenderers**: `Record`\<`string`, \{ `color`: `string`; `icon`: `string`; \}\>

Defined in: [apps/paracosm/src/engine/types.ts:190](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L190)

***

### headerMetrics

> **headerMetrics**: `object`[]

Defined in: [apps/paracosm/src/engine/types.ts:186](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L186)

#### format

> **format**: `"number"` \| `"percent"` \| `"currency"` \| `"duration"`

#### id

> **id**: `string`

***

### reportSections

> **reportSections**: (`"departments"` \| `"crisis"` \| `"decision"` \| `"outcome"` \| `"quotes"` \| `"causality"`)[]

Defined in: [apps/paracosm/src/engine/types.ts:188](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L188)

***

### setupSections

> **setupSections**: (`"actors"` \| `"personnel"` \| `"resources"` \| `"departments"` \| `"events"` \| `"models"` \| `"advanced"`)[]

Defined in: [apps/paracosm/src/engine/types.ts:191](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L191)

***

### tooltipFields

> **tooltipFields**: `string`[]

Defined in: [apps/paracosm/src/engine/types.ts:187](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L187)
