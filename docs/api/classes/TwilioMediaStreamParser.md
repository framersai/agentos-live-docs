# Class: TwilioMediaStreamParser

Defined in: [packages/agentos/src/channels/telephony/parsers/TwilioMediaStreamParser.ts:69](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/parsers/TwilioMediaStreamParser.ts#L69)

Parses the Twilio `<Connect><Stream>` WebSocket media stream protocol.

Twilio sends all messages as JSON-encoded strings. Outbound audio is
wrapped in the same JSON envelope so Twilio can associate it with the
correct stream. An explicit `connected` acknowledgment is sent once
immediately after the WebSocket handshake to signal that the listener is
ready to receive media.

## See

[https://www.twilio.com/docs/voice/twiml/stream](https://www.twilio.com/docs/voice/twiml/stream)

## Implements

- [`MediaStreamParser`](../interfaces/MediaStreamParser.md)

## Constructors

### Constructor

> **new TwilioMediaStreamParser**(): `TwilioMediaStreamParser`

#### Returns

`TwilioMediaStreamParser`

## Methods

### formatConnected()

> **formatConnected**(`_streamSid`): `string`

Defined in: [packages/agentos/src/channels/telephony/parsers/TwilioMediaStreamParser.ts:220](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/parsers/TwilioMediaStreamParser.ts#L220)

Generate the initial `connected` acknowledgment expected by Twilio
immediately after the WebSocket connection is established.

Without this message, Twilio waits indefinitely for a response and
eventually times out the stream connection.

#### Parameters

##### \_streamSid

`string`

Unused -- Twilio does not require the stream ID in the
  `connected` message, but the parameter is accepted for interface parity.

#### Returns

`string`

JSON string: `{ event: 'connected', protocol: 'Call', version: '1.0.0' }`

#### Implementation of

[`MediaStreamParser`](../interfaces/MediaStreamParser.md).[`formatConnected`](../interfaces/MediaStreamParser.md#formatconnected)

***

### formatOutgoing()

> **formatOutgoing**(`audio`, `streamSid`): `string`

Defined in: [packages/agentos/src/channels/telephony/parsers/TwilioMediaStreamParser.ts:201](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/parsers/TwilioMediaStreamParser.ts#L201)

Encode mu-law audio for transmission back to the Twilio stream.

Twilio requires base64-encoded audio wrapped in a JSON `media` envelope
so it can route the audio to the correct stream by `streamSid`.

#### Parameters

##### audio

`Buffer`

Raw mu-law PCM bytes to send to the caller.

##### streamSid

`string`

The stream identifier to include in the envelope.

#### Returns

`string`

JSON string conforming to the Twilio media-out envelope format:
  `{ event: 'media', streamSid: '...', media: { payload: '<base64>' } }`

#### Implementation of

[`MediaStreamParser`](../interfaces/MediaStreamParser.md).[`formatOutgoing`](../interfaces/MediaStreamParser.md#formatoutgoing)

***

### parseIncoming()

> **parseIncoming**(`data`): [`MediaStreamIncoming`](../type-aliases/MediaStreamIncoming.md) \| `null`

Defined in: [packages/agentos/src/channels/telephony/parsers/TwilioMediaStreamParser.ts:88](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/parsers/TwilioMediaStreamParser.ts#L88)

Parse a raw WebSocket frame from Twilio's media stream.

Supported Twilio event types:
- `start`  -- stream established, includes callSid and media format metadata.
- `media`  -- audio chunk (inbound track only; outbound echoes are discarded
  to prevent feedback loops).
- `dtmf`   -- DTMF keypress detected on the audio stream.
- `stop`   -- stream ended (call hangup or stream disconnect).
- `mark`   -- named synchronisation marker confirming playback reached a point.

Messages with missing `event` or `streamSid` fields, malformed JSON,
or unrecognised event types are silently dropped (return `null`).

#### Parameters

##### data

Raw WebSocket frame payload (always a JSON string from Twilio).

`string` | `Buffer`

#### Returns

[`MediaStreamIncoming`](../type-aliases/MediaStreamIncoming.md) \| `null`

Normalised [MediaStreamIncoming](../type-aliases/MediaStreamIncoming.md) event, or `null` for
  outbound audio tracks, unknown event types, or malformed messages.

#### Implementation of

[`MediaStreamParser`](../interfaces/MediaStreamParser.md).[`parseIncoming`](../interfaces/MediaStreamParser.md#parseincoming)
