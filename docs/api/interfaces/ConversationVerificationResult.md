# Interface: ConversationVerificationResult

Defined in: [packages/agentos/src/provenance/verification/ConversationVerifier.ts:17](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/verification/ConversationVerifier.ts#L17)

## Extends

- [`VerificationResult`](VerificationResult.md)

## Properties

### agentId?

> `optional` **agentId**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:308](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L308)

Agent ID of the verified chain.

#### Inherited from

[`VerificationResult`](VerificationResult.md).[`agentId`](VerificationResult.md#agentid)

***

### conversationId

> **conversationId**: `string`

Defined in: [packages/agentos/src/provenance/verification/ConversationVerifier.ts:18](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/verification/ConversationVerifier.ts#L18)

***

### errors

> **errors**: [`VerificationError`](VerificationError.md)[]

Defined in: [packages/agentos/src/provenance/types.ts:300](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L300)

List of errors found.

#### Inherited from

[`VerificationResult`](VerificationResult.md).[`errors`](VerificationResult.md#errors)

***

### eventsVerified

> **eventsVerified**: `number`

Defined in: [packages/agentos/src/provenance/types.ts:298](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L298)

Number of events verified.

#### Inherited from

[`VerificationResult`](VerificationResult.md).[`eventsVerified`](VerificationResult.md#eventsverified)

***

### firstSequence?

> `optional` **firstSequence**: `number`

Defined in: [packages/agentos/src/provenance/types.ts:304](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L304)

First sequence number verified.

#### Inherited from

[`VerificationResult`](VerificationResult.md).[`firstSequence`](VerificationResult.md#firstsequence)

***

### hasGenesis

> **hasGenesis**: `boolean`

Defined in: [packages/agentos/src/provenance/verification/ConversationVerifier.ts:20](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/verification/ConversationVerifier.ts#L20)

***

### hasHumanInterventions

> **hasHumanInterventions**: `boolean`

Defined in: [packages/agentos/src/provenance/verification/ConversationVerifier.ts:21](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/verification/ConversationVerifier.ts#L21)

***

### humanInterventionCount

> **humanInterventionCount**: `number`

Defined in: [packages/agentos/src/provenance/verification/ConversationVerifier.ts:22](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/verification/ConversationVerifier.ts#L22)

***

### isFullyAutonomous

> **isFullyAutonomous**: `boolean`

Defined in: [packages/agentos/src/provenance/verification/ConversationVerifier.ts:23](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/verification/ConversationVerifier.ts#L23)

***

### lastSequence?

> `optional` **lastSequence**: `number`

Defined in: [packages/agentos/src/provenance/types.ts:306](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L306)

Last sequence number verified.

#### Inherited from

[`VerificationResult`](VerificationResult.md).[`lastSequence`](VerificationResult.md#lastsequence)

***

### messageCount

> **messageCount**: `number`

Defined in: [packages/agentos/src/provenance/verification/ConversationVerifier.ts:19](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/verification/ConversationVerifier.ts#L19)

***

### valid

> **valid**: `boolean`

Defined in: [packages/agentos/src/provenance/types.ts:296](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L296)

Whether all checks passed.

#### Inherited from

[`VerificationResult`](VerificationResult.md).[`valid`](VerificationResult.md#valid)

***

### verifiedAt

> **verifiedAt**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:310](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L310)

ISO 8601 timestamp of when verification was performed.

#### Inherited from

[`VerificationResult`](VerificationResult.md).[`verifiedAt`](VerificationResult.md#verifiedat)

***

### warnings

> **warnings**: `string`[]

Defined in: [packages/agentos/src/provenance/types.ts:302](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L302)

Informational warnings (non-fatal).

#### Inherited from

[`VerificationResult`](VerificationResult.md).[`warnings`](VerificationResult.md#warnings)
