# Interface: MemoryGraphConfig

Defined in: [packages/agentos/src/memory/core/config.ts:81](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/config.ts#L81)

## Properties

### activationThreshold

> **activationThreshold**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:89](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/config.ts#L89)

Minimum activation to continue spreading.

#### Default

```ts
0.1
```

***

### backend

> **backend**: `"graphology"` \| `"knowledge-graph"`

Defined in: [packages/agentos/src/memory/core/config.ts:83](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/config.ts#L83)

Which backend to use.

#### Default

```ts
'knowledge-graph'
```

***

### decayPerHop

> **decayPerHop**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:87](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/config.ts#L87)

Activation decay per hop.

#### Default

```ts
0.5
```

***

### hebbianLearningRate

> **hebbianLearningRate**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:91](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/config.ts#L91)

Hebbian learning rate for co-activation edge strengthening.

#### Default

```ts
0.1
```

***

### maxDepth

> **maxDepth**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:85](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/config.ts#L85)

Max hops for spreading activation.

#### Default

```ts
3
```
