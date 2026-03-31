# Interface: HnswSidecarConfig

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:23](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/HnswSidecar.ts#L23)

Configuration for the memory-specific HNSW sidecar wrapper.

## Properties

### autoThreshold?

> `optional` **autoThreshold**: `number`

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:29](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/HnswSidecar.ts#L29)

Auto-build threshold. Below this count, brute-force is used.

#### Default

```ts
1000
```

***

### dimensions

> **dimensions**: `number`

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:27](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/HnswSidecar.ts#L27)

Embedding dimensions.

***

### efConstruction?

> `optional` **efConstruction**: `number`

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:33](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/HnswSidecar.ts#L33)

HNSW efConstruction (build quality).

#### Default

```ts
200
```

***

### efSearch?

> `optional` **efSearch**: `number`

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:35](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/HnswSidecar.ts#L35)

HNSW efSearch (query quality).

#### Default

```ts
50
```

***

### m?

> `optional` **m**: `number`

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:31](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/HnswSidecar.ts#L31)

HNSW M parameter (connections per node).

#### Default

```ts
16
```

***

### sqlitePath

> **sqlitePath**: `string`

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:25](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/store/HnswSidecar.ts#L25)

Path to brain.sqlite — HNSW file will be at same dir with .hnsw extension.
