# ~~Function: nativeEnum()~~

> **nativeEnum**\<`T`\>(`entries`, `params?`): [`ZodEnum`](../interfaces/ZodEnum.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:556

## Type Parameters

### T

`T` *extends* `Readonly`\<`Record`\<`string`, [`EnumValue`](../namespaces/util/type-aliases/EnumValue.md)\>\>

## Parameters

### entries

`T`

### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidValue`](../namespaces/core/interfaces/$ZodIssueInvalidValue.md)\<`unknown`\>\>; `message?`: `string`; \}

#### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidValue`](../namespaces/core/interfaces/$ZodIssueInvalidValue.md)\<`unknown`\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`ZodEnum`](../interfaces/ZodEnum.md)\<`T`\>

## Deprecated

This API has been merged into `z.enum()`. Use `z.enum()` instead.

```ts
enum Colors { red, green, blue }
z.enum(Colors);
```
