# Interface: RememberOptions

Defined in: [packages/agentos/src/memory/io/facade/types.ts:293](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L293)

Options for storing a new memory trace via `Memory.remember()`.

## Properties

### entities?

> `optional` **entities**: `string`[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:322](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L322)

Named entities extracted from or associated with this trace.

#### Example

```ts
['Alice', 'GPT-4o', 'Q3 roadmap']
```

***

### importance?

> `optional` **importance**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:328](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L328)

Manually supplied importance score (0–1).
When omitted the encoding engine derives one automatically.

***

### scope?

> `optional` **scope**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:304](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L304)

Visibility scope of the trace.

#### Example

```ts
'thread' | 'user' | 'persona' | 'organization'
```

***

### scopeId?

> `optional` **scopeId**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:310](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L310)

Identifier for the scope (e.g. thread ID, user ID).
Required when `scope` is set.

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:316](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L316)

Free-form tags for filtering and retrieval.

#### Example

```ts
['project:alpha', 'decision']
```

***

### type?

> `optional` **type**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:298](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L298)

Tulving memory type.

#### Example

```ts
'episodic' | 'semantic' | 'procedural' | 'prospective'
```
