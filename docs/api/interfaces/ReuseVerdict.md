# Interface: ReuseVerdict

Defined in: [packages/agentos/src/emergent/types.ts:346](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L346)

Verdict produced before reusing an emergent tool from a previous session.

Validates that the tool's schema and runtime behaviour still match expectations,
and flags any anomalies that may indicate drift or tampering.

## Properties

### anomaly

> **anomaly**: `boolean`

Defined in: [packages/agentos/src/emergent/types.ts:363](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L363)

Whether a behavioural anomaly was detected compared to the tool's
historical usage baseline.

***

### anomalyReason?

> `optional` **anomalyReason**: `string`

Defined in: [packages/agentos/src/emergent/types.ts:369](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L369)

Human-readable description of the detected anomaly, present when
`anomaly` is `true`.

***

### schemaErrors

> **schemaErrors**: `string`[]

Defined in: [packages/agentos/src/emergent/types.ts:357](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L357)

JSON Schema validation errors for the tool's input/output schemas, if any.
An empty array means schemas are structurally valid.

***

### valid

> **valid**: `boolean`

Defined in: [packages/agentos/src/emergent/types.ts:351](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L351)

Whether the tool is safe to reuse in the current context.
`false` means the tool should be re-forged or discarded.
