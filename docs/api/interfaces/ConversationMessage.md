# Interface: ConversationMessage

Defined in: [packages/agentos/src/query-router/types.ts:247](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/types.ts#L247)

A single message in the conversation history.
Used for providing conversational context to the classifier and generator.

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:252](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/types.ts#L252)

The text content of the message.

***

### role

> **role**: `"user"` \| `"assistant"`

Defined in: [packages/agentos/src/query-router/types.ts:249](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/types.ts#L249)

The role of the message author.
