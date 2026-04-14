# Class: ConversationManager

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:94](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ConversationManager.ts#L94)

## Description

Manages ConversationContext instances for AgentOS, handling their
creation, retrieval, in-memory caching, and persistent storage via sql-storage-adapter.
This class is vital for maintaining conversational state across user sessions and
GMI interactions.

## Constructors

### Constructor

> **new ConversationManager**(): `ConversationManager`

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:144](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ConversationManager.ts#L144)

Constructs a ConversationManager instance.
Initialization via `initialize()` is required before use.

#### Returns

`ConversationManager`

## Properties

### managerId

> `readonly` **managerId**: `string`

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:138](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ConversationManager.ts#L138)

Unique identifier for this ConversationManager instance.

## Methods

### deleteConversation()

> **deleteConversation**(`conversationId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:336](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ConversationManager.ts#L336)

**`Async`**

Deletes a conversation from both memory and persistent storage.

#### Parameters

##### conversationId

`string`

The ID of the conversation to delete.

#### Returns

`Promise`\<`void`\>

#### Throws

If the deletion fails.

***

### getConversation()

> **getConversation**(`conversationId`): `Promise`\<`ConversationContext` \| `null`\>

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:294](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ConversationManager.ts#L294)

Retrieves a ConversationContext if present in memory or persistent storage.
Returns null when not found.

#### Parameters

##### conversationId

`string`

#### Returns

`Promise`\<`ConversationContext` \| `null`\>

***

### getConversationInfo()

> **getConversationInfo**(`sessionId`): `Promise`\<`object`[]\>

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:368](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ConversationManager.ts#L368)

**`Async`**

Gets basic info about a conversation (ID and creation timestamp).
Checks in-memory cache first, then persistent storage if enabled.

#### Parameters

##### sessionId

`string`

The ID of the conversation.

#### Returns

`Promise`\<`object`[]\>

Array with conversation info, or empty if not found.

***

### getLastActiveTimeForConversation()

> **getLastActiveTimeForConversation**(`conversationId`): `Promise`\<`number` \| `undefined`\>

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:400](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ConversationManager.ts#L400)

**`Async`**

Gets the last active time for a conversation, typically the timestamp of the last message or update.
Checks in-memory cache first, then persistent storage if enabled.

#### Parameters

##### conversationId

`string`

The ID of the conversation.

#### Returns

`Promise`\<`number` \| `undefined`\>

Timestamp of last activity (Unix epoch ms), or undefined if not found.

***

### getOrCreateConversationContext()

> **getOrCreateConversationContext**(`conversationId?`, `userId?`, `gmiInstanceId?`, `activePersonaId?`, `initialMetadata?`, `overrideConfig?`): `Promise`\<`ConversationContext`\>

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:237](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ConversationManager.ts#L237)

**`Async`**

Creates a new conversation context or retrieves an existing one.
If `conversationId` is provided:
- Tries to find it in the active (in-memory) cache.
- If not in cache and persistence is enabled, tries to load from the database.
- If not found in DB or persistence disabled, creates a new context with this ID.
If no `conversationId` is provided, a new one is generated.
Manages in-memory cache size by evicting the oldest conversation if capacity is reached.

#### Parameters

##### conversationId?

`string`

Optional ID of an existing conversation. This ID will also be used as the `ConversationContext.sessionId`.

##### userId?

`string`

ID of the user associated with the conversation.

##### gmiInstanceId?

`string`

ID of the GMI instance this conversation is for.

##### activePersonaId?

`string`

ID of the active persona for the conversation.

##### initialMetadata?

`Record`\<`string`, `any`\> = `{}`

Initial metadata for a new conversation.

##### overrideConfig?

`Partial`\<`ConversationContextConfig`\>

Config overrides for a new context.

#### Returns

`Promise`\<`ConversationContext`\>

The created or retrieved ConversationContext.

#### Throws

If essential parameters for creating a new context are missing or if an error occurs.

***

### initialize()

> **initialize**(`config`, `utilityAIService?`, `storageAdapter?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:163](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ConversationManager.ts#L163)

**`Async`**

Initializes the ConversationManager with its configuration and dependencies.
This method sets up persistence if enabled and prepares the manager for operation.

#### Parameters

##### config

[`ConversationManagerConfig`](../interfaces/ConversationManagerConfig.md)

Configuration for the manager.

##### utilityAIService?

[`IUtilityAI`](../interfaces/IUtilityAI.md)

Optional IUtilityAI instance, primarily
used by ConversationContext instances for features like summarization.

##### storageAdapter?

`StorageAdapter`

Optional storage adapter for database persistence.
Required if `config.persistenceEnabled` is true.

#### Returns

`Promise`\<`void`\>

A promise that resolves when initialization is complete.

#### Throws

If configuration is invalid or dependencies are missing when required.

***

### listContextsForSession()

> **listContextsForSession**(`sessionId`): `Promise`\<`object`[]\>

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:308](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ConversationManager.ts#L308)

Lists minimal context info for a given session. Currently returns a single entry
matching the provided sessionId if found in memory or storage.

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`object`[]\>

***

### saveConversation()

> **saveConversation**(`context`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:321](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ConversationManager.ts#L321)

**`Async`**

Saves a ConversationContext to persistent storage if persistence is enabled.
This is called automatically when a context is evicted from memory or during shutdown.

#### Parameters

##### context

`ConversationContext`

The ConversationContext to save.

#### Returns

`Promise`\<`void`\>

#### Throws

If the save operation fails.

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:801](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ConversationManager.ts#L801)

**`Async`**

Shuts down the ConversationManager.
If persistence is enabled, ensures all active conversations are saved to the database.
Clears the in-memory cache of conversations.

#### Returns

`Promise`\<`void`\>
