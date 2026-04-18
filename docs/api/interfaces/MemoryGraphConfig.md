# Interface: MemoryGraphConfig

Defined in: [packages/agentos/src/memory/core/config.ts:91](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/config.ts#L91)

Configuration for the memory graph subsystem.

The memory graph powers spreading activation (Collins & Quillian model),
Hebbian co-activation learning ("neurons that fire together wire together"),
conflict detection, clustering, and graph-boosted retrieval scoring.

Enabled by default when CognitiveMemoryManager is initialized.
Set `disabled: true` to opt out entirely.

## Properties

### activationThreshold?

> `optional` **activationThreshold**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:106](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/config.ts#L106)

Minimum activation to continue spreading (0-1).

#### Default

```ts
0.1
```

***

### backend?

> `optional` **backend**: `"graphology"` \| `"knowledge-graph"`

Defined in: [packages/agentos/src/memory/core/config.ts:100](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/config.ts#L100)

Which graph backend to use.

#### Default

```ts
'knowledge-graph'
```

***

### decayPerHop?

> `optional` **decayPerHop**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:104](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/config.ts#L104)

Activation decay per hop (0-1).

#### Default

```ts
0.5
```

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [packages/agentos/src/memory/core/config.ts:98](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/config.ts#L98)

Set to true to disable the memory graph entirely.
When disabled, spreading activation, Hebbian co-activation,
and graph-based retrieval boosting are all skipped.

#### Default

```ts
false
```

***

### hebbianLearningRate?

> `optional` **hebbianLearningRate**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:108](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/config.ts#L108)

Hebbian learning rate for co-activation edge strengthening (0-1).

#### Default

```ts
0.1
```

***

### maxDepth?

> `optional` **maxDepth**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:102](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/config.ts#L102)

Max hops for spreading activation.

#### Default

```ts
3
```
