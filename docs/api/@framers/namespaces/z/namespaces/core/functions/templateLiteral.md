# Function: \_templateLiteral()

> **\_templateLiteral**\<`Parts`\>(`Class`, `parts`, `params?`): [`$ZodTemplateLiteral`](../interfaces/$ZodTemplateLiteral.md)\<[`$PartsToTemplateLiteral`](../type-aliases/$PartsToTemplateLiteral.md)\<`Parts`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:267

## Type Parameters

### Parts

`Parts` *extends* [`$ZodTemplateLiteralPart`](../type-aliases/$ZodTemplateLiteralPart.md)[]

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<[`$ZodTemplateLiteral`](../interfaces/$ZodTemplateLiteral.md)\<`string`\>\>

### parts

`Parts`

### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>; `format?`: `string`; `message?`: `string`; \}

#### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>

#### format?

`string`

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`$ZodTemplateLiteral`](../interfaces/$ZodTemplateLiteral.md)\<[`$PartsToTemplateLiteral`](../type-aliases/$PartsToTemplateLiteral.md)\<`Parts`\>\>
