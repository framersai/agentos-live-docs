# Class: EventDirector

Defined in: [runtime/director.ts:246](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L246)

## Constructors

### Constructor

> **new EventDirector**(): `EventDirector`

#### Returns

`EventDirector`

## Methods

### generateEventBatch()

> **generateEventBatch**(`ctx`, `maxEvents?`, `provider?`, `model?`, `instructions?`, `onUsage?`, `onProviderError?`, `onSchemaAttempt?`): `Promise`\<`DirectorEventBatch`\>

Defined in: [runtime/director.ts:258](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L258)

Generate 1 to maxEvents events for a turn via the schema-validated
generateObject wrapper. Falls back to canned events when the LLM
call or validation fails after maxRetries.

#### Parameters

##### ctx

[`DirectorContext`](../interfaces/DirectorContext.md)

##### maxEvents?

`number` = `3`

##### provider?

[`LlmProvider`](../../engine/type-aliases/LlmProvider.md) = `'openai'`

##### model?

`string` = `'gpt-5.4'`

##### instructions?

`string`

##### onUsage?

(`result`) => `void`

Optional callback invoked with the director's LLM
       response so the orchestrator can account for director spend in
       its cost telemetry. Director runs once per turn on the flagship
       model; without this hook the call was invisible to the per-run
       `cost` object returned by `runSimulation()`.

##### onProviderError?

(`err`) => `void`

Called with the raw caught error when the director's LLM call throws.
Lets the orchestrator classify the error (quota / auth / etc.) and
emit a `provider_error` SSE event before the existing fallback path
quietly substitutes canned events.

##### onSchemaAttempt?

(`attempts`, `fellBack`) => `void`

Called with the attempts count + fallback flag so the orchestrator
can feed per-schema retry telemetry into its cost tracker.

#### Returns

`Promise`\<`DirectorEventBatch`\>

***

### getMilestoneCrisis()

> **getMilestoneCrisis**(`turn`, `maxTurns`): [`DirectorCrisis`](../type-aliases/DirectorCrisis.md) \| `null`

Defined in: [runtime/director.ts:333](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/director.ts#L333)

Get a milestone crisis (Turn 1 or final turn).
These are fixed for narrative anchoring.

#### Parameters

##### turn

`number`

##### maxTurns

`number`

#### Returns

[`DirectorCrisis`](../type-aliases/DirectorCrisis.md) \| `null`
