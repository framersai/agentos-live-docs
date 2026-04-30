# Interface: IStorageAdapter

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:230](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L230)

Core storage adapter interface for AgentOS persistence.

Implementations of this interface provide the actual storage mechanism
(SQL database, NoSQL, in-memory, etc.) while AgentOS remains storage-agnostic.

**Design Principles:**
- All methods are async for non-blocking I/O
- Returns null when entities don't exist (not throwing errors)
- Uses strong typing for compile-time safety
- Supports transaction-like batch operations
- Designed for multi-user scenarios (userId scoping)

**Lifecycle:**
1. Instantiate adapter with configuration
2. Call `initialize()` to set up database/schema
3. Use CRUD operations during runtime
4. Call `close()` when shutting down (optional cleanup)

## Interface

IStorageAdapter

## Example

```typescript
// Example implementation instantiation
const storage: IStorageAdapter = new SqlStorageAdapter({
  type: 'better-sqlite3',
  database: './agentos.db'
});

await storage.initialize();

// Create conversation
const conversation = await storage.createConversation({
  id: 'conv-123',
  userId: 'user-456',
  createdAt: Date.now(),
  lastActivity: Date.now()
});

// Store message
await storage.storeMessage({
  id: 'msg-001',
  conversationId: 'conv-123',
  role: 'user',
  content: 'Hello!',
  timestamp: Date.now()
});

// Query messages
const messages = await storage.getMessages('conv-123', { limit: 10 });
```

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:273](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L273)

Closes the storage adapter and releases resources.

This should:
- Close database connections
- Flush any pending writes
- Clean up temporary resources

**Call during application shutdown for graceful cleanup.**

#### Returns

`Promise`\<`void`\>

Resolves when cleanup is complete

#### Example

```typescript
process.on('SIGTERM', async () => {
  await storage.close();
  process.exit(0);
});
```

***

### createConversation()

> **createConversation**(`conversation`): `Promise`\<[`IConversation`](IConversation.md)\>

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:296](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L296)

Creates a new conversation record.

#### Parameters

##### conversation

[`IConversation`](IConversation.md)

The conversation object to create

#### Returns

`Promise`\<[`IConversation`](IConversation.md)\>

The created conversation (may include defaults)

#### Throws

If conversation with same ID already exists or validation fails

#### Example

```typescript
const conversation = await storage.createConversation({
  id: uuidv4(),
  userId: 'user-123',
  agentId: 'agent-coding',
  createdAt: Date.now(),
  lastActivity: Date.now(),
  title: 'New coding project'
});
```

***

### deleteConversation()

> **deleteConversation**(`conversationId`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:352](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L352)

Deletes a conversation and all its messages.

**Warning:** This is a destructive operation that cannot be undone.
Consider implementing soft deletes in production.

#### Parameters

##### conversationId

`string`

The conversation to delete

#### Returns

`Promise`\<`boolean`\>

True if deleted, false if not found

#### Example

```typescript
const deleted = await storage.deleteConversation('conv-123');
if (deleted) {
  console.log('Conversation deleted successfully');
}
```

***

### deleteMessage()

> **deleteMessage**(`messageId`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:466](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L466)

Deletes a specific message.

**Note:** This does NOT update the conversation's lastActivity timestamp.

#### Parameters

##### messageId

`string`

The message to delete

#### Returns

`Promise`\<`boolean`\>

True if deleted, false if not found

#### Example

```typescript
const deleted = await storage.deleteMessage('msg-456');
```

***

### deleteMessagesForConversation()

> **deleteMessagesForConversation**(`conversationId`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:482](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L482)

Deletes all messages in a conversation.

**Warning:** Destructive operation. Consider soft deletes in production.

#### Parameters

##### conversationId

`string`

The conversation whose messages to delete

#### Returns

`Promise`\<`number`\>

Number of messages deleted

#### Example

```typescript
const deletedCount = await storage.deleteMessagesForConversation('conv-123');
console.log(`Deleted ${deletedCount} messages`);
```

***

### getConversation()

> **getConversation**(`conversationId`): `Promise`\<[`IConversation`](IConversation.md) \| `null`\>

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:312](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L312)

Retrieves a conversation by its ID.

#### Parameters

##### conversationId

`string`

The unique conversation identifier

#### Returns

`Promise`\<[`IConversation`](IConversation.md) \| `null`\>

The conversation or null if not found

#### Example

```typescript
const conv = await storage.getConversation('conv-123');
if (conv) {
  console.log('Found:', conv.title);
}
```

***

### getConversationTokenUsage()

> **getConversationTokenUsage**(`conversationId`): `Promise`\<[`ITokenUsage`](ITokenUsage.md)\>

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:517](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L517)

Calculates total token usage for a conversation.

Sums up all message usage statistics.

#### Parameters

##### conversationId

`string`

The conversation to analyze

#### Returns

`Promise`\<[`ITokenUsage`](ITokenUsage.md)\>

Aggregated token usage

#### Example

