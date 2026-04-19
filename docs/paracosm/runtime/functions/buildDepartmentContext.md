# Function: buildDepartmentContext()

> **buildDepartmentContext**(`dept`, `state`, `scenario`, `researchPacket`, `previousTurns?`, `departmentPromptHook?`): `string`

Defined in: [runtime/departments.ts:17](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/departments.ts#L17)

## Parameters

### dept

`string`

### state

[`SimulationState`](../../engine/interfaces/SimulationState.md)

### scenario

[`Scenario`](../../engine/interfaces/Scenario.md)

### researchPacket

[`CrisisResearchPacket`](../interfaces/CrisisResearchPacket.md)

### previousTurns?

`DepartmentTurnMemory`[]

### departmentPromptHook?

(`ctx`) => `string`[]

## Returns

`string`
