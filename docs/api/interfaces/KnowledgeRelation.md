# Interface: KnowledgeRelation

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:86](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L86)

Represents a relationship (edge) between entities

## Properties

### bidirectional

> **bidirectional**: `boolean`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:102](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L102)

Is this relation bidirectional?

***

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:104](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L104)

Confidence score

***

### createdAt

> **createdAt**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:108](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L108)

Creation timestamp

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:88](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L88)

Unique relation ID

***

### label

> **label**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:96](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L96)

Relation label (e.g., "works_at", "knows", "caused_by")

***

### properties?

> `optional` **properties**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:98](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L98)

Relation properties

***

### source

> **source**: [`KnowledgeSource`](KnowledgeSource.md)

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:106](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L106)

Source of this relation

***

### sourceId

> **sourceId**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:90](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L90)

Source entity ID

***

### targetId

> **targetId**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:92](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L92)

Target entity ID

***

### type

> **type**: [`RelationType`](../type-aliases/RelationType.md)

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:94](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L94)

Relation type

***

### validFrom?

> `optional` **validFrom**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:110](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L110)

Temporal validity (when was this relation true?)

***

### validTo?

> `optional` **validTo**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:111](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L111)

***

### weight

> **weight**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:100](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L100)

Relation strength/weight (0-1)
