# Interface: $ZodTuple\<T, Rest\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:709

## Extends

- [`$ZodType`]($ZodType-1.md)

## Extended by

- [`ZodTuple`](../../../interfaces/ZodTuple.md)

## Type Parameters

### T

`T` *extends* [`TupleItems`](../../util/type-aliases/TupleItems.md) = readonly [`$ZodType`]($ZodType-1.md)[]

### Rest

`Rest` *extends* [`SomeType`](../type-aliases/SomeType.md) \| `null` = [`$ZodType`]($ZodType-1.md) \| `null`

## Properties

### \_zod

> **\_zod**: [`$ZodTupleInternals`]($ZodTupleInternals.md)\<`T`, `Rest`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:710

#### Overrides

[`$ZodType`]($ZodType-1.md).[`_zod`]($ZodType-1.md#_zod)

***

### ~standard

> **~standard**: [`$ZodStandardSchema`](../type-aliases/$ZodStandardSchema.md)\<`$ZodTuple`\<`T`, `Rest`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:94

#### Inherited from

[`$ZodType`]($ZodType-1.md).[`~standard`]($ZodType-1.md#standard)
