# Interface: ConversationManagerConfig

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:33](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/conversation/ConversationManager.ts#L33)

Configuration for the ConversationManager.
Defines settings for managing conversation contexts, including persistence options.

## Interface

ConversationManagerConfig

## Properties

### appendOnlyPersistence?

> `optional` **appendOnlyPersistence**: `boolean`

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:45](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/conversation/ConversationManager.ts#L45)

When enabled, persistence becomes append-only:
- `conversations` and `conversation_messages` rows are never updated or deleted
- new messages are inserted once and subsequent saves are idempotent

This is intended to support provenance "sealed" mode / immutability guarantees.

***

### defaultConversationContextConfig?

> `optional` **defaultConversationContextConfig**: `Partial`\<`ConversationContextConfig`\>

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:34](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/conversation/ConversationManager.ts#L34)

Default configuration for newly created ConversationContext instances.

***

### inactivityTimeoutMs?

> `optional` **inactivityTimeoutMs**: `number`

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:36](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/conversation/ConversationManager.ts#L36)

Timeout in milliseconds for inactive conversations. If set, a cleanup process
might be implemented to evict conversations inactive for this duration. (Currently conceptual)

***

### maxActiveConversationsInMemory?

> `optional` **maxActiveConversationsInMemory**: `number`

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:35](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/conversation/ConversationManager.ts#L35)

Maximum number of active conversations to keep in memory. LRU eviction may apply.

***

### persistenceEnabled?

> `optional` **persistenceEnabled**: `boolean`

Defined in: [packages/agentos/src/core/conversation/ConversationManager.ts:37](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/conversation/ConversationManager.ts#L37)

Controls whether storage adapter is used for database persistence of conversations.
If true, a StorageAdapter instance must be provided during initialization.
