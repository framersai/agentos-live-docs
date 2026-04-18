# Function: convertPcmToMulaw8k()

> **convertPcmToMulaw8k**(`pcmBuffer`, `sampleRate`): `Buffer`

Defined in: [packages/agentos/src/channels/telephony/telephony-audio.ts:69](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/telephony-audio.ts#L69)

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
