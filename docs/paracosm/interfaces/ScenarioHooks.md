# Interface: ScenarioHooks

Defined in: [types.ts:260](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L260)

Lifecycle hooks that a scenario provides to inject domain-specific behavior
into the generic engine. All hooks are optional.

## Properties

### departmentPromptHook()?

> `optional` **departmentPromptHook**: (`ctx`) => `string`[]

Defined in: [types.ts:264](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L264)

Builds department-specific prompt context lines for LLM department agents

#### Parameters

##### ctx

[`PromptHookContext`](PromptHookContext.md)

#### Returns

`string`[]

***

### directorInstructions()?

> `optional` **directorInstructions**: () => `string`

Defined in: [types.ts:266](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L266)

Returns the Event Director's system instructions for this scenario

#### Returns

`string`

***

### directorPromptHook()?

> `optional` **directorPromptHook**: (`ctx`) => `string`

Defined in: [types.ts:268](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L268)

Builds the Event Director's per-turn context prompt

#### Parameters

##### ctx

`Record`\<`string`, `unknown`\>

#### Returns

`string`

***

### fingerprintHook()?

> `optional` **fingerprintHook**: (`finalState`, `outcomeLog`, `leader`, `toolRegs`, `maxTurns`) => `Record`\<`string`, `string`\>

Defined in: [types.ts:272](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L272)

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

### getMilestoneEvent()?

> `optional` **getMilestoneEvent**: (`turn`, `maxTurns`) => [`MilestoneEventDef`](MilestoneEventDef.md) \| `null`

Defined in: [types.ts:274](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L274)

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

Defined in: [types.ts:276](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L276)

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

Defined in: [types.ts:262](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L262)

Called during between-turn progression for scenario-specific health/field changes (e.g., radiation, bone density)

#### Parameters

##### ctx

[`ProgressionHookContext`](ProgressionHookContext.md)

#### Returns

`void`

***

### reactionContextHook()?

> `optional` **reactionContextHook**: (`colonist`, `ctx`) => `string`

Defined in: [types.ts:270](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L270)

Returns location/identity/health phrasing for agent reaction prompts

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
