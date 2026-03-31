# Class: PlivoMediaStreamParser

Defined in: [packages/agentos/src/channels/telephony/parsers/PlivoMediaStreamParser.ts:68](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/parsers/PlivoMediaStreamParser.ts#L68)

Parses the Plivo Audio Stream WebSocket protocol.

Plivo sends JSON-encoded messages for stream lifecycle events (`start`,
`stop`) and audio chunks (`media`). The audio payload is base64-encoded
mu-law PCM, delivered in a `payload` field inside the `media` object.

Outgoing audio is wrapped in a `playAudio` JSON envelope, which is the
format Plivo expects when the server streams audio back to the caller.
No explicit connection acknowledgment is required after the handshake.

## See

[https://www.plivo.com/docs/voice/xml/stream](https://www.plivo.com/docs/voice/xml/stream)

## Implements

- [`MediaStreamParser`](../interfaces/MediaStreamParser.md)

## Constructors

### Constructor

> **new PlivoMediaStreamParser**(): `PlivoMediaStreamParser`

#### Returns

`PlivoMediaStreamParser`

## Methods

### formatOutgoing()

> **formatOutgoing**(`audio`, `_streamSid`): `string`

Defined in: [packages/agentos/src/channels/telephony/parsers/PlivoMediaStreamParser.ts:156](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/parsers/PlivoMediaStreamParser.ts#L156)

Encode mu-law audio for transmission back to Plivo.

Plivo requires audio to be base64-encoded and wrapped in a `playAudio`
JSON envelope. Unlike Twilio, the `streamSid` / `stream_id` is NOT
included in the outbound message -- Plivo implicitly routes the audio
to the caller on the same WebSocket connection.

#### Parameters

##### audio

`Buffer`

Raw mu-law PCM bytes to send to the caller.

##### \_streamSid

`string`

Unused by Plivo's `playAudio` format (accepted for
  interface parity with other parsers).

#### Returns

`string`

JSON string: `{ event: 'playAudio', media: { payload: '<base64>' } }`

#### Implementation of

[`MediaStreamParser`](../interfaces/MediaStreamParser.md).[`formatOutgoing`](../interfaces/MediaStreamParser.md#formatoutgoing)

***

### parseIncoming()

> **parseIncoming**(`data`): [`MediaStreamIncoming`](../type-aliases/MediaStreamIncoming.md) \| `null`

Defined in: [packages/agentos/src/channels/telephony/parsers/PlivoMediaStreamParser.ts:87](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/parsers/PlivoMediaStreamParser.ts#L87)

Parse a raw WebSocket frame from Plivo's audio stream.

Supported Plivo event types:
- `start` -- stream established; `stream_id` maps to `streamSid`,
  `call_uuid` maps to `callSid`.
- `media` -- audio chunk; `media.payload` contains base64-encoded mu-law
  PCM bytes.
- `stop`  -- stream ended (call terminated or stream explicitly closed).

Any other event type is silently dropped by returning `null`. Malformed
JSON or messages missing required fields (`event`, `stream_id`) also
return `null`.

#### Parameters

##### data

Raw WebSocket frame payload (JSON string or Buffer from Plivo).

`string` | `Buffer`

#### Returns

[`MediaStreamIncoming`](../type-aliases/MediaStreamIncoming.md) \| `null`

Normalised [MediaStreamIncoming](../type-aliases/MediaStreamIncoming.md) event, or `null` for
  unknown event types or malformed messages.

#### Implementation of

[`MediaStreamParser`](../interfaces/MediaStreamParser.md).[`parseIncoming`](../interfaces/MediaStreamParser.md#parseincoming)
