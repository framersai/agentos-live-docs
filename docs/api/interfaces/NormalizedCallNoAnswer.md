# Interface: NormalizedCallNoAnswer

Defined in: [packages/agentos/src/channels/telephony/types.ts:303](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L303)

The callee did not answer within the ring timeout.

## Extends

- `NormalizedEventBase`

## Properties

### eventId

> **eventId**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:266](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L266)

Provider-assigned event ID for idempotency.

#### Inherited from

`NormalizedEventBase.eventId`

***

### kind

> **kind**: `"call-no-answer"`

Defined in: [packages/agentos/src/channels/telephony/types.ts:304](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L304)

***

### providerCallId

> **providerCallId**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:268](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L268)

Provider-assigned call ID.

#### Inherited from

`NormalizedEventBase.providerCallId`

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/channels/telephony/types.ts:270](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L270)

Unix timestamp (ms).

#### Inherited from

`NormalizedEventBase.timestamp`
