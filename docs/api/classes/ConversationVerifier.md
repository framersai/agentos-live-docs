# Class: ConversationVerifier

Defined in: [packages/agentos/src/provenance/verification/ConversationVerifier.ts:30](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/verification/ConversationVerifier.ts#L30)

## Constructors

### Constructor

> **new ConversationVerifier**(`ledger`): `ConversationVerifier`

Defined in: [packages/agentos/src/provenance/verification/ConversationVerifier.ts:33](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/verification/ConversationVerifier.ts#L33)

#### Parameters

##### ledger

[`SignedEventLedger`](SignedEventLedger.md)

#### Returns

`ConversationVerifier`

## Methods

### getProvenanceSummary()

> **getProvenanceSummary**(`conversationId`): `Promise`\<\{ `chainLength`: `number`; `conversationId`: `string`; `hasGenesis`: `boolean`; `humanInterventions`: `number`; `lastEventTimestamp`: `string` \| `null`; `messageEvents`: `number`; `revisionEvents`: `number`; `tombstoneEvents`: `number`; `totalEvents`: `number`; \}\>

Defined in: [packages/agentos/src/provenance/verification/ConversationVerifier.ts:138](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/verification/ConversationVerifier.ts#L138)

Get a summary of provenance status for a conversation.
Lighter than full verification - just counts and metadata.

#### Parameters

##### conversationId

`string`

#### Returns

`Promise`\<\{ `chainLength`: `number`; `conversationId`: `string`; `hasGenesis`: `boolean`; `humanInterventions`: `number`; `lastEventTimestamp`: `string` \| `null`; `messageEvents`: `number`; `revisionEvents`: `number`; `tombstoneEvents`: `number`; `totalEvents`: `number`; \}\>

***

### verifyConversation()

> **verifyConversation**(`conversationId`, `publicKeyBase64?`): `Promise`\<[`ConversationVerificationResult`](../interfaces/ConversationVerificationResult.md)\>

Defined in: [packages/agentos/src/provenance/verification/ConversationVerifier.ts:44](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/verification/ConversationVerifier.ts#L44)

Verify the provenance chain for a specific conversation.

#### Parameters

##### conversationId

`string`

The conversation ID to verify.

##### publicKeyBase64?

`string`

Optional public key for signature verification.

#### Returns

`Promise`\<[`ConversationVerificationResult`](../interfaces/ConversationVerificationResult.md)\>

Detailed verification result including conversation-specific metadata.

***

### verifyMessage()

> **verifyMessage**(`messageId`, `publicKeyBase64?`): `Promise`\<[`VerificationResult`](../interfaces/VerificationResult.md) & `object`\>

Defined in: [packages/agentos/src/provenance/verification/ConversationVerifier.ts:97](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/verification/ConversationVerifier.ts#L97)

Verify a single post/message within a conversation.
Checks that the message event exists and its chain position is valid.

#### Parameters

##### messageId

`string`

The message ID to verify.

##### publicKeyBase64?

`string`

Optional public key for signature verification.

#### Returns

`Promise`\<[`VerificationResult`](../interfaces/VerificationResult.md) & `object`\>
