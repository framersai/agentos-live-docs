# Interface: StandaloneMemoryLongTermRetrieverOptions

Defined in: [packages/agentos/src/memory/io/integration/StandaloneMemoryBridge.ts:65](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/integration/StandaloneMemoryBridge.ts#L65)

## Properties

### conversationLimit?

> `optional` **conversationLimit**: `number`

Defined in: [packages/agentos/src/memory/io/integration/StandaloneMemoryBridge.ts:76](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/integration/StandaloneMemoryBridge.ts#L76)

Conversation-scope cap. `topKByScope` only covers user/persona/org.

#### Default

```ts
4
```

***

### defaultLimitPerScope?

> `optional` **defaultLimitPerScope**: `number`

Defined in: [packages/agentos/src/memory/io/integration/StandaloneMemoryBridge.ts:70](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/integration/StandaloneMemoryBridge.ts#L70)

Fallback result limit for scopes that do not have an explicit cap.

#### Default

```ts
4
```

***

### includeScopeHeadings?

> `optional` **includeScopeHeadings**: `boolean`

Defined in: [packages/agentos/src/memory/io/integration/StandaloneMemoryBridge.ts:82](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/integration/StandaloneMemoryBridge.ts#L82)

Include markdown headings for each scope block in the returned context.

#### Default

```ts
true
```
