# Interface: CompressedObservation

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationCompressor.ts:35](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/ObservationCompressor.ts#L35)

A compressed observation produced by merging multiple raw
[ObservationNote](ObservationNote.md) objects into a single dense summary.

## Properties

### entities

> **entities**: `string`[]

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationCompressor.ts:54](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/ObservationCompressor.ts#L54)

Union of key entities across all source observations.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationCompressor.ts:37](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/ObservationCompressor.ts#L37)

Unique identifier for this compressed observation.

***

### importance

> **importance**: `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationCompressor.ts:56](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/ObservationCompressor.ts#L56)

Average importance score of the source observations (0-1).

***

### priority

> **priority**: [`CompressionPriority`](../type-aliases/CompressionPriority.md)

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationCompressor.ts:41](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/ObservationCompressor.ts#L41)

Triage priority.

***

### sourceIds

> **sourceIds**: `string`[]

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationCompressor.ts:52](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/ObservationCompressor.ts#L52)

IDs of the source [ObservationNote](ObservationNote.md) objects that were compressed.

***

### summary

> **summary**: `string`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationCompressor.ts:39](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/ObservationCompressor.ts#L39)

Dense summary of multiple observations (1-3 sentences).

***

### temporal

> **temporal**: `object`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationCompressor.ts:43](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/pipeline/observation/ObservationCompressor.ts#L43)

Three-date temporal metadata.

#### observedAt

> **observedAt**: `number`

When this compression was performed (Unix ms).

#### referencedAt

> **referencedAt**: `number`

Earliest event timestamp across all source observations (Unix ms).

#### relativeLabel

> **relativeLabel**: `string`

Human-friendly relative time label for `referencedAt`.
