# Function: convertMulawToPcm16()

> **convertMulawToPcm16**(`mulawBuffer`): `Buffer`

Defined in: [packages/agentos/src/channels/telephony/telephony-audio.ts:95](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/telephony-audio.ts#L95)

Convert mu-law 8kHz audio to PCM signed 16-bit LE.

## Parameters

### mulawBuffer

`Buffer`

Mu-law encoded audio data.

## Returns

`Buffer`

Buffer of PCM signed 16-bit little-endian audio.
