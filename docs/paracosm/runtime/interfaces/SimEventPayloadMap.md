# Interface: SimEventPayloadMap

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:113](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L113)

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

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:187](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L187)

Rollup of ~100 agent reactions for the turn (sliced preview only; full list on result).

#### moodSummary?

> `optional` **moodSummary**: `unknown`

#### reactions

> **reactions**: `unknown`[]

***

### bulletin

> **bulletin**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:189](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L189)

Social-media-style per-turn posts from featured agents.

#### posts

> **posts**: `unknown`[]

***

### decision\_made

> **decision\_made**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:168](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L168)

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

### decision\_pending

> **decision\_pending**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:166](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L166)

Commander is about to read department reports and pick an option.

#### eventIndex

> **eventIndex**: `number`

***

### event\_start

> **event\_start**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:128](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L128)

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

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:152](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L152)

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

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:177](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L177)

Outcome classification + numerical deltas applied to the metrics state bag.

#### category

> **category**: `string`

#### emergent

> **emergent**: `boolean`

#### eventIndex

> **eventIndex**: `number`

#### outcome

> **outcome**: `string`

#### systemDeltas

> **systemDeltas**: `Record`\<`string`, `number`\>

***

### personality\_drift

> **personality\_drift**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:185](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L185)

Per-turn HEXACO drift for promoted agents + the commander.

#### agents

> **agents**: `Record`\<`string`, \{ `hexaco`: `Record`\<`string`, `number`\>; `name`: `string`; \}\>

#### commander

> **commander**: `unknown`

***

### promotion

> **promotion**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:201](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L201)

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

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:212](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L212)

Terminal provider failure (invalid key, quota, classified auth error). The run aborts at the next turn.

#### actionUrl?

> `optional` **actionUrl**: `string`

#### kind

> **kind**: `"unknown"` \| `"auth"` \| `"quota"` \| `"rate_limit"` \| `"network"`

#### message

> **message**: `string`

#### provider?

> `optional` **provider**: `string`

#### site

> **site**: `string`

***

### sim\_aborted

> **sim\_aborted**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:222](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L222)

Run was cancelled via `signal.abort()` (or the server's disconnect watchdog). Partial results preserved.

#### completedTurns

> **completedTurns**: `number`

#### metrics

> **metrics**: `Record`\<`string`, `number`\>

#### reason

> **reason**: `string`

#### toolsForged

> **toolsForged**: `number`

***

### specialist\_done

> **specialist\_done**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:141](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L141)

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

### specialist\_start

> **specialist\_start**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:139](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L139)

Department agent starts analyzing an event. `department` is the scenario-defined id.

#### department

> **department**: `string`

#### eventIndex

> **eventIndex**: `number`

***

### systems\_snapshot

> **systems\_snapshot**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:203](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L203)

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

### turn\_done

> **turn\_done**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:191](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L191)

End of turn. Carries applied deltas + cumulative tool count + death-cause breakdown when relevant.

#### deathCauses?

> `optional` **deathCauses**: `Record`\<`string`, `number`\>

#### environment?

> `optional` **environment**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

#### error?

> `optional` **error**: `string`

#### metrics

> **metrics**: `Record`\<`string`, `number`\>

#### statuses?

> `optional` **statuses**: `Record`\<`string`, `string` \| `boolean`\>

#### toolsForged

> **toolsForged**: `number`

#### totalEvents?

> `optional` **totalEvents**: `number`

***

### turn\_start

> **turn\_start**: `object`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:115](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L115)

Fires once at the start of every turn. Title/crisis carry the first event's headline when `totalEvents > 0`.

#### births?

> `optional` **births**: `number`

#### category?

> `optional` **category**: `string`

#### crisis?

> `optional` **crisis**: `string`

#### deaths?

> `optional` **deaths**: `number`

#### emergent?

> `optional` **emergent**: `boolean`

#### metrics?

> `optional` **metrics**: `Record`\<`string`, `number`\>

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

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:220](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L220)

Non-terminal: a schema-validated call exhausted retries and returned the fallback skeleton. Run continues degraded.

#### error

> **error**: `string`

#### rawTextPreview

> **rawTextPreview**: `string`

#### schemaName?

> `optional` **schemaName**: `string`

#### site

> **site**: `string`
