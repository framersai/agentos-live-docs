# Function: convertMulawToPcm16()

> **convertMulawToPcm16**(`mulawBuffer`): `Buffer`

Defined in: [packages/agentos/src/channels/telephony/telephony-audio.ts:95](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/telephony-audio.ts#L95)

Convert mu-law 8kHz audio to PCM signed 16-bit LE.

## Parameters

### mulawBuffer

`Buffer`

Mu-law encoded audio data.

## Returns

`Buffer`

Buffer of PCM signed 16-bit little-endian audio.
