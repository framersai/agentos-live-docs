# Interface: $ZodBase64Def

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:314

## Extends

- [`$ZodStringFormatDef`]($ZodStringFormatDef.md)\<`"base64"`\>

## Properties

### abort?

> `optional` **abort**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:9

If true, no later checks will be executed if this check fails. Default `false`.

#### Inherited from

[`$ZodStringFormatDef`]($ZodStringFormatDef.md).[`abort`]($ZodStringFormatDef.md#abort)

***

### check

> **check**: `"string_format"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:162

#### Inherited from

[`$ZodCheckStringFormatDef`]($ZodCheckStringFormatDef.md).[`check`]($ZodCheckStringFormatDef.md#check)

***

### checks?

> `optional` **checks**: [`$ZodCheck`]($ZodCheck.md)\<`string`\>[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:103

#### Inherited from

[`$ZodStringFormatDef`]($ZodStringFormatDef.md).[`checks`]($ZodStringFormatDef.md#checks)

***

### coerce?

> `optional` **coerce**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:102

#### Inherited from

[`$ZodStringFormatDef`]($ZodStringFormatDef.md).[`coerce`]($ZodStringFormatDef.md#coerce)

***

### error?

> `optional` **error**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`never`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:32

#### Inherited from

[`$ZodStringFormatDef`]($ZodStringFormatDef.md).[`error`]($ZodStringFormatDef.md#error)

***

### format

> **format**: `"base64"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:163

#### Inherited from

[`$ZodStringFormatDef`]($ZodStringFormatDef.md).[`format`]($ZodStringFormatDef.md#format-1)

***

### pattern?

> `optional` **pattern**: `RegExp`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/checks.d.cts:164

#### Inherited from

[`$ZodStringFormatDef`]($ZodStringFormatDef.md).[`pattern`]($ZodStringFormatDef.md#pattern)

***

### type

> **type**: `"string"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:101

#### Inherited from

[`$ZodStringFormatDef`]($ZodStringFormatDef.md).[`type`]($ZodStringFormatDef.md#type)

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

[`$ZodStringFormatDef`]($ZodStringFormatDef.md).[`when`]($ZodStringFormatDef.md#when)
