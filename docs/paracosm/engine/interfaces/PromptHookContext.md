# Interface: PromptHookContext

Defined in: [engine/types.ts:246](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L246)

Context passed to the scenario department prompt hook.

## Properties

### department

> **department**: `string`

Defined in: [engine/types.ts:247](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L247)

***

### researchPacket

> **researchPacket**: `object`

Defined in: [engine/types.ts:250](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L250)

#### canonicalFacts

> **canonicalFacts**: `object`[]

#### counterpoints

> **counterpoints**: `object`[]

#### departmentNotes

> **departmentNotes**: `Record`\<`string`, `string`\>

***

### scenario

> **scenario**: [`Scenario`](Scenario.md)

Defined in: [engine/types.ts:249](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L249)

***

### state

> **state**: [`SimulationState`](SimulationState.md)

Defined in: [engine/types.ts:248](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/types.ts#L248)
