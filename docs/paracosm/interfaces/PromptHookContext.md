# Interface: PromptHookContext

Defined in: [types.ts:239](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L239)

Context passed to the scenario department prompt hook.

## Properties

### department

> **department**: `string`

Defined in: [types.ts:240](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L240)

***

### researchPacket

> **researchPacket**: `object`

Defined in: [types.ts:243](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L243)

#### canonicalFacts

> **canonicalFacts**: `object`[]

#### counterpoints

> **counterpoints**: `object`[]

#### departmentNotes

> **departmentNotes**: `Record`\<`string`, `string`\>

***

### scenario

> **scenario**: [`Scenario`](Scenario.md)

Defined in: [types.ts:242](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L242)

***

### state

> **state**: [`SimulationState`](SimulationState.md)

Defined in: [types.ts:241](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L241)
