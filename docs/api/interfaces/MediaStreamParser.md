# Interface: MediaStreamParser

Defined in: [packages/agentos/src/channels/telephony/MediaStreamParser.ts:63](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/MediaStreamParser.ts#L63)

Contract for parsing and formatting provider-specific WebSocket media
stream messages.

The interface has three responsibilities:

1. **Inbound normalisation** ([parseIncoming](#parseincoming)) -- Convert the provider's
   proprietary wire format into [MediaStreamIncoming](../type-aliases/MediaStreamIncoming.md) events.
2. **Outbound formatting** ([formatOutgoing](#formatoutgoing)) -- Wrap mu-law audio
   bytes in whatever envelope the provider expects.
3. **Connection handshake** ([formatConnected](#formatconnected)) -- Optionally generate
   a first-message acknowledgment required by some providers (e.g., Twilio).

## See

 - TwilioMediaStreamParser -- JSON envelope, base64 audio, `connected` ack.
 - TelnyxMediaStreamParser -- JSON inbound, raw binary outbound, no ack.
 - PlivoMediaStreamParser  -- JSON envelope, `playAudio` outbound, no ack.

## Methods

### formatConnected()?

> `optional` **formatConnected**(`streamSid`): `string` \| `null`

Defined in: [packages/agentos/src/channels/telephony/MediaStreamParser.ts:106](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/MediaStreamParser.ts#L106)

Generate the initial connection acknowledgment message, if the provider
requires one immediately after the WebSocket handshake.

- **Twilio**: Returns `{ event: 'connected', protocol: 'Call', version: '1.0.0' }`.
- **Telnyx**: Returns `null` (no handshake needed).
- **Plivo**: Not defined (no handshake needed).

#### Parameters

##### streamSid

`string`

The stream identifier established during the handshake.

#### Returns

`string` \| `null`

A JSON string to send as the first WS message, or `null` if the
  provider does not need an explicit acknowledgment.

***

### formatOutgoing()

> **formatOutgoing**(`audio`, `streamSid`): `string` \| `Buffer`

Defined in: [packages/agentos/src/channels/telephony/MediaStreamParser.ts:92](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/MediaStreamParser.ts#L92)

Encode mu-law audio for transmission back to the telephony provider.

The returned type varies by provider:
- **Twilio**: Returns a JSON `string` wrapping base64-encoded audio in a
  `{ event: 'media', streamSid, media: { payload } }` envelope.
- **Telnyx**: Returns the raw `Buffer` unchanged (binary WS frame).
- **Plivo**: Returns a JSON `string` with a `{ event: 'playAudio', media: { payload } }` envelope.

#### Parameters

##### audio

`Buffer`

Raw mu-law PCM bytes to send to the caller.

##### streamSid

`string`

Provider stream identifier required by some formats.

#### Returns

`string` \| `Buffer`

A `Buffer` (for providers that accept raw binary) or a JSON
  `string` (for providers that wrap audio in an envelope).

***

### parseIncoming()

> **parseIncoming**(`data`): [`MediaStreamIncoming`](../type-aliases/MediaStreamIncoming.md) \| `null`

Defined in: [packages/agentos/src/channels/telephony/MediaStreamParser.ts:76](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/MediaStreamParser.ts#L76)

Parse a raw WebSocket message received from the telephony provider.

Implementations must handle both `Buffer` (binary frames) and `string`
(text frames) inputs, since different providers and WebSocket libraries
deliver data in different forms.

#### Parameters

##### data

Raw message bytes or string as delivered by the WS frame.

`string` | `Buffer`

#### Returns

[`MediaStreamIncoming`](../type-aliases/MediaStreamIncoming.md) \| `null`

A normalised [MediaStreamIncoming](../type-aliases/MediaStreamIncoming.md) event, or `null` if the
  message should be silently ignored (e.g. unknown event type, outbound
  audio track, heartbeat frames, etc.).
