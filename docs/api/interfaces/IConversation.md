# Interface: IConversation

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:44](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/IStorageAdapter.ts#L44)

Represents a stored conversation with metadata.

## Interface

IConversation

## Example

```typescript
const conversation: IConversation = {
  id: 'conv-123',
  userId: 'user-456',
  agentId: 'agent-coding',
  createdAt: Date.now(),
  lastActivity: Date.now(),
  title: 'Build a React component',
  metadata: { tags: ['coding', 'react'], starred: true }
};
```

## Properties

### agentId?

> `optional` **agentId**: `string`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:47](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/IStorageAdapter.ts#L47)

Optional agent ID if conversation is tied to specific agent

***

### createdAt

> **createdAt**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:48](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/IStorageAdapter.ts#L48)

Unix timestamp (milliseconds) when conversation was created

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:45](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/IStorageAdapter.ts#L45)

Unique identifier for the conversation (UUID recommended)

***

### lastActivity

> **lastActivity**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:49](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/IStorageAdapter.ts#L49)

Unix timestamp (milliseconds) of last message in conversation

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:51](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/IStorageAdapter.ts#L51)

Arbitrary metadata object for extensibility

***

### title?

> `optional` **title**: `string`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:50](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/IStorageAdapter.ts#L50)

Optional human-readable title for the conversation

***

### userId

> **userId**: `string`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:46](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/IStorageAdapter.ts#L46)

User who owns this conversation
