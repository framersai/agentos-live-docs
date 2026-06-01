# Variable: STREAM\_EVENT\_TYPES

> `const` **STREAM\_EVENT\_TYPES**: readonly \[`"turn_start"`, `"event_start"`, `"specialist_start"`, `"specialist_done"`, `"forge_attempt"`, `"decision_pending"`, `"decision_made"`, `"outcome"`, `"personality_drift"`, `"agent_reactions"`, `"bulletin"`, `"turn_done"`, `"promotion"`, `"systems_snapshot"`, `"provider_error"`, `"validation_fallback"`, `"sim_aborted"`\]

Defined in: [apps/paracosm/src/engine/schema/stream.ts:263](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/stream.ts#L263)

The set of valid `event.type` literals. Consumers can use this as a
type guard against unknown event types.
