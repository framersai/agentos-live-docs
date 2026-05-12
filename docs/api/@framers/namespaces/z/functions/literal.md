# Function: literal()

## Call Signature

> **literal**\<`T`\>(`value`, `params?`): [`ZodLiteral`](../interfaces/ZodLiteral.md)\<`T`\[`number`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:564

### Type Parameters

#### T

`T` *extends* readonly [`Literal`](../namespaces/util/type-aliases/Literal.md)[]

### Parameters

#### value

`T`

#### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidValue`](../namespaces/core/interfaces/$ZodIssueInvalidValue.md)\<`unknown`\>\>; `message?`: `string`; \}

##### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidValue`](../namespaces/core/interfaces/$ZodIssueInvalidValue.md)\<`unknown`\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

### Returns

[`ZodLiteral`](../interfaces/ZodLiteral.md)\<`T`\[`number`\]\>

## Call Signature

> **literal**\<`T`\>(`value`, `params?`): [`ZodLiteral`](../interfaces/ZodLiteral.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:565

### Type Parameters

#### T

`T` *extends* [`Literal`](../namespaces/util/type-aliases/Literal.md)

### Parameters

#### value

`T`

#### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidValue`](../namespaces/core/interfaces/$ZodIssueInvalidValue.md)\<`unknown`\>\>; `message?`: `string`; \}

##### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidValue`](../namespaces/core/interfaces/$ZodIssueInvalidValue.md)\<`unknown`\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

### Returns

[`ZodLiteral`](../interfaces/ZodLiteral.md)\<`T`\>
