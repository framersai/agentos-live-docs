# Function: convertMulawToPcm16()

> **convertMulawToPcm16**(`mulawBuffer`): `Buffer`

Defined in: [packages/agentos/src/channels/telephony/telephony-audio.ts:95](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/telephony-audio.ts#L95)

Convert mu-law 8kHz audio to PCM signed 16-bit LE.

## Parameters

### mulawBuffer

`Buffer`

Mu-law encoded audio data.

## Returns

`Buffer`

Buffer of PCM signed 16-bit little-endian audio.
