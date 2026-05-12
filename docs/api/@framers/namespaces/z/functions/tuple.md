# Function: tuple()

## Call Signature

> **tuple**\<`T`\>(`items`, `params?`): [`ZodTuple`](../interfaces/ZodTuple.md)\<`T`, `null`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:504

### Type Parameters

#### T

`T` *extends* readonly \[[`SomeType`](../namespaces/core/type-aliases/SomeType.md), [`SomeType`](../namespaces/core/type-aliases/SomeType.md)\]

### Parameters

#### items

`T`

#### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<`unknown`[]\> \| [`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<`unknown`[]\>\>\>; `message?`: `string`; \}

##### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<`unknown`[]\> \| [`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<`unknown`[]\>\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

### Returns

[`ZodTuple`](../interfaces/ZodTuple.md)\<`T`, `null`\>

## Call Signature

> **tuple**\<`T`, `Rest`\>(`items`, `rest`, `params?`): [`ZodTuple`](../interfaces/ZodTuple.md)\<`T`, `Rest`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:505

### Type Parameters

#### T

`T` *extends* readonly \[[`SomeType`](../namespaces/core/type-aliases/SomeType.md), [`SomeType`](../namespaces/core/type-aliases/SomeType.md)\]

#### Rest

`Rest` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

### Parameters

#### items

`T`

#### rest

`Rest`

#### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<`unknown`[]\> \| [`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<`unknown`[]\>\>\>; `message?`: `string`; \}

##### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<`unknown`[]\> \| [`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<`unknown`[]\>\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

### Returns

[`ZodTuple`](../interfaces/ZodTuple.md)\<`T`, `Rest`\>

## Call Signature

> **tuple**(`items`, `params?`): [`ZodTuple`](../interfaces/ZodTuple.md)\<\[\], `null`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:506

### Parameters

#### items

\[\]

#### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<`unknown`[]\> \| [`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<`unknown`[]\>\>\>; `message?`: `string`; \}

##### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../namespaces/core/interfaces/$ZodIssueTooBig.md)\<`unknown`[]\> \| [`$ZodIssueTooSmall`](../namespaces/core/interfaces/$ZodIssueTooSmall.md)\<`unknown`[]\>\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

### Returns

[`ZodTuple`](../interfaces/ZodTuple.md)\<\[\], `null`\>
