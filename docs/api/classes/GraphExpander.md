# Class: GraphExpander

Defined in: [packages/agentos/src/orchestration/planning/GraphExpander.ts:32](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planning/GraphExpander.ts#L32)

Applies GraphPatch modifications atomically to a CompiledExecutionGraph.
Checks guardrail thresholds before approving expansions in guardrailed mode.

## Constructors

### Constructor

> **new GraphExpander**(`thresholds`): `GraphExpander`

Defined in: [packages/agentos/src/orchestration/planning/GraphExpander.ts:35](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planning/GraphExpander.ts#L35)

#### Parameters

##### thresholds

[`GuardrailThresholds`](../interfaces/GuardrailThresholds.md)

#### Returns

`GraphExpander`

## Methods

### applyPatch()

> **applyPatch**(`graph`, `patch`): [`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

Defined in: [packages/agentos/src/orchestration/planning/GraphExpander.ts:43](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planning/GraphExpander.ts#L43)

Apply a patch to a graph, returning a new graph (immutable).
Patches are applied atomically — all changes happen together.

#### Parameters

##### graph

[`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

##### patch

[`MissionGraphPatch`](../interfaces/MissionGraphPatch.md)

#### Returns

[`CompiledExecutionGraph`](../interfaces/CompiledExecutionGraph.md)

***

### getExceededThreshold()

> **getExceededThreshold**(`state`): \{ `cap`: `number`; `threshold`: `string`; `value`: `number`; \} \| `null`

Defined in: [packages/agentos/src/orchestration/planning/GraphExpander.ts:108](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planning/GraphExpander.ts#L108)

Identify which specific threshold was exceeded.
Returns null if no threshold is exceeded.

#### Parameters

##### state

`ExpansionState`

#### Returns

\{ `cap`: `number`; `threshold`: `string`; `value`: `number`; \} \| `null`

***

### shouldAutoApprove()

> **shouldAutoApprove**(`autonomy`, `state`): `boolean`

Defined in: [packages/agentos/src/orchestration/planning/GraphExpander.ts:85](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/planning/GraphExpander.ts#L85)

Determine whether an expansion should be auto-approved
based on autonomy mode and resource thresholds.

- autonomous: always approve
- guided: never auto-approve (requires user input)
- guardrailed: approve if below all thresholds

#### Parameters

##### autonomy

[`AutonomyMode`](../type-aliases/AutonomyMode.md)

##### state

`ExpansionState`

#### Returns

`boolean`
