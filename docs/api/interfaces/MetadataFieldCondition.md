# Interface: MetadataFieldCondition

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:60](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/vector-store/IVectorStore.ts#L60)

Defines conditions for filtering metadata fields during a query.
Each property represents a comparison operator.

## Interface

MetadataFieldCondition

## Example

```ts
// Find documents where 'year' >= 2022
{ year: { $gte: 2022 } }
// Find documents where 'tags' array contains 'typescript'
{ tags: { $contains: 'typescript' } }
// Find documents where 'status' is 'published'
{ status: { $eq: 'published' } } // or simply { status: 'published' }
```

## Properties

### $all?

> `optional` **$all**: [`MetadataScalarValue`](../type-aliases/MetadataScalarValue.md)[]

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:71](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/vector-store/IVectorStore.ts#L71)

***

### $contains?

> `optional` **$contains**: [`MetadataScalarValue`](../type-aliases/MetadataScalarValue.md)

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:70](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/vector-store/IVectorStore.ts#L70)

***

### $eq?

> `optional` **$eq**: [`MetadataScalarValue`](../type-aliases/MetadataScalarValue.md)

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:61](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/vector-store/IVectorStore.ts#L61)

***

### $exists?

> `optional` **$exists**: `boolean`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:69](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/vector-store/IVectorStore.ts#L69)

***

### $gt?

> `optional` **$gt**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:63](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/vector-store/IVectorStore.ts#L63)

***

### $gte?

> `optional` **$gte**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:64](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/vector-store/IVectorStore.ts#L64)

***

### $in?

> `optional` **$in**: [`MetadataScalarValue`](../type-aliases/MetadataScalarValue.md)[]

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:67](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/vector-store/IVectorStore.ts#L67)

***

### $lt?

> `optional` **$lt**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:65](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/vector-store/IVectorStore.ts#L65)

***

### $lte?

> `optional` **$lte**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:66](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/vector-store/IVectorStore.ts#L66)

***

### $ne?

> `optional` **$ne**: [`MetadataScalarValue`](../type-aliases/MetadataScalarValue.md)

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:62](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/vector-store/IVectorStore.ts#L62)

***

### $nin?

> `optional` **$nin**: [`MetadataScalarValue`](../type-aliases/MetadataScalarValue.md)[]

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:68](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/vector-store/IVectorStore.ts#L68)

***

### $textSearch?

> `optional` **$textSearch**: `string`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:72](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/vector-store/IVectorStore.ts#L72)
