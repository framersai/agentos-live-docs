# Interface: EmotionalContext

Defined in: [packages/agentos/src/memory/core/types.ts:63](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L63)

## Properties

### arousal

> **arousal**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:67](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L67)

Arousal dimension, 0 (calm) to 1 (excited).

***

### dominance

> **dominance**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:69](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L69)

Dominance dimension, -1 (submissive) to 1 (dominant).

***

### gmiMood

> **gmiMood**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:73](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L73)

GMIMood enum string at encoding time.

***

### intensity

> **intensity**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:71](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L71)

Derived emotional intensity: |valence| * arousal.

***

### valence

> **valence**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:65](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L65)

Pleasure / valence dimension, -1 (negative) to 1 (positive).
