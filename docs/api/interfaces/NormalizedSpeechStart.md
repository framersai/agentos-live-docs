# Interface: NormalizedSpeechStart

Defined in: [packages/agentos/src/channels/telephony/types.ts:334](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L334)

The caller started speaking (voice activity detection trigger).

## Extends

- `NormalizedEventBase`

## Properties

### eventId

> **eventId**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:266](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L266)

Provider-assigned event ID for idempotency.

#### Inherited from

`NormalizedEventBase.eventId`

***

### kind

> **kind**: `"speech-start"`

Defined in: [packages/agentos/src/channels/telephony/types.ts:335](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L335)

***

### providerCallId

> **providerCallId**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:268](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L268)

Provider-assigned call ID.

#### Inherited from

`NormalizedEventBase.providerCallId`

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/channels/telephony/types.ts:270](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L270)

Unix timestamp (ms).

#### Inherited from

`NormalizedEventBase.timestamp`
