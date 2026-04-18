# Interface: EmotionalContext

Defined in: [packages/agentos/src/memory/core/types.ts:56](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L56)

## Properties

### arousal

> **arousal**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:60](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L60)

Arousal dimension, 0 (calm) to 1 (excited).

***

### dominance

> **dominance**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:62](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L62)

Dominance dimension, -1 (submissive) to 1 (dominant).

***

### gmiMood

> **gmiMood**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:66](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L66)

GMIMood enum string at encoding time.

***

### intensity

> **intensity**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:64](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L64)

Derived emotional intensity: |valence| * arousal.

***

### valence

> **valence**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:58](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L58)

Pleasure / valence dimension, -1 (negative) to 1 (positive).
