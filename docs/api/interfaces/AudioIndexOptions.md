# Interface: AudioIndexOptions

Defined in: [packages/agentos/src/rag/multimodal/types.ts:96](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/multimodal/types.ts#L96)

Options for indexing an audio file into the vector store.

The audio is transcribed via an STT provider, then the transcript
is embedded and stored alongside the original audio reference.

## Example

```typescript
const result = await indexer.indexAudio({
  audio: fs.readFileSync('./recording.wav'),
  metadata: { source: 'meeting', duration: 3600 },
  language: 'en',
});
```

## Properties

### audio

> **audio**: `Buffer`

Defined in: [packages/agentos/src/rag/multimodal/types.ts:101](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/multimodal/types.ts#L101)

Audio data as a raw Buffer (WAV, MP3, OGG, etc.).
The format must be supported by the configured STT provider.

***

### collection?

> `optional` **collection**: `string`

Defined in: [packages/agentos/src/rag/multimodal/types.ts:113](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/multimodal/types.ts#L113)

Vector store collection to index into.

#### Default

```ts
'multimodal'
```

***

### language?

> `optional` **language**: `string`

Defined in: [packages/agentos/src/rag/multimodal/types.ts:119](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/multimodal/types.ts#L119)

BCP-47 language hint for the STT provider (e.g. 'en', 'es', 'ja').
Improves transcription accuracy for non-English audio.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/rag/multimodal/types.ts:107](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/multimodal/types.ts#L107)

Optional metadata to attach to the indexed document.
Stored alongside the embedding for filtering during search.
