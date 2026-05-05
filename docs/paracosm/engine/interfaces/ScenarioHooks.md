# Interface: ScenarioHooks

Defined in: [apps/paracosm/src/engine/types.ts:277](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L277)

Lifecycle hooks that a scenario provides to inject domain-specific behavior
into the generic engine. All hooks are optional.

## Properties

### departmentPromptHook()?

> `optional` **departmentPromptHook**: (`ctx`) => `string`[]

Defined in: [apps/paracosm/src/engine/types.ts:281](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L281)

Builds department-specific prompt context lines for LLM department agents

#### Parameters

##### ctx

[`PromptHookContext`](PromptHookContext.md)

#### Returns

`string`[]

***

### directorInstructions()?

> `optional` **directorInstructions**: () => `string`

Defined in: [apps/paracosm/src/engine/types.ts:283](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L283)

Returns the Event Director's system instructions for this scenario

#### Returns

`string`

***

### directorPromptHook()?

> `optional` **directorPromptHook**: (`ctx`) => `string`

Defined in: [apps/paracosm/src/engine/types.ts:285](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L285)

Builds the Event Director's per-turn context prompt

#### Parameters

##### ctx

`Record`\<`string`, `unknown`\>

#### Returns

`string`

***

### fingerprintHook()?

> `optional` **fingerprintHook**: (`finalState`, `outcomeLog`, `leader`, `toolRegs`, `maxTurns`) => `Record`\<`string`, `string`\>

Defined in: [apps/paracosm/src/engine/types.ts:289](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L289)

Computes a timeline fingerprint classification from final simulation state

#### Parameters

##### finalState

[`SimulationState`](SimulationState.md)

##### outcomeLog

`object`[]

##### leader

[`ActorConfig`](ActorConfig.md)

##### toolRegs

`Record`\<`string`, `string`[]\>

##### maxTurns

`number`

#### Returns

`Record`\<`string`, `string`\>

***

### getMilestoneEvent()?

> `optional` **getMilestoneEvent**: (`turn`, `maxTurns`) => [`MilestoneEventDef`](MilestoneEventDef.md) \| `null`

Defined in: [apps/paracosm/src/engine/types.ts:291](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L291)

Returns a milestone event for narrative anchor turns (turn 1, final turn)

#### Parameters

##### turn

`number`

##### maxTurns

`number`

#### Returns

[`MilestoneEventDef`](MilestoneEventDef.md) \| `null`

***

### politicsHook()?

> `optional` **politicsHook**: (`category`, `outcome`) => `Record`\<`string`, `number`\> \| `null`

Defined in: [apps/paracosm/src/engine/types.ts:293](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L293)

Returns politics deltas for political/social events, null if not applicable

#### Parameters

##### category

`string`

##### outcome

`string`

#### Returns

`Record`\<`string`, `number`\> \| `null`

***

### progressionHook()?

> `optional` **progressionHook**: (`ctx`) => `void`

Defined in: [apps/paracosm/src/engine/types.ts:279](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L279)

Called during between-turn progression for scenario-specific health/field changes (e.g., radiation, bone density)

#### Parameters

##### ctx

[`ProgressionHookContext`](ProgressionHookContext.md)

#### Returns

`void`

***

### reactionContextHook()?

> `optional` **reactionContextHook**: (`colonist`, `ctx`) => `string`

Defined in: [apps/paracosm/src/engine/types.ts:287](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L287)

Returns location/identity/health phrasing for agent reaction prompts

#### Parameters

##### colonist

[`Agent`](Agent.md)

##### ctx

###### time

`number`

###### turn

`number`

#### Returns

`string`
