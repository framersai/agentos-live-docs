# Interface: $ZodDiscriminatedUnionDef\<Options, Disc\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:647

## Extends

- [`$ZodUnionDef`]($ZodUnionDef.md)\<`Options`\>

## Type Parameters

### Options

`Options` *extends* readonly [`SomeType`](../type-aliases/SomeType.md)[] = readonly [`$ZodType`]($ZodType-1.md)[]

### Disc

`Disc` *extends* `string` = `string`

## Properties

### checks?

> `optional` **checks**: [`$ZodCheck`]($ZodCheck.md)\<`never`\>[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:33

#### Inherited from

[`$ZodUnionDef`]($ZodUnionDef.md).[`checks`]($ZodUnionDef.md#checks)

***

### discriminator

> **discriminator**: `Disc`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:648

***

### error?

> `optional` **error**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`never`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:32

#### Inherited from

[`$ZodUnionDef`]($ZodUnionDef.md).[`error`]($ZodUnionDef.md#error)

***

### inclusive?

> `optional` **inclusive**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:623

#### Inherited from

[`$ZodUnionDef`]($ZodUnionDef.md).[`inclusive`]($ZodUnionDef.md#inclusive)

***

### options

> **options**: `Options`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:622

#### Inherited from

[`$ZodUnionDef`]($ZodUnionDef.md).[`options`]($ZodUnionDef.md#options-1)

***

### type

> **type**: `"union"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:621

#### Inherited from

[`$ZodUnionDef`]($ZodUnionDef.md).[`type`]($ZodUnionDef.md#type)

***

### unionFallback?

> `optional` **unionFallback**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:649
