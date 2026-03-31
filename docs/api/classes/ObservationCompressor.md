# Class: ObservationCompressor

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationCompressor.ts:122](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/ObservationCompressor.ts#L122)

LLM-based compressor that takes a batch of [ObservationNote](../interfaces/ObservationNote.md) objects
and produces denser [CompressedObservation](../interfaces/CompressedObservation.md) summaries.

Achieves 3-10x compression while preserving key facts, entities, and
temporal context. Each compressed observation carries three-date temporal
metadata: when the compression happened, the earliest referenced event,
and a human-friendly relative time label.

## Constructors

### Constructor

> **new ObservationCompressor**(`llmInvoker`, `traits?`): `ObservationCompressor`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationCompressor.ts:127](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/ObservationCompressor.ts#L127)

#### Parameters

##### llmInvoker

(`system`, `user`) => `Promise`\<`string`\>

Function that calls an LLM with (system, user) prompts.

##### traits?

[`HexacoTraits`](../interfaces/HexacoTraits.md)

Optional HEXACO personality traits for bias-aware compression.

#### Returns

`ObservationCompressor`

## Methods

### compress()

> **compress**(`notes`): `Promise`\<[`CompressedObservation`](../interfaces/CompressedObservation.md)[]\>

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationCompressor.ts:144](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/observation/ObservationCompressor.ts#L144)

Compress a batch of observation notes into denser summaries.

The method:
1. Formats the notes as a numbered list for the LLM.
2. Sends the batch to the LLM with a compression prompt.
3. Parses the JSON array response into [CompressedObservation](../interfaces/CompressedObservation.md) objects.
4. Attaches three-date temporal metadata (observedAt, referencedAt, relativeLabel).

#### Parameters

##### notes

[`ObservationNote`](../interfaces/ObservationNote.md)[]

Batch of observation notes to compress.

#### Returns

`Promise`\<[`CompressedObservation`](../interfaces/CompressedObservation.md)[]\>

Array of compressed observations. Returns empty array on LLM failure.
