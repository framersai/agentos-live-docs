# Interface: SpeechTranscriptionResult

Defined in: [packages/agentos/src/speech/types.ts:49](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L49)

## Properties

### confidence?

> `optional` **confidence**: `number`

Defined in: [packages/agentos/src/speech/types.ts:56](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L56)

***

### cost

> **cost**: `number`

Defined in: [packages/agentos/src/speech/types.ts:53](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L53)

***

### durationSeconds?

> `optional` **durationSeconds**: `number`

Defined in: [packages/agentos/src/speech/types.ts:52](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L52)

***

### isFinal?

> `optional` **isFinal**: `boolean`

Defined in: [packages/agentos/src/speech/types.ts:57](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L57)

***

### language?

> `optional` **language**: `string`

Defined in: [packages/agentos/src/speech/types.ts:51](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L51)

***

### providerResponse?

> `optional` **providerResponse**: `unknown`

Defined in: [packages/agentos/src/speech/types.ts:55](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L55)

***

### segments?

> `optional` **segments**: [`SpeechTranscriptionSegment`](SpeechTranscriptionSegment.md)[]

Defined in: [packages/agentos/src/speech/types.ts:54](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L54)

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/speech/types.ts:50](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L50)

***

### usage?

> `optional` **usage**: `object`

Defined in: [packages/agentos/src/speech/types.ts:58](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L58)

#### durationMinutes

> **durationMinutes**: `number`

#### modelUsed

> **modelUsed**: `string`

#### providerSpecific?

> `optional` **providerSpecific**: `Record`\<`string`, `unknown`\>
