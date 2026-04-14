# Interface: ObservationNote

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:36](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/observation/MemoryObserver.ts#L36)

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:41](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/observation/MemoryObserver.ts#L41)

Short summary of the observation.

***

### emotionalContext?

> `optional` **emotionalContext**: `object`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:47](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/observation/MemoryObserver.ts#L47)

Emotional context at observation time.

#### arousal

> **arousal**: `number`

#### valence

> **valence**: `number`

***

### entities

> **entities**: `string`[]

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:45](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/observation/MemoryObserver.ts#L45)

Entities mentioned.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:37](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/observation/MemoryObserver.ts#L37)

***

### importance

> **importance**: `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:43](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/observation/MemoryObserver.ts#L43)

0-1 importance score.

***

### temporal?

> `optional` **temporal**: `object`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:50](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/observation/MemoryObserver.ts#L50)

Three-date temporal metadata.

#### observedAt

> **observedAt**: `number`

When this observation was made (Unix ms). Same as timestamp.

#### referencedAt

> **referencedAt**: `number`

When the referenced event actually occurred (Unix ms).

#### relativeLabel

> **relativeLabel**: `string`

Human-friendly relative time label.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:48](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/observation/MemoryObserver.ts#L48)

***

### type

> **type**: `"preference"` \| `"correction"` \| `"emotional"` \| `"factual"` \| `"commitment"` \| `"creative"`

Defined in: [packages/agentos/src/memory/pipeline/observation/MemoryObserver.ts:39](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/observation/MemoryObserver.ts#L39)

Category of observation.
