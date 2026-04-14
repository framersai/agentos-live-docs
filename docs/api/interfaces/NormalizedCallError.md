# Interface: NormalizedCallError

Defined in: [packages/agentos/src/channels/telephony/types.ts:318](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L318)

An unrecoverable error occurred during the call.

## Extends

- `NormalizedEventBase`

## Properties

### error

> **error**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:321](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L321)

Error description.

***

### eventId

> **eventId**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:266](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L266)

Provider-assigned event ID for idempotency.

#### Inherited from

`NormalizedEventBase.eventId`

***

### kind

> **kind**: `"call-error"`

Defined in: [packages/agentos/src/channels/telephony/types.ts:319](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L319)

***

### providerCallId

> **providerCallId**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:268](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L268)

Provider-assigned call ID.

#### Inherited from

`NormalizedEventBase.providerCallId`

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/channels/telephony/types.ts:270](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L270)

Unix timestamp (ms).

#### Inherited from

`NormalizedEventBase.timestamp`
