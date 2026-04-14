# Interface: MechanismMetadata

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:156](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/mechanisms/types.ts#L156)

Optional metadata fields added to MemoryTrace.structuredData by mechanisms.

## Properties

### cumulativeDrift?

> `optional` **cumulativeDrift**: `number`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:158](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/mechanisms/types.ts#L158)

Reconsolidation: cumulative absolute PAD drift.

***

### driftHistory?

> `optional` **driftHistory**: [`DriftEvent`](DriftEvent.md)[]

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:160](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/mechanisms/types.ts#L160)

Reconsolidation: audit trail of drift events.

***

### gisted?

> `optional` **gisted**: `boolean`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:162](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/mechanisms/types.ts#L162)

Temporal Gist: whether content has been compressed.

***

### lastSourceDecayAt?

> `optional` **lastSourceDecayAt**: `number`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:172](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/mechanisms/types.ts#L172)

Source Confidence Decay: timestamp of last decay application.

***

### originalContentHash?

> `optional` **originalContentHash**: `string`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:164](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/mechanisms/types.ts#L164)

Temporal Gist: SHA-256 of original content before gisting.

***

### perspectiveEncoded?

> `optional` **perspectiveEncoded**: `boolean`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:180](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/mechanisms/types.ts#L180)

PerspectiveObserver: trace was encoded through a persona lens.

***

### perspectiveSourceEventId?

> `optional` **perspectiveSourceEventId**: `string`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:182](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/mechanisms/types.ts#L182)

PerspectiveObserver: ID of the source objective event.

***

### perspectiveSourceHash?

> `optional` **perspectiveSourceHash**: `string`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:184](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/mechanisms/types.ts#L184)

PerspectiveObserver: SHA-256 of the source objective event content.

***

### reappraisalHistory?

> `optional` **reappraisalHistory**: `object`[]

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:174](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/mechanisms/types.ts#L174)

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

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:170](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/mechanisms/types.ts#L170)

Schema Encoding: ID of the matched cluster.

***

### schemaCongruent?

> `optional` **schemaCongruent**: `boolean`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:166](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/mechanisms/types.ts#L166)

Schema Encoding: trace matched an existing schema cluster.

***

### schemaViolating?

> `optional` **schemaViolating**: `boolean`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:168](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/mechanisms/types.ts#L168)

Schema Encoding: trace violated all existing schemas (novel).
