# Interface: StreamingManagerConfig

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:28](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/streaming/StreamingManager.ts#L28)

Configuration options for the StreamingManager.

## Interface

StreamingManagerConfig

## Properties

### defaultStreamInactivityTimeoutMs?

> `optional` **defaultStreamInactivityTimeoutMs**: `number`

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:43](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/streaming/StreamingManager.ts#L43)

Default timeout in milliseconds for a stream if no activity is detected.
If set to 0, streams do not time out automatically. (Conceptual, requires active tracking)

#### Default

```ts
300000 (5 minutes)
```

***

### maxClientsPerStream?

> `optional` **maxClientsPerStream**: `number`

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:51](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/streaming/StreamingManager.ts#L51)

Maximum number of clients allowed to subscribe to a single stream.
If set to 0 or a negative number, it implies no limit.

#### Default

```ts
10
```

***

### maxConcurrentStreams?

> `optional` **maxConcurrentStreams**: `number`

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:35](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/streaming/StreamingManager.ts#L35)

Maximum number of concurrent active streams allowed.
If set to 0 or a negative number, it implies no limit (not recommended for production).

#### Default

```ts
1000
```

***

### onClientSendErrorBehavior?

> `optional` **onClientSendErrorBehavior**: `"log_and_continue"` \| `"deregister_client"` \| `"throw"`

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:61](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/streaming/StreamingManager.ts#L61)

Optional: Defines the behavior when trying to push a chunk to a client whose `sendChunk` method fails.
- 'log_and_continue': Logs the error and continues sending to other clients. (Default)
- 'deregister_client': Logs the error, attempts to deregister the failing client, and continues.
- 'throw': Throws an error, potentially stopping the push operation for the current chunk to other clients.

#### Default

```ts
'log_and_continue'
```
