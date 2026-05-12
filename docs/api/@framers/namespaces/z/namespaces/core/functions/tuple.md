# Function: \_tuple()

## Call Signature

> **\_tuple**\<`T`\>(`Class`, `items`, `params?`): [`$ZodTuple`](../interfaces/$ZodTuple.md)\<`T`, `null`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:224

### Type Parameters

#### T

`T` *extends* readonly \[[`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>, [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>\]

### Parameters

#### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<[`$ZodTuple`](../interfaces/$ZodTuple.md)\<readonly [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>[], [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| `null`\>\>

#### items

`T`

#### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../interfaces/$ZodIssueTooBig.md)\<`unknown`[]\> \| [`$ZodIssueTooSmall`](../interfaces/$ZodIssueTooSmall.md)\<`unknown`[]\>\>\>; `message?`: `string`; \}

##### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../interfaces/$ZodIssueTooBig.md)\<`unknown`[]\> \| [`$ZodIssueTooSmall`](../interfaces/$ZodIssueTooSmall.md)\<`unknown`[]\>\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

### Returns

[`$ZodTuple`](../interfaces/$ZodTuple.md)\<`T`, `null`\>

## Call Signature

> **\_tuple**\<`T`, `Rest`\>(`Class`, `items`, `rest`, `params?`): [`$ZodTuple`](../interfaces/$ZodTuple.md)\<`T`, `Rest`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/api.d.cts:225

### Type Parameters

#### T

`T` *extends* readonly \[[`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>, [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>\]

#### Rest

`Rest` *extends* [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>

### Parameters

#### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<[`$ZodTuple`](../interfaces/$ZodTuple.md)\<readonly [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>[], [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\> \| `null`\>\>

#### items

`T`

#### rest

`Rest`

#### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../interfaces/$ZodIssueTooBig.md)\<`unknown`[]\> \| [`$ZodIssueTooSmall`](../interfaces/$ZodIssueTooSmall.md)\<`unknown`[]\>\>\>; `message?`: `string`; \}

##### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidType`](../interfaces/$ZodIssueInvalidType.md)\<`unknown`\> \| [`$ZodIssueTooBig`](../interfaces/$ZodIssueTooBig.md)\<`unknown`[]\> \| [`$ZodIssueTooSmall`](../interfaces/$ZodIssueTooSmall.md)\<`unknown`[]\>\>\>

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

### Returns

[`$ZodTuple`](../interfaces/$ZodTuple.md)\<`T`, `Rest`\>
