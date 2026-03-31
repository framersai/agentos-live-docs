# Interface: MechanismMetadata

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:154](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/types.ts#L154)

Optional metadata fields added to MemoryTrace.structuredData by mechanisms.

## Properties

### cumulativeDrift?

> `optional` **cumulativeDrift**: `number`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:156](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/types.ts#L156)

Reconsolidation: cumulative absolute PAD drift.

***

### driftHistory?

> `optional` **driftHistory**: [`DriftEvent`](DriftEvent.md)[]

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:158](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/types.ts#L158)

Reconsolidation: audit trail of drift events.

***

### gisted?

> `optional` **gisted**: `boolean`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:160](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/types.ts#L160)

Temporal Gist: whether content has been compressed.

***

### lastSourceDecayAt?

> `optional` **lastSourceDecayAt**: `number`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:170](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/types.ts#L170)

Source Confidence Decay: timestamp of last decay application.

***

### originalContentHash?

> `optional` **originalContentHash**: `string`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:162](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/types.ts#L162)

Temporal Gist: SHA-256 of original content before gisting.

***

### reappraisalHistory?

> `optional` **reappraisalHistory**: `object`[]

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:172](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/types.ts#L172)

Emotion Regulation: audit trail of reappraisal events.

#### previousArousal

> **previousArousal**: `number`

#### previousValence

> **previousValence**: `number`

#### reappraisedAt

> **reappraisedAt**: `number`

***

### schemaClusterId?

> `optional` **schemaClusterId**: `string`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:168](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/types.ts#L168)

Schema Encoding: ID of the matched cluster.

***

### schemaCongruent?

> `optional` **schemaCongruent**: `boolean`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:164](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/types.ts#L164)

Schema Encoding: trace matched an existing schema cluster.

***

### schemaViolating?

> `optional` **schemaViolating**: `boolean`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:166](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/types.ts#L166)

Schema Encoding: trace violated all existing schemas (novel).
