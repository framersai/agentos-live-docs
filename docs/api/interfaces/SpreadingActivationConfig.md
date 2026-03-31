# Interface: SpreadingActivationConfig

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:54](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/IMemoryGraph.ts#L54)

## Properties

### activationThreshold?

> `optional` **activationThreshold**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:60](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/IMemoryGraph.ts#L60)

Minimum activation to continue spreading.

#### Default

```ts
0.1
```

***

### decayPerHop?

> `optional` **decayPerHop**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:58](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/IMemoryGraph.ts#L58)

Activation decay per hop (multiplied each step).

#### Default

```ts
0.5
```

***

### maxDepth?

> `optional` **maxDepth**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:56](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/IMemoryGraph.ts#L56)

Maximum hops from seed nodes.

#### Default

```ts
3
```

***

### maxResults?

> `optional` **maxResults**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:62](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/IMemoryGraph.ts#L62)

Maximum activated nodes to return.

#### Default

```ts
20
```
