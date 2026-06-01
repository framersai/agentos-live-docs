# Interface: EmotionalContext

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:86](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L86)

## Properties

### arousal

> **arousal**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:90](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L90)

Arousal dimension, 0 (calm) to 1 (excited).

***

### dominance

> **dominance**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:92](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L92)

Dominance dimension, -1 (submissive) to 1 (dominant).

***

### gmiMood

> **gmiMood**: `string`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:96](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L96)

GMIMood enum string at encoding time.

***

### intensity

> **intensity**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:94](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L94)

Derived emotional intensity: |valence| * arousal.

***

### valence

> **valence**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:88](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L88)

Pleasure / valence dimension, -1 (negative) to 1 (positive).
