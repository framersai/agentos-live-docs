# Class: InMemoryStorageAdapter

Defined in: [packages/agentos/src/core/storage/InMemoryStorageAdapter.ts:66](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/InMemoryStorageAdapter.ts#L66)

In-memory storage adapter for AgentOS.

Provides a complete implementation of IStorageAdapter without any persistence.
All data is stored in JavaScript Map and Array structures.

**Use Cases:**
- Unit and integration testing
- Development environments
- Stateless sessions
- CI/CD pipelines
- Prototyping and demos

**Characteristics:**
- Zero setup (no database required)
- Extremely fast (no I/O)
- Non-persistent (data lost on process exit)
- Thread-safe in single-threaded environments

## Implements

## Example

```typescript
// Perfect for testing
const storage = new InMemoryStorageAdapter();
await storage.initialize();

const conversation = await storage.createConversation({
  id: 'test-conv',
  userId: 'test-user',
  createdAt: Date.now(),
  lastActivity: Date.now()
});

// No cleanup needed for tests
await storage.close();
```

## Implements

- [`IStorageAdapter`](../interfaces/IStorageAdapter.md)

## Constructors

### Constructor

> **new InMemoryStorageAdapter**(): `InMemoryStorageAdapter`

Defined in: [packages/agentos/src/core/storage/InMemoryStorageAdapter.ts:82](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/InMemoryStorageAdapter.ts#L82)

Creates a new in-memory storage adapter.

No configuration needed since everything is in memory.

#### Returns

`InMemoryStorageAdapter`

#### Example

```typescript
const storage = new InMemoryStorageAdapter();
```

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/storage/InMemoryStorageAdapter.ts:104](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/InMemoryStorageAdapter.ts#L104)

Closes the storage adapter and clears all data.

**Warning:** This deletes all conversations and messages from memory.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`close`](../interfaces/IStorageAdapter.md#close)

***

### createConversation()

> **createConversation**(`conversation`): `Promise`\<[`IConversation`](../interfaces/IConversation.md)\>

Defined in: [packages/agentos/src/core/storage/InMemoryStorageAdapter.ts:120](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/InMemoryStorageAdapter.ts#L120)

Creates a new conversation.

#### Parameters

##### conversation

[`IConversation`](../interfaces/IConversation.md)

Conversation to create

#### Returns

`Promise`\<[`IConversation`](../interfaces/IConversation.md)\>

The created conversation

#### Throws

If conversation with same ID already exists

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`createConversation`](../interfaces/IStorageAdapter.md#createconversation)

***

### deleteConversation()

> **deleteConversation**(`conversationId`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/core/storage/InMemoryStorageAdapter.ts:179](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/InMemoryStorageAdapter.ts#L179)

Deletes a conversation and all its messages.

#### Parameters

##### conversationId

`string`

Conversation to delete

#### Returns

`Promise`\<`boolean`\>

True if deleted, false if not found

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`deleteConversation`](../interfaces/IStorageAdapter.md#deleteconversation)

***

### deleteMessage()

> **deleteMessage**(`messageId`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/core/storage/InMemoryStorageAdapter.ts:322](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/InMemoryStorageAdapter.ts#L322)

Deletes a message.

#### Parameters

##### messageId

`string`

Message to delete

#### Returns

`Promise`\<`boolean`\>

True if deleted

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`deleteMessage`](../interfaces/IStorageAdapter.md#deletemessage)

***

### deleteMessagesForConversation()

> **deleteMessagesForConversation**(`conversationId`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/core/storage/InMemoryStorageAdapter.ts:350](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/InMemoryStorageAdapter.ts#L350)

Deletes all messages in a conversation.

#### Parameters

##### conversationId

`string`

Conversation whose messages to delete

#### Returns

`Promise`\<`number`\>

Number of messages deleted

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`deleteMessagesForConversation`](../interfaces/IStorageAdapter.md#deletemessagesforconversation)

***

### getConversation()

> **getConversation**(`conversationId`): `Promise`\<[`IConversation`](../interfaces/IConversation.md) \| `null`\>

Defined in: [packages/agentos/src/core/storage/InMemoryStorageAdapter.ts:141](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/InMemoryStorageAdapter.ts#L141)

Retrieves a conversation by ID.

#### Parameters

##### conversationId

`string`

Conversation ID

#### Returns

`Promise`\<[`IConversation`](../interfaces/IConversation.md) \| `null`\>

The conversation or null

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`getConversation`](../interfaces/IStorageAdapter.md#getconversation)

***

### getConversationTokenUsage()

> **getConversationTokenUsage**(`conversationId`): `Promise`\<[`ITokenUsage`](../interfaces/ITokenUsage.md)\>

Defined in: [packages/agentos/src/core/storage/InMemoryStorageAdapter.ts:386](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/InMemoryStorageAdapter.ts#L386)

Calculates total token usage for a conversation.

#### Parameters

##### conversationId

`string`

Conversation to analyze

#### Returns

`Promise`\<[`ITokenUsage`](../interfaces/ITokenUsage.md)\>

Aggregated token usage

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`getConversationTokenUsage`](../interfaces/IStorageAdapter.md#getconversationtokenusage)

***

### getMessage()

> **getMessage**(`messageId`): `Promise`\<[`IConversationMessage`](../interfaces/IConversationMessage.md) \| `null`\>

Defined in: [packages/agentos/src/core/storage/InMemoryStorageAdapter.ts:267](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/InMemoryStorageAdapter.ts#L267)

Retrieves a message by ID.

#### Parameters

##### messageId

`string`

Message ID

#### Returns

`Promise`\<[`IConversationMessage`](../interfaces/IConversationMessage.md) \| `null`\>

The message or null

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`getMessage`](../interfaces/IStorageAdapter.md#getmessage)

***

### getMessageCount()

> **getMessageCount**(`conversationId`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/core/storage/InMemoryStorageAdapter.ts:373](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/InMemoryStorageAdapter.ts#L373)

Counts messages in a conversation.

#### Parameters

##### conversationId

`string`

Conversation to count

#### Returns

`Promise`\<`number`\>

Message count

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`getMessageCount`](../interfaces/IStorageAdapter.md#getmessagecount)

***

### getMessages()

> **getMessages**(`conversationId`, `options?`): `Promise`\<[`IConversationMessage`](../interfaces/IConversationMessage.md)[]\>

Defined in: [packages/agentos/src/core/storage/InMemoryStorageAdapter.ts:281](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/InMemoryStorageAdapter.ts#L281)

Retrieves messages for a conversation with filtering.

#### Parameters

##### conversationId

`string`

Conversation ID

##### options?

[`IMessageQueryOptions`](../interfaces/IMessageQueryOptions.md)

Query options

#### Returns

`Promise`\<[`IConversationMessage`](../interfaces/IConversationMessage.md)[]\>

Array of messages

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`getMessages`](../interfaces/IStorageAdapter.md#getmessages)

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/storage/InMemoryStorageAdapter.ts:93](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/InMemoryStorageAdapter.ts#L93)

Initializes the storage adapter.

For in-memory adapter, this just sets the initialized flag.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`initialize`](../interfaces/IStorageAdapter.md#initialize)

***

### listConversations()

> **listConversations**(`userId`, `options?`): `Promise`\<[`IConversation`](../interfaces/IConversation.md)[]\>

Defined in: [packages/agentos/src/core/storage/InMemoryStorageAdapter.ts:206](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/InMemoryStorageAdapter.ts#L206)

Lists conversations for a user.

#### Parameters

##### userId

`string`

User whose conversations to list

##### options?

Query options

###### agentId?

`string`

###### limit?

`number`

###### offset?

`number`

#### Returns

`Promise`\<[`IConversation`](../interfaces/IConversation.md)[]\>

Array of conversations

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`listConversations`](../interfaces/IStorageAdapter.md#listconversations)

***

### storeMessage()

> **storeMessage**(`message`): `Promise`\<[`IConversationMessage`](../interfaces/IConversationMessage.md)\>

Defined in: [packages/agentos/src/core/storage/InMemoryStorageAdapter.ts:238](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/InMemoryStorageAdapter.ts#L238)

Stores a message.

#### Parameters

##### message

[`IConversationMessage`](../interfaces/IConversationMessage.md)

Message to store

#### Returns

`Promise`\<[`IConversationMessage`](../interfaces/IConversationMessage.md)\>

The stored message

#### Throws

If conversation doesn't exist

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`storeMessage`](../interfaces/IStorageAdapter.md#storemessage)

***

### updateConversation()

> **updateConversation**(`conversationId`, `updates`): `Promise`\<[`IConversation`](../interfaces/IConversation.md)\>

Defined in: [packages/agentos/src/core/storage/InMemoryStorageAdapter.ts:156](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/storage/InMemoryStorageAdapter.ts#L156)

Updates a conversation.

#### Parameters

##### conversationId

`string`

Conversation to update

##### updates

`Partial`\<[`IConversation`](../interfaces/IConversation.md)\>

Fields to update

#### Returns

`Promise`\<[`IConversation`](../interfaces/IConversation.md)\>

Updated conversation

#### Throws

If conversation doesn't exist

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`updateConversation`](../interfaces/IStorageAdapter.md#updateconversation)
