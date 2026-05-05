# Function: buildDepartmentContext()

> **buildDepartmentContext**(`dept`, `state`, `scenario`, `researchPacket`, `previousTurns?`, `departmentPromptHook?`): `string`

Defined in: [apps/paracosm/src/runtime/departments.ts:17](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/departments.ts#L17)

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
