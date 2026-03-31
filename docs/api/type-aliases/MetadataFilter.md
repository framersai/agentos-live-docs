# Type Alias: MetadataFilter

> **MetadataFilter** = `object`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:89](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/vector-store/IVectorStore.ts#L89)

Defines a filter for document metadata. All top-level key-value pairs are implicitly ANDed.
The value for a field can be a direct scalar match (implicit equality) or a `MetadataFieldCondition` object
for more complex comparisons.

## Index Signature

\[`key`: `string`\]: [`MetadataScalarValue`](MetadataScalarValue.md) \| [`MetadataFieldCondition`](../interfaces/MetadataFieldCondition.md)

## Example

```ts
const filter: MetadataFilter = {
category: "technology", // Implicit $eq
year: { $gte: 2023 },
tags: { $all: ["typescript", "AI"] },
isPublished: true
};
```
