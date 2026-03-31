# Interface: ISpeechToTextProvider

Defined in: [packages/agentos/src/rag/multimodal/types.ts:308](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/multimodal/types.ts#L308)

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

Defined in: [packages/agentos/src/rag/multimodal/types.ts:316](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/multimodal/types.ts#L316)

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
