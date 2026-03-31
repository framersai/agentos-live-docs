# Interface: RememberOptions

Defined in: [packages/agentos/src/memory/io/facade/types.ts:291](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/facade/types.ts#L291)

Options for storing a new memory trace via `Memory.remember()`.

## Properties

### entities?

> `optional` **entities**: `string`[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:320](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/facade/types.ts#L320)

Named entities extracted from or associated with this trace.

#### Example

```ts
['Alice', 'GPT-4o', 'Q3 roadmap']
```

***

### importance?

> `optional` **importance**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:326](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/facade/types.ts#L326)

Manually supplied importance score (0–1).
When omitted the encoding engine derives one automatically.

***

### scope?

> `optional` **scope**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:302](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/facade/types.ts#L302)

Visibility scope of the trace.

#### Example

```ts
'thread' | 'user' | 'persona' | 'organization'
```

***

### scopeId?

> `optional` **scopeId**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:308](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/facade/types.ts#L308)

Identifier for the scope (e.g. thread ID, user ID).
Required when `scope` is set.

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:314](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/facade/types.ts#L314)

Free-form tags for filtering and retrieval.

#### Example

```ts
['project:alpha', 'decision']
```

***

### type?

> `optional` **type**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:296](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/facade/types.ts#L296)

Tulving memory type.

#### Example

```ts
'episodic' | 'semantic' | 'procedural' | 'prospective'
```
