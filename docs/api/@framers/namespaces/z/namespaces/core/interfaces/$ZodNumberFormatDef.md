# Interface: $ZodNumberFormatDef

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:383

## Extends

- [`$ZodNumberDef`]($ZodNumberDef.md).[`$ZodCheckNumberFormatDef`]($ZodCheckNumberFormatDef.md)

## Properties

### abort?

> `optional` **abort**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:9

If true, no later checks will be executed if this check fails. Default `false`.

#### Inherited from

[`$ZodCheckNumberFormatDef`]($ZodCheckNumberFormatDef.md).[`abort`]($ZodCheckNumberFormatDef.md#abort)

***

### check

> **check**: `"number_format"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:64

#### Inherited from

[`$ZodCheckNumberFormatDef`]($ZodCheckNumberFormatDef.md).[`check`]($ZodCheckNumberFormatDef.md#check)

***

### checks?

> `optional` **checks**: [`$ZodCheck`]($ZodCheck.md)\<`never`\>[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:33

#### Inherited from

[`$ZodNumberDef`]($ZodNumberDef.md).[`checks`]($ZodNumberDef.md#checks)

***

### coerce?

> `optional` **coerce**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:362

#### Inherited from

[`$ZodNumberDef`]($ZodNumberDef.md).[`coerce`]($ZodNumberDef.md#coerce)

***

### error?

> `optional` **error**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`never`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:32

#### Inherited from

[`$ZodNumberDef`]($ZodNumberDef.md).[`error`]($ZodNumberDef.md#error)

***

### format

> **format**: [`$ZodNumberFormats`](../type-aliases/$ZodNumberFormats.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:65

#### Inherited from

[`$ZodCheckNumberFormatDef`]($ZodCheckNumberFormatDef.md).[`format`]($ZodCheckNumberFormatDef.md#format)

***

### type

> **type**: `"number"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:361

#### Inherited from

[`$ZodNumberDef`]($ZodNumberDef.md).[`type`]($ZodNumberDef.md#type)

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

[`$ZodCheckNumberFormatDef`]($ZodCheckNumberFormatDef.md).[`when`]($ZodCheckNumberFormatDef.md#when)
