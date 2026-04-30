# Interface: SimEventPayloadMap

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:96](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L96)

Per-event-type data shapes. The discriminated `SimEvent` union below
maps each `type` to its payload so `onEvent` handlers get proper
type-narrowing: `if (e.type === 'event_start') e.data.title` compiles
without `as any` or optional chaining through `unknown`.

Each payload documents the fields the runtime actually writes; fields
marked optional are conditionally populated (milestone vs emergent
events, degraded vs healthy paths, etc.). Adding a new field to a
payload is non-breaking; removing or renaming one is.

## Properties

### agent\_reactions

> **agent\_reactions**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:170](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L170)

Rollup of ~100 agent reactions for the turn (sliced preview only; full list on result).

#### moodSummary?

> `optional` **moodSummary**: `unknown`

#### reactions

> **reactions**: `unknown`[]

***

### bulletin

> **bulletin**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:172](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L172)

Social-media-style per-turn posts from featured agents.

#### posts

> **posts**: `unknown`[]

***

### colony\_snapshot

> **colony\_snapshot**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:184](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L184)

Full roster snapshot used by the dashboard cellular-automata viz.

#### agents

> **agents**: `unknown`[]

#### births

> **births**: `number`

#### deaths

> **deaths**: `number`

#### foodReserve

> **foodReserve**: `number`

#### morale

> **morale**: `number`

#### population

> **population**: `number`

***

### commander\_decided

> **commander\_decided**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:151](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L151)

Commander picked. `reasoning` is the full CoT; `rationale` is the compressed version.

#### decision

> **decision**: `string`

#### eventIndex

> **eventIndex**: `number`

#### rationale

> **rationale**: `string`

#### reasoning

> **reasoning**: `string`

#### selectedOptionId?

> `optional` **selectedOptionId**: `string`

#### selectedPolicies

> **selectedPolicies**: `unknown`[]

***

### commander\_deciding

> **commander\_deciding**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:149](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L149)

Commander is about to read department reports and pick an option.

#### eventIndex

> **eventIndex**: `number`

***

### dept\_done

> **dept\_done**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:124](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L124)

Department finished analyzing. `citationList` is truncated to 5; full list lives on the returned report.

#### citationList

> **citationList**: `object`[]

#### citations

> **citations**: `number`

#### department

> **department**: `string`

#### eventIndex

> **eventIndex**: `number`

#### forgedTools

> **forgedTools**: `unknown`[]

#### recommendedActions?

> `optional` **recommendedActions**: `string`[]

#### risks

> **risks**: `string`[]

#### summary

> **summary**: `string`

***

### dept\_start

> **dept\_start**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:122](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L122)

Department agent starts analyzing an event. `department` is the scenario-defined id.

#### department

> **department**: `string`

#### eventIndex

> **eventIndex**: `number`

***

### drift

> **drift**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:168](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L168)

Per-turn HEXACO drift for promoted agents + the commander.

#### agents

> **agents**: `Record`\<`string`, \{ `hexaco`: `Record`\<`string`, `number`\>; `name`: `string`; \}\>

#### commander

> **commander**: `unknown`

***

### event\_start

> **event\_start**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:111](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L111)

Fires before each event within a turn. One turn can carry multiple events (up to `maxEventsPerTurn`).

#### category

> **category**: `string`

#### description?

> `optional` **description**: `string`

#### emergent?

> `optional` **emergent**: `boolean`

#### eventIndex

> **eventIndex**: `number`

#### pacing?

> `optional` **pacing**: `unknown`

#### title

> **title**: `string`

#### totalEvents

> **totalEvents**: `number`

#### turnSummary?

> `optional` **turnSummary**: `string`

***

### forge\_attempt

> **forge\_attempt**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:135](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L135)

A department tried to forge a runtime tool. `approved` reflects the LLM-judge verdict.

#### approved

> **approved**: `boolean`

#### confidence

> **confidence**: `number`

#### department

> **department**: `string`

#### description?

> `optional` **description**: `string`

#### errorReason?

> `optional` **errorReason**: `string`

#### eventIndex?

> `optional` **eventIndex**: `number`

#### inputFields

> **inputFields**: `string`[]

#### mode?

> `optional` **mode**: `string`

#### name

> **name**: `string`

#### outputFields

> **outputFields**: `string`[]

#### timestamp

> **timestamp**: `string`

***

### outcome

> **outcome**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:160](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L160)

Outcome classification + numerical deltas applied to colony state.

#### category

> **category**: `string`

#### colonyDeltas

> **colonyDeltas**: `Record`\<`string`, `number`\>

#### emergent

> **emergent**: `boolean`

#### eventIndex

> **eventIndex**: `number`

#### outcome

> **outcome**: `string`

***

### promotion

> **promotion**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:182](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L182)

Department-head promotion at turn 0. One per department.

#### agentId

> **agentId**: `string`

#### department

> **department**: `string`

#### reason?

> `optional` **reason**: `string`

#### role

> **role**: `string`

***

### provider\_error

> **provider\_error**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:193](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L193)

Terminal provider failure (invalid key, quota, classified auth error). The run aborts at the next turn.

#### actionUrl?

> `optional` **actionUrl**: `string`

#### kind

> **kind**: `"auth"` \| `"quota"` \| `"rate_limit"` \| `"network"` \| `"unknown"`

#### message

> **message**: `string`

#### provider?

> `optional` **provider**: `string`

#### site

> **site**: `string`

***

### sim\_aborted

> **sim\_aborted**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:203](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L203)

Run was cancelled via `signal.abort()` (or the server's disconnect watchdog). Partial results preserved.

#### colony

> **colony**: `Record`\<`string`, `number`\>

#### completedTurns

> **completedTurns**: `number`

#### reason

> **reason**: `string`

#### toolsForged

> **toolsForged**: `number`

***

### turn\_done

> **turn\_done**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:174](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L174)

End of turn. Carries applied deltas + cumulative tool count + death-cause breakdown when relevant.

#### colony

> **colony**: `Record`\<`string`, `number`\>

#### deathCauses?

> `optional` **deathCauses**: `Record`\<`string`, `number`\>

#### error?

> `optional` **error**: `string`

#### toolsForged

> **toolsForged**: `number`

#### totalEvents?

> `optional` **totalEvents**: `number`

***

### turn\_start

> **turn\_start**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:98](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L98)

Fires once at the start of every turn. Title/crisis carry the first event's headline when `totalEvents > 0`.

#### births?

> `optional` **births**: `number`

#### category?

> `optional` **category**: `string`

#### colony?

> `optional` **colony**: `Record`\<`string`, `number`\>

#### crisis?

> `optional` **crisis**: `string`

#### deaths?

> `optional` **deaths**: `number`

#### emergent?

> `optional` **emergent**: `boolean`

#### pacing?

> `optional` **pacing**: `unknown`

#### title

> **title**: `string`

#### totalEvents?

> `optional` **totalEvents**: `number`

#### turnSummary?

> `optional` **turnSummary**: `string`

***

### validation\_fallback

> **validation\_fallback**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:201](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L201)

Non-terminal: a schema-validated call exhausted retries and returned the fallback skeleton. Run continues degraded.

#### error

> **error**: `string`

#### rawTextPreview

> **rawTextPreview**: `string`

#### schemaName?

> `optional` **schemaName**: `string`

#### site

> **site**: `string`
