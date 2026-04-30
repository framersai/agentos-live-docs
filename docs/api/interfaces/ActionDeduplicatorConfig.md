# Interface: ActionDeduplicatorConfig

Defined in: [packages/agentos/src/safety/runtime/ActionDeduplicator.ts:8](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/runtime/ActionDeduplicator.ts#L8)

## File

ActionDeduplicator.ts

## Description

Hash-based tracking of recent actions within a configurable time window.
Prevents identical actions from being executed twice in rapid succession.
Caller computes the key string — this class is intentionally generic.

## Properties

### maxEntries

> **maxEntries**: `number`

Defined in: [packages/agentos/src/safety/runtime/ActionDeduplicator.ts:12](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/runtime/ActionDeduplicator.ts#L12)

Maximum tracked entries before LRU eviction.

#### Default

```ts
10000
```

***

### windowMs

> **windowMs**: `number`

Defined in: [packages/agentos/src/safety/runtime/ActionDeduplicator.ts:10](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/runtime/ActionDeduplicator.ts#L10)

Time window in ms to track actions.

#### Default

```ts
3600000 (1 hour)
```
