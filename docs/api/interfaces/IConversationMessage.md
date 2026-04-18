# Interface: IConversationMessage

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:93](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/storage/IStorageAdapter.ts#L93)

Represents a single message within a conversation.

Follows OpenAI's chat completion message format for compatibility with LLM providers.

## Interface

IConversationMessage

## Example

```typescript
const userMessage: IConversationMessage = {
  id: 'msg-001',
  conversationId: 'conv-123',
  role: 'user',
  content: 'What is TypeScript?',
  timestamp: Date.now()
};

const assistantMessage: IConversationMessage = {
  id: 'msg-002',
  conversationId: 'conv-123',
  role: 'assistant',
  content: 'TypeScript is a typed superset of JavaScript...',
  timestamp: Date.now(),
  model: 'gpt-4o',
  usage: { promptTokens: 10, completionTokens: 50, totalTokens: 60 }
};
```

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:97](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/storage/IStorageAdapter.ts#L97)

The text content of the message

***

### conversationId

> **conversationId**: `string`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:95](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/storage/IStorageAdapter.ts#L95)

ID of the conversation this message belongs to

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:94](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/storage/IStorageAdapter.ts#L94)

Unique identifier for the message

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:104](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/storage/IStorageAdapter.ts#L104)

Additional metadata for extensibility

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:99](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/storage/IStorageAdapter.ts#L99)

LLM model used to generate this message (for assistant messages)

***

### name?

> `optional` **name**: `string`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:103](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/storage/IStorageAdapter.ts#L103)

Name field for tool/function messages

***

### role

> **role**: `"user"` \| `"tool"` \| `"system"` \| `"assistant"`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:96](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/storage/IStorageAdapter.ts#L96)

Message role in conversation

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:98](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/storage/IStorageAdapter.ts#L98)

Unix timestamp (milliseconds) when message was created

***

### toolCallId?

> `optional` **toolCallId**: `string`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:102](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/storage/IStorageAdapter.ts#L102)

ID linking this message to a tool call response

***

### toolCalls?

> `optional` **toolCalls**: `any`[]

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:101](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/storage/IStorageAdapter.ts#L101)

Tool/function calls made in this message

***

### usage?

> `optional` **usage**: [`ITokenUsage`](ITokenUsage.md)

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:100](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/storage/IStorageAdapter.ts#L100)

Token usage statistics for this message
