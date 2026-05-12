# Function: instanceof()

> **instanceof**\<`T`\>(`cls`, `params?`): [`ZodCustom`](../interfaces/ZodCustom.md)\<`InstanceType`\<`T`\>, `InstanceType`\<`T`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:719

## Type Parameters

### T

`T` *extends* *typeof* [`Class`](../namespaces/util/classes/Class.md)

## Parameters

### cls

`T`

### params?

#### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueCustom`](../namespaces/core/interfaces/$ZodIssueCustom.md)\>

#### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### when?

(`payload`) => `boolean`

If provided, this check will only be executed if the function returns `true`. Defaults to `payload => z.util.isAborted(payload)`.

## Returns

[`ZodCustom`](../interfaces/ZodCustom.md)\<`InstanceType`\<`T`\>, `InstanceType`\<`T`\>\>
