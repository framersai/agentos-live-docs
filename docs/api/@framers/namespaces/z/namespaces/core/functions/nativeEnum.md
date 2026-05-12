# ~~Function: \_nativeEnum()~~

> **\_nativeEnum**\<`T`\>(`Class`, `entries`, `params?`): [`$ZodEnum`](../interfaces/$ZodEnum.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:242

## Type Parameters

### T

`T` *extends* `Readonly`\<`Record`\<`string`, [`EnumValue`](../../util/type-aliases/EnumValue.md)\>\>

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<[`$ZodEnum`](../interfaces/$ZodEnum.md)\<`Readonly`\<`Record`\<`string`, [`EnumValue`](../../util/type-aliases/EnumValue.md)\>\>\>\>

### entries

`T`

### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidValue`](../interfaces/$ZodIssueInvalidValue.md)\<`unknown`\>\>; `message?`: `string`; \}

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidValue`](../interfaces/$ZodIssueInvalidValue.md)\<`unknown`\>\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`$ZodEnum`](../interfaces/$ZodEnum.md)\<`T`\>

## Deprecated

This API has been merged into `z.enum()`. Use `z.enum()` instead.

```ts
enum Colors { red, green, blue }
z.enum(Colors);
```
