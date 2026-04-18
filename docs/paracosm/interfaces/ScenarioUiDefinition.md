# Interface: ScenarioUiDefinition

Defined in: [types.ts:168](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L168)

Tells the dashboard how to render scenario-specific UI elements.

## Properties

### departmentIcons

> **departmentIcons**: `Record`\<`string`, `string`\>

Defined in: [types.ts:172](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L172)

***

### eventRenderers

> **eventRenderers**: `Record`\<`string`, \{ `color`: `string`; `icon`: `string`; \}\>

Defined in: [types.ts:173](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L173)

***

### headerMetrics

> **headerMetrics**: `object`[]

Defined in: [types.ts:169](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L169)

#### format

> **format**: `"number"` \| `"percent"` \| `"currency"` \| `"duration"`

#### id

> **id**: `string`

***

### reportSections

> **reportSections**: (`"departments"` \| `"crisis"` \| `"decision"` \| `"outcome"` \| `"quotes"` \| `"causality"`)[]

Defined in: [types.ts:171](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L171)

***

### setupSections

> **setupSections**: (`"leaders"` \| `"personnel"` \| `"resources"` \| `"departments"` \| `"events"` \| `"models"` \| `"advanced"`)[]

Defined in: [types.ts:174](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L174)

***

### tooltipFields

> **tooltipFields**: `string`[]

Defined in: [types.ts:170](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L170)
