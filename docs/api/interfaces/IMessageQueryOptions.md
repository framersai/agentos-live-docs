# Interface: IMessageQueryOptions

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:156](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/storage/IStorageAdapter.ts#L156)

Options for querying conversation messages with filtering and pagination.

## Interface

IMessageQueryOptions

## Example

```typescript
// Get last 50 assistant messages
const options: IMessageQueryOptions = {
  limit: 50,
  roles: ['assistant'],
  order: 'desc'
};

// Get messages from last hour
const recentOptions: IMessageQueryOptions = {
  since: Date.now() - (60 * 60 * 1000)
};
```

## Properties

### limit?

> `optional` **limit**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:157](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/storage/IStorageAdapter.ts#L157)

Maximum number of messages to return

***

### offset?

> `optional` **offset**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:158](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/storage/IStorageAdapter.ts#L158)

Number of messages to skip (for pagination)

***

### order?

> `optional` **order**: `"asc"` \| `"desc"`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:162](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/storage/IStorageAdapter.ts#L162)

Sort order by timestamp (default: 'asc')

***

### roles?

> `optional` **roles**: (`"user"` \| `"tool"` \| `"system"` \| `"assistant"`)[]

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:161](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/storage/IStorageAdapter.ts#L161)

Filter by message roles

***

### since?

> `optional` **since**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:159](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/storage/IStorageAdapter.ts#L159)

Only return messages created after this timestamp

***

### until?

> `optional` **until**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:160](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/storage/IStorageAdapter.ts#L160)

Only return messages created before this timestamp
