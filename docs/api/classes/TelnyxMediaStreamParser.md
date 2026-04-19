# Class: TelnyxMediaStreamParser

Defined in: [packages/agentos/src/channels/telephony/parsers/TelnyxMediaStreamParser.ts:56](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/telephony/parsers/TelnyxMediaStreamParser.ts#L56)

Parses the Telnyx media stream WebSocket protocol.

Telnyx sends JSON-encoded messages for stream lifecycle events (`start`,
`stop`) and audio chunks (`media`). Unlike Twilio, Telnyx does NOT deliver
DTMF events over the media stream WebSocket -- those arrive as HTTP webhooks
to a separate endpoint and must be handled outside this parser.

Outgoing audio is sent as a **raw binary Buffer** (mu-law PCM bytes without
any JSON envelope) because Telnyx accepts unframed binary WebSocket frames
directly. No explicit connection acknowledgment is needed after the
handshake.

## See

[https://developers.telnyx.com/docs/voice/media-streaming](https://developers.telnyx.com/docs/voice/media-streaming)

## Implements

- [`MediaStreamParser`](../interfaces/MediaStreamParser.md)

## Constructors

### Constructor

> **new TelnyxMediaStreamParser**(): `TelnyxMediaStreamParser`

#### Returns

`TelnyxMediaStreamParser`

## Methods

### formatConnected()

> **formatConnected**(`_streamSid`): `null`

Defined in: [packages/agentos/src/channels/telephony/parsers/TelnyxMediaStreamParser.ts:161](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/telephony/parsers/TelnyxMediaStreamParser.ts#L161)

No explicit connection acknowledgment is required by Telnyx.

Unlike Twilio, Telnyx does not need a `connected` handshake message
before it starts sending media events.

#### Parameters

##### \_streamSid

`string`

Unused (accepted for interface parity).

#### Returns

`null`

Always `null`.

#### Implementation of

[`MediaStreamParser`](../interfaces/MediaStreamParser.md).[`formatConnected`](../interfaces/MediaStreamParser.md#formatconnected)

***

### formatOutgoing()

> **formatOutgoing**(`audio`, `_streamSid`): `Buffer`

Defined in: [packages/agentos/src/channels/telephony/parsers/TelnyxMediaStreamParser.ts:148](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/telephony/parsers/TelnyxMediaStreamParser.ts#L148)

Encode mu-law audio for transmission back to Telnyx.

Telnyx accepts raw binary WebSocket frames -- no JSON wrapping is needed.
This is the key asymmetry in Telnyx's protocol: inbound is JSON, outbound
is raw binary.

#### Parameters

##### audio

`Buffer`

Raw mu-law PCM bytes to send to the caller.

##### \_streamSid

`string`

Unused by Telnyx binary framing (accepted for interface
  parity with other parsers).

#### Returns

`Buffer`

The audio Buffer unchanged, ready to send as a binary WS frame.

#### Implementation of

[`MediaStreamParser`](../interfaces/MediaStreamParser.md).[`formatOutgoing`](../interfaces/MediaStreamParser.md#formatoutgoing)

***

### parseIncoming()

> **parseIncoming**(`data`): [`MediaStreamIncoming`](../type-aliases/MediaStreamIncoming.md) \| `null`

Defined in: [packages/agentos/src/channels/telephony/parsers/TelnyxMediaStreamParser.ts:75](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/telephony/parsers/TelnyxMediaStreamParser.ts#L75)

Parse a raw WebSocket frame from Telnyx's media stream.

Supported Telnyx event types:
- `start` -- stream established; `stream_id` maps to `streamSid`,
  `call_control_id` maps to `callSid`.
- `media` -- audio chunk; `media.chunk` field contains base64-encoded mu-law
  bytes; only `inbound` track frames are returned (outbound echoes are
  discarded to prevent feedback loops).
- `stop`  -- stream ended (call terminated or stream explicitly closed).

Any other event type (e.g., future Telnyx additions, DTMF attempts) is
silently dropped by returning `null`.

#### Parameters

##### data

Raw WebSocket frame payload (JSON string or Buffer from Telnyx).

`string` | `Buffer`

#### Returns

[`MediaStreamIncoming`](../type-aliases/MediaStreamIncoming.md) \| `null`

Normalised [MediaStreamIncoming](../type-aliases/MediaStreamIncoming.md) event, or `null` for
  outbound audio tracks, unknown event types, or malformed messages.

#### Implementation of

[`MediaStreamParser`](../interfaces/MediaStreamParser.md).[`parseIncoming`](../interfaces/MediaStreamParser.md#parseincoming)
