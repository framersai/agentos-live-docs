# Interface: IMessageQueryOptions

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:169](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L169)

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

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:170](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L170)

Maximum number of messages to return

***

### offset?

> `optional` **offset**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:171](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L171)

Number of messages to skip (for pagination)

***

### order?

> `optional` **order**: `"asc"` \| `"desc"`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:175](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L175)

Sort order by timestamp (default: 'asc')

***

### roles?

> `optional` **roles**: (`"user"` \| `"tool"` \| `"system"` \| `"assistant"`)[]

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:174](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L174)

Filter by message roles

***

### since?

> `optional` **since**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:172](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L172)

Only return messages created after this timestamp

***

### until?

> `optional` **until**: `number`

Defined in: [packages/agentos/src/core/storage/IStorageAdapter.ts:173](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/storage/IStorageAdapter.ts#L173)

Only return messages created before this timestamp
