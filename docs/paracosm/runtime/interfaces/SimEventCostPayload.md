# Interface: SimEventCostPayload

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:90](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L90)

Universal fields spread onto every emitted event's `data` payload,
regardless of event type. `summary` is the "just works" one-liner for
casual logging (`console.log(e.type, e.data.summary)` always yields
something readable). `_cost` is internal book-keeping the dashboard
uses for a live cost counter; consumers that need the breakdown should
read it off the returned `result.cost` instead.

## Properties

### \_cost?

> `optional` **\_cost**: `unknown`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:99](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L99)

***

### summary

> **summary**: `string`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:98](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/orchestrator.ts#L98)

Short human-readable one-liner describing what this event represents
(e.g. `"dust storm (natural_disaster)"` for event_start,
`"medical: forged radiation_calc"` for forge_attempt). Populated by
the runtime on every emit — consumers can rely on it being present.
Prefer this over per-type field access when you just want a log line.
