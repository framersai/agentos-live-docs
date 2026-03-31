# Class: RaptorTree

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:267](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/raptor/RaptorTree.ts#L267)

RAPTOR — Recursive Abstractive Processing for Tree-Organized Retrieval.

Builds a hierarchical summary tree over document chunks, enabling retrieval
at multiple levels of abstraction. Leaf nodes contain original chunks while
higher layers contain progressively more abstract summaries.

## Example

```typescript
const raptor = new RaptorTree({
  llmCaller: async (prompt) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content ?? '';
  },
  embeddingManager: myEmbeddingManager,
  vectorStore: myVectorStore,
  clusterSize: 8,
  maxDepth: 3,
});

// Build tree from 100 document chunks
const stats = await raptor.build(chunks);
console.log(`Built ${stats.totalLayers} layers with ${stats.totalNodes} total nodes`);

// Search all layers simultaneously
const results = await raptor.search('What are the main themes?', 10);
for (const r of results) {
  console.log(`[Layer ${r.layer}] ${r.id}: ${r.score.toFixed(3)} — ${r.text.slice(0, 80)}...`);
}
```

## Constructors

### Constructor

> **new RaptorTree**(`config`): `RaptorTree`

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:309](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/raptor/RaptorTree.ts#L309)

Creates a new RaptorTree.

#### Parameters

##### config

[`RaptorTreeConfig`](../interfaces/RaptorTreeConfig.md)

Configuration including LLM caller,
  embedding manager, vector store, and clustering parameters.

#### Returns

`RaptorTree`

#### Example

```typescript
const raptor = new RaptorTree({
  llmCaller: myLlm,
  embeddingManager: myEmbeddings,
  vectorStore: myStore,
  clusterSize: 8,
  maxDepth: 4,
});
```

## Methods

### build()

> **build**(`chunks`): `Promise`\<[`RaptorTreeStats`](../interfaces/RaptorTreeStats.md)\>

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:356](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/raptor/RaptorTree.ts#L356)

Builds the RAPTOR tree from a set of leaf chunks.

Pipeline for each layer:
1. Embed all current-layer chunks
2. Cluster similar chunks using k-means
3. Summarize each cluster using the LLM with chain-of-thought
4. Embed summaries and store in vector store with layer metadata
5. Treat summaries as the next layer's input and repeat

Stops when:
- Fewer than `minChunksForLayer` summaries were produced
- Maximum depth is reached
- Only one cluster remains (root summary)

#### Parameters

##### chunks

[`RaptorInputChunk`](../interfaces/RaptorInputChunk.md)[]

Leaf chunks to build the tree from.

#### Returns

`Promise`\<[`RaptorTreeStats`](../interfaces/RaptorTreeStats.md)\>

Statistics about the constructed tree.

#### Throws

If embedding or storage fails critically.

#### Example

```typescript
const chunks = documents.map((doc, i) => ({
  id: `chunk-${i}`,
  text: doc.content,
  metadata: { source: doc.source },
}));
const stats = await raptor.build(chunks);
console.log(`Tree has ${stats.totalLayers} layers`);
```

***

### getStats()

> **getStats**(): [`RaptorTreeStats`](../interfaces/RaptorTreeStats.md)

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:529](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/raptor/RaptorTree.ts#L529)

Returns statistics about the last tree build.

#### Returns

[`RaptorTreeStats`](../interfaces/RaptorTreeStats.md)

Tree statistics including layer counts, node counts,
  cluster counts, and build time.

#### Example

```typescript
const stats = raptor.getStats();
console.log(`Layers: ${stats.totalLayers}, Nodes: ${stats.totalNodes}`);
```

***

### search()

> **search**(`query`, `topK?`): `Promise`\<[`RaptorResult`](../interfaces/RaptorResult.md)[]\>

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:473](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/raptor/RaptorTree.ts#L473)

Searches ALL layers of the RAPTOR tree simultaneously.

This is the key advantage of RAPTOR: a detail query will match leaf
chunks, while a thematic query will match higher-layer summaries.
Both types of results are returned together, sorted by relevance.

#### Parameters

##### query

`string`

The search query.

##### topK?

`number` = `10`

Maximum number of results across all layers.

#### Returns

`Promise`\<[`RaptorResult`](../interfaces/RaptorResult.md)[]\>

Results from all layers, sorted by score.

#### Throws

If embedding or vector search fails.

#### Example

```typescript
const results = await raptor.search('authentication architecture', 10);
// May return:
// - Layer 0 chunks about specific auth implementations
// - Layer 1 summaries about auth patterns
// - Layer 2 high-level summary about security architecture
```
