# Type Alias: MediaStreamIncoming

> **MediaStreamIncoming** = \{ `payload`: `Buffer`; `sequenceNumber?`: `number`; `streamSid`: `string`; `type`: `"audio"`; \} \| \{ `digit`: `string`; `durationMs?`: `number`; `streamSid`: `string`; `type`: `"dtmf"`; \} \| \{ `callSid`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `streamSid`: `string`; `type`: `"start"`; \} \| \{ `streamSid`: `string`; `type`: `"stop"`; \} \| \{ `name`: `string`; `streamSid`: `string`; `type`: `"mark"`; \}

Defined in: [packages/agentos/src/channels/telephony/MediaStreamParser.ts:126](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/MediaStreamParser.ts#L126)

Discriminated union of all normalised events that can arrive on a media
stream WebSocket connection, regardless of the underlying telephony provider.

## Variant summary

| `type`   | When it fires                                | Key payload fields          |
|----------|----------------------------------------------|-----------------------------|
| `audio`  | Each inbound audio chunk (~20ms intervals)   | `payload` (mu-law Buffer)   |
| `dtmf`   | Caller presses a phone keypad button         | `digit`, `durationMs?`      |
| `start`  | Stream session begins (metadata available)   | `callSid`, `metadata?`      |
| `stop`   | Stream session ends / call disconnects       | (none beyond `streamSid`)   |
| `mark`   | Named sync point injected into audio stream  | `name`                      |

All variants carry a `streamSid` field to identify which stream the event
belongs to (important when a single server handles multiple concurrent calls).

## Type Declaration

\{ `payload`: `Buffer`; `sequenceNumber?`: `number`; `streamSid`: `string`; `type`: `"audio"`; \}

### payload

> **payload**: `Buffer`

Raw mu-law bytes decoded from whatever encoding the provider uses.

### sequenceNumber?

> `optional` **sequenceNumber**: `number`

Monotonically increasing sequence number, when provided.

### streamSid

> **streamSid**: `string`

Provider-assigned stream identifier.

### type

> **type**: `"audio"`

Inbound audio chunk encoded as mu-law 8-bit 8 kHz PCM.

Audio arrives as small chunks (typically 20ms / 160 bytes) at regular
intervals for the duration of the call. The pipeline must decode
mu-law -> PCM Int16 -> resample -> Float32 before feeding to STT/VAD.

\{ `digit`: `string`; `durationMs?`: `number`; `streamSid`: `string`; `type`: `"dtmf"`; \}

### digit

> **digit**: `string`

Single character digit pressed by the caller (0-9, *, #, A-D).

### durationMs?

> `optional` **durationMs**: `number`

Duration the key was held, in milliseconds, when reported.

### streamSid

> **streamSid**: `string`

Provider-assigned stream identifier.

### type

> **type**: `"dtmf"`

DTMF tone detected by the provider during the call.

Not all providers relay DTMF over the media stream -- Telnyx, for
example, only delivers DTMF via HTTP webhooks. Check the provider's
parser documentation for availability.

\{ `callSid`: `string`; `metadata?`: `Record`\<`string`, `unknown`\>; `streamSid`: `string`; `type`: `"start"`; \}

### callSid

> **callSid**: `string`

Provider call-leg identifier (e.g. Twilio CallSid, Telnyx call_control_id).

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Additional provider-specific metadata attached to the start event.

### streamSid

> **streamSid**: `string`

Provider-assigned stream identifier.

### type

> **type**: `"start"`

Stream successfully started; metadata about the call is available.

This is always the first meaningful event on a new stream connection.
The [TelephonyStreamTransport](../classes/TelephonyStreamTransport.md) transitions from `connecting` to
`open` upon receiving this event and sends the optional
[MediaStreamParser.formatConnected](../interfaces/MediaStreamParser.md#formatconnected) acknowledgment.

\{ `streamSid`: `string`; `type`: `"stop"`; \}

### streamSid

> **streamSid**: `string`

Provider-assigned stream identifier.

### type

> **type**: `"stop"`

Call ended or stream was explicitly stopped.

The [TelephonyStreamTransport](../classes/TelephonyStreamTransport.md) transitions to `closed` and
emits a `'close'` event upon receiving this.

\{ `name`: `string`; `streamSid`: `string`; `type`: `"mark"`; \}

### name

> **name**: `string`

The label assigned to this mark point.

### streamSid

> **streamSid**: `string`

Provider-assigned stream identifier.

### type

> **type**: `"mark"`

Named marker injected into the audio stream for synchronisation.

Marks are used to correlate outbound audio playback completion with
application logic (e.g., knowing when a TTS utterance finished playing
so the agent can transition from `speaking` to `listening`).
