# Class: SimulationKernel

Defined in: [apps/paracosm/src/engine/core/kernel.ts:93](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L93)

## Constructors

### Constructor

> **new SimulationKernel**(`seed`, `leaderId`, `keyPersonnel`, `init?`): `SimulationKernel`

Defined in: [apps/paracosm/src/engine/core/kernel.ts:97](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L97)

#### Parameters

##### seed

`number`

##### leaderId

`string`

##### keyPersonnel

[`KeyPersonnel`](../../interfaces/KeyPersonnel.md)[]

##### init?

`SimulationInitOverrides` = `{}`

#### Returns

`SimulationKernel`

## Methods

### advanceTurn()

> **advanceTurn**(`nextTurn`, `nextTime`, `progressionHook?`): [`SimulationState`](../interfaces/SimulationState.md)

Defined in: [apps/paracosm/src/engine/core/kernel.ts:293](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L293)

Advance to the next turn. Runs between-turn progression.

#### Parameters

##### nextTurn

`number`

##### nextTime

`number`

##### progressionHook?

(`ctx`) => `void`

#### Returns

[`SimulationState`](../interfaces/SimulationState.md)

***

### applyAgentUpdates()

> **applyAgentUpdates**(`updates`): `void`

Defined in: [apps/paracosm/src/engine/core/kernel.ts:400](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L400)

Apply featured colonist updates from department reports.

#### Parameters

##### updates

`object`[]

#### Returns

`void`

***

### applyDrift()

> **applyDrift**(`commanderHexaco`, `outcome`, `timeDelta`): `void`

Defined in: [apps/paracosm/src/engine/core/kernel.ts:392](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L392)

Apply personality drift to all promoted colonists.

#### Parameters

##### commanderHexaco

[`HexacoProfile`](../interfaces/HexacoProfile.md)

##### outcome

[`TurnOutcome`](../type-aliases/TurnOutcome.md) | `null`

##### timeDelta

`number`

#### Returns

`void`

***

### applyPolicy()

> **applyPolicy**(`effect`): `void`

Defined in: [apps/paracosm/src/engine/core/kernel.ts:257](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L257)

Apply a policy effect from the commander's decision.

#### Parameters

##### effect

`PolicyEffect`

#### Returns

`void`

***

### applyPoliticsDeltas()

> **applyPoliticsDeltas**(`deltas`, `events?`): `void`

Defined in: [apps/paracosm/src/engine/core/kernel.ts:379](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L379)

Apply additive deltas to world politics.

#### Parameters

##### deltas

`Partial`\<[`WorldPolitics`](../interfaces/WorldPolitics.md)\>

##### events?

[`TurnEvent`](../interfaces/TurnEvent.md)[] = `[]`

#### Returns

`void`

***

### applySystemDeltas()

> **applySystemDeltas**(`deltas`, `events?`): `void`

Defined in: [apps/paracosm/src/engine/core/kernel.ts:362](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L362)

Apply additive deltas to world systems (not absolute values).

#### Parameters

##### deltas

`Partial`\<[`WorldMetrics`](../interfaces/WorldMetrics.md)\>

##### events?

[`TurnEvent`](../interfaces/TurnEvent.md)[] = `[]`

#### Returns

`void`

***

### export()

> **export**(): [`SimulationState`](../interfaces/SimulationState.md)

Defined in: [apps/paracosm/src/engine/core/kernel.ts:431](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L431)

#### Returns

[`SimulationState`](../interfaces/SimulationState.md)

***

### getAliveAgents()

> **getAliveAgents**(): [`Agent`](../interfaces/Agent.md)[]

Defined in: [apps/paracosm/src/engine/core/kernel.ts:237](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L237)

#### Returns

[`Agent`](../interfaces/Agent.md)[]

***

### getAliveCount()

> **getAliveCount**(): `number`

Defined in: [apps/paracosm/src/engine/core/kernel.ts:241](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L241)

#### Returns

`number`

***

### getCandidates()

> **getCandidates**(`dept`, `topN?`): [`Agent`](../interfaces/Agent.md)[]

Defined in: [apps/paracosm/src/engine/core/kernel.ts:323](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L323)

Get top N candidates for a department role, scored by trait fit.

#### Parameters

##### dept

`string`

##### topN?

`number` = `5`

#### Returns

[`Agent`](../interfaces/Agent.md)[]

***

### getDepartmentSummary()

> **getDepartmentSummary**(`dept`): `object`

Defined in: [apps/paracosm/src/engine/core/kernel.ts:245](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L245)

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

Defined in: [apps/paracosm/src/engine/core/kernel.ts:233](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L233)

#### Returns

[`Agent`](../interfaces/Agent.md)[]

***

### getState()

> **getState**(): [`SimulationState`](../interfaces/SimulationState.md)

Defined in: [apps/paracosm/src/engine/core/kernel.ts:162](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L162)

#### Returns

[`SimulationState`](../interfaces/SimulationState.md)

***

### promoteAgent()

> **promoteAgent**(`agentId`, `dept`, `role`, `promotedBy`): `void`

Defined in: [apps/paracosm/src/engine/core/kernel.ts:338](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L338)

Promote a colonist to a department head role.

#### Parameters

##### agentId

`string`

##### dept

`string`

##### role

`string`

##### promotedBy

`string`

#### Returns

`void`

***

### toSnapshot()

> **toSnapshot**(`scenarioId`): `KernelSnapshot`

Defined in: [apps/paracosm/src/engine/core/kernel.ts:175](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L175)

Capture a KernelSnapshot bundle. The returned object is
plain JSON-safe data: `JSON.stringify(snap)` + `JSON.parse` +
`SimulationKernel.fromSnapshot(parsed, scenarioId)` round-trips
to a new kernel in the same state. Used by
`WorldModel.snapshot()` + `fork()` for mid-run counterfactuals.

#### Parameters

##### scenarioId

`string`

Scenario id the snapshot is being taken
  against. Stamped into the snapshot so `fromSnapshot` can
  verify the target WorldModel's scenario matches.

#### Returns

`KernelSnapshot`

***

### fromSnapshot()

> `static` **fromSnapshot**(`snap`, `expectedScenarioId`): `SimulationKernel`

Defined in: [apps/paracosm/src/engine/core/kernel.ts:202](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/kernel.ts#L202)

Reverse of [SimulationKernel.toSnapshot](#tosnapshot). Constructs a
fresh kernel positioned at the snapshot's turn, with simulation
state + PRNG state + metadata fully restored. The returned
kernel is indistinguishable from the one that produced the
snapshot as far as subsequent `advanceTurn` calls are concerned.

#### Parameters

##### snap

`KernelSnapshot`

The captured snapshot.

##### expectedScenarioId

`string`

Scenario id the caller expects the
  snapshot to match. Throws when they differ; this is the gate
  against accidental cross-scenario forks.

#### Returns

`SimulationKernel`

#### Throws

Error when `snap.snapshotVersion !== 1` or when
  `snap.scenarioId !== expectedScenarioId`.
