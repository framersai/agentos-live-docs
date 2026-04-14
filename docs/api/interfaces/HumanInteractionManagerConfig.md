# Interface: HumanInteractionManagerConfig

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:37](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/HumanInteractionManager.ts#L37)

Configuration for HumanInteractionManager.

## Properties

### autoRejectOnTimeout?

> `optional` **autoRejectOnTimeout**: `boolean`

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:47](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/HumanInteractionManager.ts#L47)

Auto-reject on timeout (vs returning timeout response)

***

### defaultTimeoutMs?

> `optional` **defaultTimeoutMs**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:41](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/HumanInteractionManager.ts#L41)

Default timeout for requests in ms

***

### logger?

> `optional` **logger**: [`ILogger`](ILogger.md)

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:39](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/HumanInteractionManager.ts#L39)

Logger instance

***

### maxPendingPerType?

> `optional` **maxPendingPerType**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:45](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/HumanInteractionManager.ts#L45)

Maximum pending requests per type

***

### notificationHandler?

> `optional` **notificationHandler**: [`HITLNotificationHandler`](../type-aliases/HITLNotificationHandler.md)

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:43](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/hitl/HumanInteractionManager.ts#L43)

Notification handler
