# Interface: ISpeechToTextProvider

Defined in: [packages/agentos/src/rag/multimodal/types.ts:308](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/multimodal/types.ts#L308)

Minimal interface for a speech-to-text provider.

This is kept intentionally narrow to avoid coupling the multimodal
indexer to a specific STT service. Any service that can transcribe
audio buffers satisfies this contract.

## Example

```typescript
const sttProvider: ISpeechToTextProvider = {
  transcribe: async (audio, language) => {
    const response = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: audio,
      language,
    });
    return response.text;
  },
};
```

## Methods

### transcribe()

> **transcribe**(`audio`, `language?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/rag/multimodal/types.ts:316](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/multimodal/types.ts#L316)

Transcribe audio data to text.

#### Parameters

##### audio

`Buffer`

Raw audio data as a Buffer.

##### language?

`string`

Optional BCP-47 language code hint.

#### Returns

`Promise`\<`string`\>

The transcribed text.
