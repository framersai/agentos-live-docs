# Interface: ScenarioHooks

Defined in: [types.ts:253](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L253)

Lifecycle hooks that a scenario provides to inject domain-specific behavior
into the generic engine. All hooks are optional.

## Properties

### departmentPromptHook()?

> `optional` **departmentPromptHook**: (`ctx`) => `string`[]

Defined in: [types.ts:257](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L257)

Builds department-specific prompt context lines for LLM department agents

#### Parameters

##### ctx

[`PromptHookContext`](PromptHookContext.md)

#### Returns

`string`[]

***

### directorInstructions()?

> `optional` **directorInstructions**: () => `string`

Defined in: [types.ts:259](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L259)

Returns the Crisis Director's system instructions for this scenario

#### Returns

`string`

***

### directorPromptHook()?

> `optional` **directorPromptHook**: (`ctx`) => `string`

Defined in: [types.ts:261](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L261)

Builds the Crisis Director's per-turn context prompt

#### Parameters

##### ctx

`Record`\<`string`, `unknown`\>

#### Returns

`string`

***

### fingerprintHook()?

> `optional` **fingerprintHook**: (`finalState`, `outcomeLog`, `leader`, `toolRegs`, `maxTurns`) => `Record`\<`string`, `string`\>

Defined in: [types.ts:265](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L265)

Computes a timeline fingerprint classification from final simulation state

#### Parameters

##### finalState

[`SimulationState`](SimulationState.md)

##### outcomeLog

`object`[]

##### leader

[`LeaderConfig`](LeaderConfig.md)

##### toolRegs

`Record`\<`string`, `string`[]\>

##### maxTurns

`number`

#### Returns

`Record`\<`string`, `string`\>

***

### getMilestoneCrisis()?

> `optional` **getMilestoneCrisis**: (`turn`, `maxTurns`) => [`MilestoneCrisisDef`](MilestoneCrisisDef.md) \| `null`

Defined in: [types.ts:267](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L267)

Returns a milestone crisis for narrative anchor turns (turn 1, final turn)

#### Parameters

##### turn

`number`

##### maxTurns

`number`

#### Returns

[`MilestoneCrisisDef`](MilestoneCrisisDef.md) \| `null`

***

### politicsHook()?

> `optional` **politicsHook**: (`category`, `outcome`) => `Record`\<`string`, `number`\> \| `null`

Defined in: [types.ts:269](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L269)

Returns politics deltas for political/social crises, null if not applicable

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

Defined in: [types.ts:255](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L255)

Called during between-turn progression for scenario-specific health/field changes (e.g., radiation, bone density)

#### Parameters

##### ctx

[`ProgressionHookContext`](ProgressionHookContext.md)

#### Returns

`void`

***

### reactionContextHook()?

> `optional` **reactionContextHook**: (`colonist`, `ctx`) => `string`

Defined in: [types.ts:263](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L263)

Returns location/identity/health phrasing for colonist reaction prompts

#### Parameters

##### colonist

[`Agent`](Agent.md)

##### ctx

###### turn

`number`

###### year

`number`

#### Returns

`string`
