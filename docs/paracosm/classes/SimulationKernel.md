# Class: SimulationKernel

Defined in: [core/kernel.ts:30](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/kernel.ts#L30)

## Constructors

### Constructor

> **new SimulationKernel**(`seed`, `leaderId`, `keyPersonnel`, `init?`): `SimulationKernel`

Defined in: [core/kernel.ts:34](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/kernel.ts#L34)

#### Parameters

##### seed

`number`

##### leaderId

`string`

##### keyPersonnel

[`KeyPersonnel`](../interfaces/KeyPersonnel.md)[]

##### init?

[`SimulationInitOverrides`](../interfaces/SimulationInitOverrides.md) = `{}`

#### Returns

`SimulationKernel`

## Methods

### advanceTurn()

> **advanceTurn**(`nextTurn`, `nextYear`, `progressionHook?`): [`SimulationState`](../interfaces/SimulationState.md)

Defined in: [core/kernel.ts:130](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/kernel.ts#L130)

Advance to the next turn. Runs between-turn progression.

#### Parameters

##### nextTurn

`number`

##### nextYear

`number`

##### progressionHook?

(`ctx`) => `void`

#### Returns

[`SimulationState`](../interfaces/SimulationState.md)

***

### applyAgentUpdates()

> **applyAgentUpdates**(`updates`): `void`

Defined in: [core/kernel.ts:237](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/kernel.ts#L237)

Apply featured colonist updates from department reports.

#### Parameters

##### updates

`object`[]

#### Returns

`void`

***

### applyColonyDeltas()

> **applyColonyDeltas**(`deltas`, `events?`): `void`

Defined in: [core/kernel.ts:199](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/kernel.ts#L199)

Apply additive deltas to colony systems (not absolute values).

#### Parameters

##### deltas

`Partial`\<[`WorldSystems`](../interfaces/WorldSystems.md)\>

##### events?

[`TurnEvent`](../interfaces/TurnEvent.md)[] = `[]`

#### Returns

`void`

***

### applyDrift()

> **applyDrift**(`commanderHexaco`, `outcome`, `yearDelta`): `void`

Defined in: [core/kernel.ts:229](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/kernel.ts#L229)

Apply personality drift to all promoted colonists.

#### Parameters

##### commanderHexaco

[`HexacoProfile`](../interfaces/HexacoProfile.md)

##### outcome

[`TurnOutcome`](../type-aliases/TurnOutcome.md) | `null`

##### yearDelta

`number`

#### Returns

`void`

***

### applyPolicy()

> **applyPolicy**(`effect`): `void`

Defined in: [core/kernel.ts:94](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/kernel.ts#L94)

Apply a policy effect from the commander's decision.

#### Parameters

##### effect

[`PolicyEffect`](../interfaces/PolicyEffect.md)

#### Returns

`void`

***

### applyPoliticsDeltas()

> **applyPoliticsDeltas**(`deltas`, `events?`): `void`

Defined in: [core/kernel.ts:216](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/kernel.ts#L216)

Apply additive deltas to colony politics.

#### Parameters

##### deltas

`Partial`\<[`WorldPolitics`](../interfaces/WorldPolitics.md)\>

##### events?

[`TurnEvent`](../interfaces/TurnEvent.md)[] = `[]`

#### Returns

`void`

***

### export()

> **export**(): [`SimulationState`](../interfaces/SimulationState.md)

Defined in: [core/kernel.ts:268](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/kernel.ts#L268)

#### Returns

[`SimulationState`](../interfaces/SimulationState.md)

***

### getAliveAgents()

> **getAliveAgents**(): [`Agent`](../interfaces/Agent.md)[]

Defined in: [core/kernel.ts:74](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/kernel.ts#L74)

#### Returns

[`Agent`](../interfaces/Agent.md)[]

***

### getAliveCount()

> **getAliveCount**(): `number`

Defined in: [core/kernel.ts:78](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/kernel.ts#L78)

#### Returns

`number`

***

### getCandidates()

> **getCandidates**(`dept`, `topN?`): [`Agent`](../interfaces/Agent.md)[]

Defined in: [core/kernel.ts:160](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/kernel.ts#L160)

Get top N candidates for a department role, scored by trait fit.

#### Parameters

##### dept

[`Department`](../type-aliases/Department.md)

##### topN?

`number` = `5`

#### Returns

[`Agent`](../interfaces/Agent.md)[]

***

### getDepartmentSummary()

> **getDepartmentSummary**(`dept`): `object`

Defined in: [core/kernel.ts:82](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/kernel.ts#L82)

#### Parameters

##### dept

`string`

#### Returns

`object`

##### avgBoneDensity

> **avgBoneDensity**: `number` = `0`

##### avgMorale

> **avgMorale**: `number` = `0`

##### avgRadiation

> **avgRadiation**: `number` = `0`

##### count

> **count**: `number` = `0`

***

### getFeaturedAgents()

> **getFeaturedAgents**(): [`Agent`](../interfaces/Agent.md)[]

Defined in: [core/kernel.ts:70](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/kernel.ts#L70)

#### Returns

[`Agent`](../interfaces/Agent.md)[]

***

### getState()

> **getState**(): [`SimulationState`](../interfaces/SimulationState.md)

Defined in: [core/kernel.ts:66](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/kernel.ts#L66)

#### Returns

[`SimulationState`](../interfaces/SimulationState.md)

***

### promoteAgent()

> **promoteAgent**(`agentId`, `dept`, `role`, `promotedBy`): `void`

Defined in: [core/kernel.ts:175](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/kernel.ts#L175)

Promote a colonist to a department head role.

#### Parameters

##### agentId

`string`

##### dept

[`Department`](../type-aliases/Department.md)

##### role

`string`

##### promotedBy

`string`

#### Returns

`void`
