# Interface: ScenarioUiDefinition

Defined in: [engine/types.ts:168](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L168)

Tells the dashboard how to render scenario-specific UI elements.

## Properties

### departmentIcons

> **departmentIcons**: `Record`\<`string`, `string`\>

Defined in: [engine/types.ts:172](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L172)

***

### eventRenderers

> **eventRenderers**: `Record`\<`string`, \{ `color`: `string`; `icon`: `string`; \}\>

Defined in: [engine/types.ts:173](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L173)

***

### headerMetrics

> **headerMetrics**: `object`[]

Defined in: [engine/types.ts:169](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L169)

#### format

> **format**: `"number"` \| `"percent"` \| `"currency"` \| `"duration"`

#### id

> **id**: `string`

***

### reportSections

> **reportSections**: (`"departments"` \| `"crisis"` \| `"decision"` \| `"outcome"` \| `"quotes"` \| `"causality"`)[]

Defined in: [engine/types.ts:171](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L171)

***

### setupSections

> **setupSections**: (`"leaders"` \| `"personnel"` \| `"resources"` \| `"departments"` \| `"events"` \| `"models"` \| `"advanced"`)[]

Defined in: [engine/types.ts:174](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L174)

***

### tooltipFields

> **tooltipFields**: `string`[]

Defined in: [engine/types.ts:170](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L170)
