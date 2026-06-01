# Interface: TypedFact

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:91](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L91)

A typed fact in the Hindsight memory schema. Carries narrative text,
embedding, temporal envelope, participants, reasoning markers,
extracted entities, and a confidence score in [0, 1]. Confidence
defaults to 1.0 for World/Experience/Observation facts; the Opinion
bank stores `(text, confidence, timestamp)` tuples per §2.2.

## Properties

### bank

> **bank**: `"WORLD"` \| `"EXPERIENCE"` \| `"OPINION"` \| `"OBSERVATION"`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:95](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L95)

Bank assignment from the LLM extractor's fact-type classification.

***

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:113](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L113)

Confidence ∈ [0, 1]. 1.0 for non-Opinion facts; LLM-output for Opinion.

***

### embedding

> **embedding**: `number`[]

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:99](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L99)

Embedding vector. Empty until IEmbeddingManager.embed populates.

***

### entities

> **entities**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:111](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L111)

Named entities mentioned in the fact (proper nouns, products, places).

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:93](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L93)

Stable unique identifier. Convention: `<sessionId>-fact-<index>`.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:115](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L115)

Optional auxiliary metadata (source ID, conversation turn index, etc.).

***

### participants

> **participants**: [`Participant`](Participant.md)[]

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:103](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L103)

Named participants and their roles.

***

### reasoningMarkers

> **reasoningMarkers**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:109](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L109)

Verbatim reasoning markers preserved from the source content
("because", "since", "therefore", etc.). Used downstream to
extract causal edges.

***

### temporal

> **temporal**: [`FactTemporal`](FactTemporal.md)

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:101](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L101)

Temporal envelope (occurrence interval + mention timestamp).

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/types.ts:97](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/types.ts#L97)

Narrative text of the fact, post-coreference resolution.
