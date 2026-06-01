# Function: convertMulawToPcm16()

> **convertMulawToPcm16**(`mulawBuffer`): `Buffer`

Defined in: [packages/agentos/src/io/channels/telephony/telephony-audio.ts:95](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/telephony/telephony-audio.ts#L95)

Convert mu-law 8kHz audio to PCM signed 16-bit LE.

## Parameters

### mulawBuffer

`Buffer`

Mu-law encoded audio data.

## Returns

`Buffer`

Buffer of PCM signed 16-bit little-endian audio.
