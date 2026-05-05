# Interface: ReuseVerdict

Defined in: [packages/agentos/src/emergent/types.ts:348](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L348)

Verdict produced before reusing an emergent tool from a previous session.

Validates that the tool's schema and runtime behaviour still match expectations,
and flags any anomalies that may indicate drift or tampering.

## Properties

### anomaly

> **anomaly**: `boolean`

Defined in: [packages/agentos/src/emergent/types.ts:365](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L365)

Whether a behavioural anomaly was detected compared to the tool's
historical usage baseline.

***

### anomalyReason?

> `optional` **anomalyReason**: `string`

Defined in: [packages/agentos/src/emergent/types.ts:371](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L371)

Human-readable description of the detected anomaly, present when
`anomaly` is `true`.

***

### schemaErrors

> **schemaErrors**: `string`[]

Defined in: [packages/agentos/src/emergent/types.ts:359](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L359)

JSON Schema validation errors for the tool's input/output schemas, if any.
An empty array means schemas are structurally valid.

***

### valid

> **valid**: `boolean`

Defined in: [packages/agentos/src/emergent/types.ts:353](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L353)

Whether the tool is safe to reuse in the current context.
`false` means the tool should be re-forged or discarded.
