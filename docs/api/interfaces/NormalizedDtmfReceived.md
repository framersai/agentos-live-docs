# Interface: NormalizedDtmfReceived

Defined in: [packages/agentos/src/channels/telephony/types.ts:368](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/types.ts#L368)

DTMF (Dual-Tone Multi-Frequency) digit received during a call.

DTMF events do NOT trigger a call state transition -- the call remains in
its current state (typically `listening` or `active`). They are relayed as
informational events so higher-level logic (e.g., IVR menus, PIN entry)
can react to caller key-presses.

## Provider behavior differences
- **Twilio**: DTMF arrives both via `<Gather>` webhook callbacks (as `Digits`
  param) and via the media stream WebSocket (as `dtmf` events with duration).
- **Telnyx**: DTMF arrives only via `call.dtmf.received` HTTP webhooks --
  never over the media stream WebSocket.
- **Plivo**: DTMF arrives via `<GetDigits>` XML callback (as `Digits` param)
  in webhook POST bodies.

## Example

```typescript
if (event.kind === 'call-dtmf') {
  console.log(`User pressed ${event.digit} for ${event.durationMs}ms`);
}
```

## Extends

- `NormalizedEventBase`

## Properties

### digit

> **digit**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:376](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/types.ts#L376)

The digit pressed by the caller.

Standard DTMF digits: `'0'`-`'9'`, `'*'`, `'#'`.
Extended DTMF (rarely supported): `'A'`-`'D'`.

***

### durationMs?

> `optional` **durationMs**: `number`

Defined in: [packages/agentos/src/channels/telephony/types.ts:383](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/types.ts#L383)

How long the key was pressed in milliseconds, when available.

Not all providers report duration -- Twilio's media stream includes it,
but Telnyx and Plivo webhook payloads typically omit it.

***

### eventId

> **eventId**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:266](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/types.ts#L266)

Provider-assigned event ID for idempotency.

#### Inherited from

`NormalizedEventBase.eventId`

***

### kind

> **kind**: `"call-dtmf"`

Defined in: [packages/agentos/src/channels/telephony/types.ts:369](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/types.ts#L369)

***

### providerCallId

> **providerCallId**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:268](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/types.ts#L268)

Provider-assigned call ID.

#### Inherited from

`NormalizedEventBase.providerCallId`

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/channels/telephony/types.ts:270](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/types.ts#L270)

Unix timestamp (ms).

#### Inherited from

`NormalizedEventBase.timestamp`
