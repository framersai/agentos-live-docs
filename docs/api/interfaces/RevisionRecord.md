# Interface: RevisionRecord

Defined in: [packages/agentos/src/provenance/types.ts:235](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L235)

## Properties

### eventId

> **eventId**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:247](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L247)

Signed event ID that caused this revision.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:237](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L237)

Unique revision ID.

***

### recordId

> **recordId**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:241](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L241)

Primary key of the revised record.

***

### revisionNumber

> **revisionNumber**: `number`

Defined in: [packages/agentos/src/provenance/types.ts:243](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L243)

Revision number (1-indexed, monotonically increasing per record).

***

### snapshot

> **snapshot**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:245](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L245)

Complete JSON snapshot of the record at this revision.

***

### tableName

> **tableName**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:239](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L239)

Table the revised record belongs to.

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:249](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L249)

ISO 8601 timestamp.
