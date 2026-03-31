# Interface: StandaloneMemoryLongTermRetrieverOptions

Defined in: [packages/agentos/src/memory/io/integration/StandaloneMemoryBridge.ts:65](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/integration/StandaloneMemoryBridge.ts#L65)

## Properties

### conversationLimit?

> `optional` **conversationLimit**: `number`

Defined in: [packages/agentos/src/memory/io/integration/StandaloneMemoryBridge.ts:76](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/integration/StandaloneMemoryBridge.ts#L76)

Conversation-scope cap. `topKByScope` only covers user/persona/org.

#### Default

```ts
4
```

***

### defaultLimitPerScope?

> `optional` **defaultLimitPerScope**: `number`

Defined in: [packages/agentos/src/memory/io/integration/StandaloneMemoryBridge.ts:70](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/integration/StandaloneMemoryBridge.ts#L70)

Fallback result limit for scopes that do not have an explicit cap.

#### Default

```ts
4
```

***

### includeScopeHeadings?

> `optional` **includeScopeHeadings**: `boolean`

Defined in: [packages/agentos/src/memory/io/integration/StandaloneMemoryBridge.ts:82](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/integration/StandaloneMemoryBridge.ts#L82)

Include markdown headings for each scope block in the returned context.

#### Default

```ts
true
```
