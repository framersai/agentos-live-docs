# Interface: Reflection

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationReflector.ts:37](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/observation/ObservationReflector.ts#L37)

A high-level insight derived from multiple compressed observations.
Reflections are the highest tier in the observation hierarchy:
  raw notes → compressed observations → reflections.

## Properties

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationReflector.ts:45](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/observation/ObservationReflector.ts#L45)

Confidence in this reflection (0-1).

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationReflector.ts:39](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/observation/ObservationReflector.ts#L39)

Unique identifier for this reflection.

***

### insight

> **insight**: `string`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationReflector.ts:41](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/observation/ObservationReflector.ts#L41)

High-level insight text (1-3 sentences).

***

### patternType

> **patternType**: [`ReflectionPatternType`](../type-aliases/ReflectionPatternType.md)

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationReflector.ts:43](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/observation/ObservationReflector.ts#L43)

Pattern type classifier.

***

### sourceIds

> **sourceIds**: `string`[]

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationReflector.ts:47](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/observation/ObservationReflector.ts#L47)

IDs of the source compressed observations.

***

### temporal

> **temporal**: `object`

Defined in: [packages/agentos/src/memory/pipeline/observation/ObservationReflector.ts:49](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/observation/ObservationReflector.ts#L49)

Temporal span covered by this reflection.

#### reflectedAt

> **reflectedAt**: `number`

When this reflection was produced (Unix ms).

#### relativeLabel

> **relativeLabel**: `string`

Human-friendly label for the temporal span.

#### spanEnd

> **spanEnd**: `number`

Latest source timestamp in the compressed observations (Unix ms).

#### spanStart

> **spanStart**: `number`

Earliest source timestamp in the compressed observations (Unix ms).
