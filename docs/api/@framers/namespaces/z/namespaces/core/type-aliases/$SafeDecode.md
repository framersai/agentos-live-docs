# Type Alias: $SafeDecode()

> **$SafeDecode** = \<`T`\>(`schema`, `value`, `_ctx?`) => [`SafeParseResult`](../../util/type-aliases/SafeParseResult.md)\<[`output`](output.md)\<`T`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/parse.d.cts:41

## Type Parameters

### T

`T` *extends* [`$ZodType`](../interfaces/$ZodType-1.md)

## Parameters

### schema

`T`

### value

[`input`](input.md)\<`T`\>

### \_ctx?

[`ParseContext`](../interfaces/ParseContext.md)\<[`$ZodIssue`]($ZodIssue.md)\>

## Returns

[`SafeParseResult`](../../util/type-aliases/SafeParseResult.md)\<[`output`](output.md)\<`T`\>\>
