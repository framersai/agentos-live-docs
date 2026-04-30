# Interface: SimEventCostPayload

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:73](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L73)

Universal fields spread onto every emitted event's `data` payload,
regardless of event type. `summary` is the "just works" one-liner for
casual logging (`console.log(e.type, e.data.summary)` always yields
something readable). `_cost` is internal book-keeping the dashboard
uses for a live cost counter; consumers that need the breakdown should
read it off the returned `result.cost` instead.

## Properties

### \_cost?

> `optional` **\_cost**: `unknown`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:82](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L82)

***

### summary

> **summary**: `string`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:81](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L81)

Short human-readable one-liner describing what this event represents
(e.g. `"dust storm (natural_disaster)"` for event_start,
`"medical: forged radiation_calc"` for forge_attempt). Populated by
the runtime on every emit — consumers can rely on it being present.
Prefer this over per-type field access when you just want a log line.
