# Interface: PromptHookContext

Defined in: [apps/paracosm/src/engine/types.ts:263](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L263)

Context passed to the scenario department prompt hook.

## Properties

### department

> **department**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:264](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L264)

***

### researchPacket

> **researchPacket**: `object`

Defined in: [apps/paracosm/src/engine/types.ts:267](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L267)

#### canonicalFacts

> **canonicalFacts**: `object`[]

#### counterpoints

> **counterpoints**: `object`[]

#### departmentNotes

> **departmentNotes**: `Record`\<`string`, `string`\>

***

### scenario

> **scenario**: [`Scenario`](Scenario.md)

Defined in: [apps/paracosm/src/engine/types.ts:266](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L266)

***

### state

> **state**: [`SimulationState`](SimulationState.md)

Defined in: [apps/paracosm/src/engine/types.ts:265](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L265)
