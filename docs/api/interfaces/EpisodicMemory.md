# Interface: EpisodicMemory

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:141](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L141)

Represents an episodic memory (specific experience/event)

## Properties

### accessCount

> **accessCount**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:173](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L173)

Access count (for decay/reinforcement)

***

### context?

> `optional` **context**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:169](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L169)

Raw context data

***

### createdAt

> **createdAt**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:171](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L171)

Creation timestamp

***

### description?

> `optional` **description**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:149](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L149)

Detailed description

***

### durationMs?

> `optional` **durationMs**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:163](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L163)

Duration in milliseconds

***

### embedding?

> `optional` **embedding**: `number`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:159](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L159)

Vector embedding

***

### entityIds

> **entityIds**: `string`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:157](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L157)

Associated entity IDs

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:143](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L143)

Unique memory ID

***

### importance

> **importance**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:155](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L155)

Importance score (0-1)

***

### insights?

> `optional` **insights**: `string`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:167](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L167)

Lessons learned

***

### lastAccessedAt

> **lastAccessedAt**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:175](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L175)

Last accessed timestamp

***

### occurredAt

> **occurredAt**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:161](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L161)

When did this happen?

***

### outcome?

> `optional` **outcome**: `"success"` \| `"failure"` \| `"partial"` \| `"unknown"`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:165](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L165)

Outcome/result

***

### participants

> **participants**: `string`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:151](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L151)

Participants (user IDs, GMI IDs)

***

### summary

> **summary**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:147](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L147)

Summary of the episode

***

### type

> **type**: `"discovery"` \| `"success"` \| `"error"` \| `"conversation"` \| `"task"` \| `"interaction"`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:145](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L145)

Memory type

***

### valence?

> `optional` **valence**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:153](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L153)

Emotional valence (-1 to 1, negative to positive)
