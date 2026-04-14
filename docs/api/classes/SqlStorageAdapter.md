# Class: SqlStorageAdapter

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:108](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L108)

SQL storage adapter implementation for AgentOS.

Provides full persistence for conversations and messages using a SQL database.
Wraps @framers/sql-storage-adapter to provide AgentOS-specific schema and operations.

**Features:**
- Cross-platform SQL support (SQLite, PostgreSQL, SQL.js, Capacitor)
- Automatic schema creation and migration
- Efficient querying with indexes
- Transaction support for atomic operations
- Type-safe API with full TypeScript support

**Database Schema:**
- `conversations` table: Stores conversation metadata
- `messages` table: Stores individual messages with foreign key to conversations
- Indexes on frequently queried columns for performance

## Implements

## Example

```typescript
// Node.js with SQLite
const storage = new SqlStorageAdapter({
  type: 'better-sqlite3',
  database: './data/agentos.db',
  enableWAL: true
});

await storage.initialize();

// Browser with SQL.js
const browserStorage = new SqlStorageAdapter({
  type: 'sql.js',
  database: 'agentos.db',
  enableAutoMigration: true
});

await browserStorage.initialize();
```

## Implements

- [`IStorageAdapter`](../interfaces/IStorageAdapter.md)

## Constructors

### Constructor

> **new SqlStorageAdapter**(`config?`): `SqlStorageAdapter`

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:126](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L126)

Creates a new SQL storage adapter instance.

#### Parameters

##### config?

[`AgentOsSqlStorageConfig`](../interfaces/AgentOsSqlStorageConfig.md) = `{}`

Storage configuration

#### Returns

`SqlStorageAdapter`

#### Example

```typescript
const storage = new SqlStorageAdapter({
  filePath: './agentos.db',
  priority: ['better-sqlite3']
});
```

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:213](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L213)

Closes the database connection and releases resources.

#### Returns

`Promise`\<`void`\>

#### Example

```typescript
await storage.close();
```

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`close`](../interfaces/IStorageAdapter.md#close)

***

### createConversation()

> **createConversation**(`conversation`): `Promise`\<[`IConversation`](../interfaces/IConversation.md)\>

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:227](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L227)

Creates a new conversation record.

#### Parameters

##### conversation

[`IConversation`](../interfaces/IConversation.md)

Conversation to create

#### Returns

`Promise`\<[`IConversation`](../interfaces/IConversation.md)\>

The created conversation

#### Throws

If conversation with same ID exists or validation fails

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`createConversation`](../interfaces/IStorageAdapter.md#createconversation)

***

### deleteConversation()

> **deleteConversation**(`conversationId`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:316](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L316)

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

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:489](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L489)

Deletes a specific message.

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

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:502](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L502)

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

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:255](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L255)

Retrieves a conversation by ID.

#### Parameters

##### conversationId

`string`

The conversation ID

#### Returns

`Promise`\<[`IConversation`](../interfaces/IConversation.md) \| `null`\>

The conversation or null if not found

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`getConversation`](../interfaces/IStorageAdapter.md#getconversation)

***

### getConversationTokenUsage()

> **getConversationTokenUsage**(`conversationId`): `Promise`\<[`ITokenUsage`](../interfaces/ITokenUsage.md)\>

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:537](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L537)

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

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:422](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L422)

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

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:520](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L520)

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

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:441](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L441)

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

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:153](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L153)

Initializes the storage adapter and creates the database schema.

**Schema created:**
- `conversations` table with indexes on userId and agentId
- `messages` table with indexes on conversationId and timestamp
- Foreign key constraints for referential integrity

**Must be called before any other operations.**

#### Returns

`Promise`\<`void`\>

#### Throws

If database connection or schema creation fails

#### Example

```typescript
await storage.initialize();
console.log('Storage ready!');
```

#### Implementation of

[`IStorageAdapter`](../interfaces/IStorageAdapter.md).[`initialize`](../interfaces/IStorageAdapter.md#initialize)

***

### listConversations()

> **listConversations**(`userId`, `options?`): `Promise`\<[`IConversation`](../interfaces/IConversation.md)[]\>

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:334](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L334)

Lists conversations for a user with optional filtering.

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

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:373](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L373)

Stores a message and updates conversation's lastActivity.

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

Defined in: [packages/agentos/src/core/storage/SqlStorageAdapter.ts:278](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/storage/SqlStorageAdapter.ts#L278)

Updates a conversation's fields.

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
