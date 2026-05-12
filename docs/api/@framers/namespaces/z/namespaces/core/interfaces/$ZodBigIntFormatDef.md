# Interface: $ZodBigIntFormatDef

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:426

## Extends

- [`$ZodBigIntDef`]($ZodBigIntDef.md).[`$ZodCheckBigIntFormatDef`]($ZodCheckBigIntFormatDef.md)

## Properties

### abort?

> `optional` **abort**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:9

If true, no later checks will be executed if this check fails. Default `false`.

#### Inherited from

[`$ZodCheckBigIntFormatDef`]($ZodCheckBigIntFormatDef.md).[`abort`]($ZodCheckBigIntFormatDef.md#abort)

***

### check

> **check**: `"bigint_format"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:427

#### Overrides

[`$ZodCheckBigIntFormatDef`]($ZodCheckBigIntFormatDef.md).[`check`]($ZodCheckBigIntFormatDef.md#check)

***

### checks?

> `optional` **checks**: [`$ZodCheck`]($ZodCheck.md)\<`never`\>[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:33

#### Inherited from

[`$ZodBigIntDef`]($ZodBigIntDef.md).[`checks`]($ZodBigIntDef.md#checks)

***

### coerce?

> `optional` **coerce**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:409

#### Inherited from

[`$ZodBigIntDef`]($ZodBigIntDef.md).[`coerce`]($ZodBigIntDef.md#coerce)

***

### error?

> `optional` **error**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`never`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:32

#### Inherited from

[`$ZodBigIntDef`]($ZodBigIntDef.md).[`error`]($ZodBigIntDef.md#error)

***

### format

> **format**: [`$ZodBigIntFormats`](../type-aliases/$ZodBigIntFormats.md) \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:78

#### Inherited from

[`$ZodCheckBigIntFormatDef`]($ZodCheckBigIntFormatDef.md).[`format`]($ZodCheckBigIntFormatDef.md#format)

***

### type

> **type**: `"bigint"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:408

#### Inherited from

[`$ZodBigIntDef`]($ZodBigIntDef.md).[`type`]($ZodBigIntDef.md#type)

***

### when()?

> `optional` **when**: (`payload`) => `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:11

If provided, this check will only be executed if the function returns `true`. Defaults to `payload => z.util.isAborted(payload)`.

#### Parameters

##### payload

[`ParsePayload`](ParsePayload.md)

#### Returns

`boolean`

#### Inherited from

[`$ZodCheckBigIntFormatDef`]($ZodCheckBigIntFormatDef.md).[`when`]($ZodCheckBigIntFormatDef.md#when)