```typescript
const usage = await storage.getConversationTokenUsage('conv-123');
console.log(`Total tokens: ${usage.totalTokens}`);
console.log(`Cost estimate: $${usage.totalTokens * 0.00001}`);
```

***

### getMessage()

> **getMessage**(`messageId`): `Promise`\<[`IConversationMessage`](IConversationMessage.md) \| `null`\>

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:422](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L422)

Retrieves a single message by its ID.

#### Parameters

##### messageId

`string`

The unique message identifier

#### Returns

`Promise`\<[`IConversationMessage`](IConversationMessage.md) \| `null`\>

The message or null if not found

#### Example

```typescript
const msg = await storage.getMessage('msg-456');
if (msg) {
  console.log(`[${msg.role}]: ${msg.content}`);
}
```

***

### getMessageCount()

> **getMessageCount**(`conversationId`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:500](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L500)

Counts total messages in a conversation.

Useful for pagination and UI indicators.

#### Parameters

##### conversationId

`string`

The conversation to count

#### Returns

`Promise`\<`number`\>

Total message count

#### Example

```typescript
const count = await storage.getMessageCount('conv-123');
console.log(`This conversation has ${count} messages`);
```

***

### getMessages()

> **getMessages**(`conversationId`, `options?`): `Promise`\<[`IConversationMessage`](IConversationMessage.md)[]\>

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:451](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L451)

Retrieves all messages for a conversation with optional filtering.

This is the primary method for loading conversation history.

#### Parameters

##### conversationId

`string`

The conversation to query

##### options?

[`IMessageQueryOptions`](IMessageQueryOptions.md)

Query options for filtering/pagination

#### Returns

`Promise`\<[`IConversationMessage`](IConversationMessage.md)[]\>

Array of messages matching criteria

#### Example

```typescript
// Get all messages (oldest first)
const allMessages = await storage.getMessages('conv-123');

// Get last 50 messages (newest first)
const recent = await storage.getMessages('conv-123', {
  limit: 50,
  order: 'desc'
});

// Get only assistant responses from last hour
const assistantRecent = await storage.getMessages('conv-123', {
  roles: ['assistant'],
  since: Date.now() - 3600000
});
```

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:251](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L251)

Initializes the storage adapter.

This should:
- Establish database connections
- Create necessary tables/schemas if they don't exist
- Run migrations if needed
- Validate configuration

**Must be called before any other methods.**

#### Returns

`Promise`\<`void`\>

Resolves when initialization is complete

#### Throws

If initialization fails (connection errors, invalid config, etc.)

#### Example

```typescript
const storage = new SqlStorageAdapter(config);
await storage.initialize(); // Sets up database schema
```

***

### listConversations()

> **listConversations**(`userId`, `options?`): `Promise`\<[`IConversation`](IConversation.md)[]\>

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:379](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L379)

Lists all conversations for a specific user.

Results are typically ordered by lastActivity (most recent first).

#### Parameters

##### userId

`string`

The user whose conversations to retrieve

##### options?

Optional filtering/pagination

###### agentId?

`string`

Filter by specific agent

###### limit?

`number`

Maximum conversations to return

###### offset?

`number`

Number of conversations to skip

#### Returns

`Promise`\<[`IConversation`](IConversation.md)[]\>

Array of conversations

#### Example

```typescript
// Get user's 20 most recent conversations
const conversations = await storage.listConversations('user-123', {
  limit: 20
});

// Get conversations for specific agent
const codingConvs = await storage.listConversations('user-123', {
  agentId: 'agent-coding'
});
```

***

### storeMessage()

> **storeMessage**(`message`): `Promise`\<[`IConversationMessage`](IConversationMessage.md)\>

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:406](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L406)

Stores a new message in a conversation.

**Note:** This also updates the parent conversation's `lastActivity` timestamp.

#### Parameters

##### message

[`IConversationMessage`](IConversationMessage.md)

The message to store

#### Returns

`Promise`\<[`IConversationMessage`](IConversationMessage.md)\>

The stored message

#### Throws

If conversation doesn't exist or validation fails

#### Example

```typescript
await storage.storeMessage({
  id: uuidv4(),
  conversationId: 'conv-123',
  role: 'user',
  content: 'Explain async/await',
  timestamp: Date.now()
});
```

***

### updateConversation()

> **updateConversation**(`conversationId`, `updates`): `Promise`\<[`IConversation`](IConversation.md)\>

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:333](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L333)

Updates an existing conversation's metadata.

Only provided fields will be updated. Omitted fields remain unchanged.

#### Parameters

##### conversationId

`string`

The conversation to update

##### updates

`Partial`\<[`IConversation`](IConversation.md)\>

Fields to update

#### Returns

`Promise`\<[`IConversation`](IConversation.md)\>

The updated conversation

#### Throws

If conversation doesn't exist

#### Example

```typescript
// Update title and last activity
const updated = await storage.updateConversation('conv-123', {
  title: 'Renamed conversation',
  lastActivity: Date.now()
});
```
