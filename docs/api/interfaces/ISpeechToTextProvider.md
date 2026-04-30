# Interface: ISpeechToTextProvider

Defined in: [packages/agentos/src/rag/multimodal/types.ts:344](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/multimodal/types.ts#L344)

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

Defined in: [packages/agentos/src/rag/multimodal/types.ts:352](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/multimodal/types.ts#L352)

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
