# Interface: TombstoneRecord

Defined in: [packages/agentos/src/provenance/types.ts:256](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L256)

## Properties

### eventId

> **eventId**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:266](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L266)

Signed event ID that caused the tombstone.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:258](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L258)

Unique tombstone ID.

***

### initiator

> **initiator**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:268](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L268)

Who initiated the tombstone (agent ID or 'human').

***

### reason

> **reason**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:264](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L264)

Reason for tombstoning.

***

### recordId

> **recordId**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:262](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L262)

Primary key of the tombstoned record.

***

### tableName

> **tableName**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:260](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L260)

Table the tombstoned record belongs to.

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:270](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L270)

ISO 8601 timestamp.
