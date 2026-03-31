# Interface: NormalizedCallFailed

Defined in: [packages/agentos/src/channels/telephony/types.ts:291](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L291)

The provider could not place or maintain the call.

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

> **kind**: `"call-failed"`

Defined in: [packages/agentos/src/channels/telephony/types.ts:292](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L292)

***

### providerCallId

> **providerCallId**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:268](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L268)

Provider-assigned call ID.

#### Inherited from

`NormalizedEventBase.providerCallId`

***

### reason?

> `optional` **reason**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:294](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L294)

Human-readable failure reason from the provider.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/channels/telephony/types.ts:270](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L270)

Unix timestamp (ms).

#### Inherited from

`NormalizedEventBase.timestamp`
