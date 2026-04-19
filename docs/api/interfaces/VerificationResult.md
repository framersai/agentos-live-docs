# Interface: VerificationResult

Defined in: [packages/agentos/src/provenance/types.ts:294](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L294)

## Extended by

- [`ConversationVerificationResult`](ConversationVerificationResult.md)

## Properties

### agentId?

> `optional` **agentId**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:308](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L308)

Agent ID of the verified chain.

***

### errors

> **errors**: [`VerificationError`](VerificationError.md)[]

Defined in: [packages/agentos/src/provenance/types.ts:300](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L300)

List of errors found.

***

### eventsVerified

> **eventsVerified**: `number`

Defined in: [packages/agentos/src/provenance/types.ts:298](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L298)

Number of events verified.

***

### firstSequence?

> `optional` **firstSequence**: `number`

Defined in: [packages/agentos/src/provenance/types.ts:304](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L304)

First sequence number verified.

***

### lastSequence?

> `optional` **lastSequence**: `number`

Defined in: [packages/agentos/src/provenance/types.ts:306](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L306)

Last sequence number verified.

***

### valid

> **valid**: `boolean`

Defined in: [packages/agentos/src/provenance/types.ts:296](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L296)

Whether all checks passed.

***

### verifiedAt

> **verifiedAt**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:310](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L310)

ISO 8601 timestamp of when verification was performed.

***

### warnings

> **warnings**: `string`[]

Defined in: [packages/agentos/src/provenance/types.ts:302](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L302)

Informational warnings (non-fatal).
