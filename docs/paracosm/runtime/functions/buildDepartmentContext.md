# Function: buildDepartmentContext()

> **buildDepartmentContext**(`dept`, `state`, `scenario`, `researchPacket`, `previousTurns?`, `departmentPromptHook?`): `string`

Defined in: [apps/paracosm/src/runtime/departments.ts:17](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/departments.ts#L17)

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
