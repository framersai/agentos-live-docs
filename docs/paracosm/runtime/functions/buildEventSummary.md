# Function: buildEventSummary()

> **buildEventSummary**(`type`, `data`): `string`

Defined in: [apps/paracosm/src/runtime/orchestrator.ts:256](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/orchestrator.ts#L256)

Build a human-readable one-liner for an event, used as the universal
`summary` field on every emitted event's `data`. Centralized here so
all 17 event types render a consistent shape and casual consumers can
rely on `e.data.summary` being present and informative.

Kept intentionally short (< ~120 chars) so it fits in a log line
without forcing a wrap. Longer detail is still available on the
type-narrowed per-event payload fields (`e.data.description`,
`e.data.reasoning`, etc.).

## Parameters

### type

keyof [`SimEventPayloadMap`](../interfaces/SimEventPayloadMap.md)

### data

`Record`\<`string`, `unknown`\>

## Returns

`string`
