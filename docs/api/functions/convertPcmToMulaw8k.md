# Function: convertPcmToMulaw8k()

> **convertPcmToMulaw8k**(`pcmBuffer`, `sampleRate`): `Buffer`

Defined in: [packages/agentos/src/channels/telephony/telephony-audio.ts:69](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/telephony-audio.ts#L69)

Convert PCM audio buffer to mu-law 8kHz mono format for telephony.

## Parameters

### pcmBuffer

`Buffer`

Raw PCM audio data (signed 16-bit little-endian).

### sampleRate

`number`

Sample rate of the input PCM data.

## Returns

`Buffer`

Buffer of mu-law encoded audio at 8kHz mono.

## Example

```typescript
// TTS returns 24kHz PCM
const ttsAudio = await ttsProvider.synthesize("Hello");
const phoneAudio = convertPcmToMulaw8k(ttsAudio, 24000);
mediaStream.sendAudio(streamSid, phoneAudio);
```
