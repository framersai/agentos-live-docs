# Interface: $ZodPipeDef\<A, B\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:976

## Extends

- [`$ZodTypeDef`]($ZodTypeDef.md)

## Extended by

- [`$ZodCodecDef`]($ZodCodecDef.md)

## Type Parameters

### A

`A` *extends* [`SomeType`](../type-aliases/SomeType.md) = [`$ZodType`]($ZodType-1.md)

### B

`B` *extends* [`SomeType`](../type-aliases/SomeType.md) = [`$ZodType`]($ZodType-1.md)

## Properties

### checks?

> `optional` **checks**: [`$ZodCheck`]($ZodCheck.md)\<`never`\>[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:33

#### Inherited from

[`$ZodTypeDef`]($ZodTypeDef.md).[`checks`]($ZodTypeDef.md#checks)

***

### error?

> `optional` **error**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`never`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:32

#### Inherited from

[`$ZodTypeDef`]($ZodTypeDef.md).[`error`]($ZodTypeDef.md#error)

***

### in

> **in**: `A`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:978

***

### out

> **out**: `B`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:979

***

### reverseTransform()?

> `optional` **reverseTransform**: (`value`, `payload`) => [`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<[`output`](../type-aliases/output.md)\<`A`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:983

Only defined inside $ZodCodec instances.

#### Parameters

##### value

[`input`](../type-aliases/input.md)\<`B`\>

##### payload

[`ParsePayload`](ParsePayload.md)\<[`input`](../type-aliases/input.md)\<`B`\>\>

#### Returns

[`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<[`output`](../type-aliases/output.md)\<`A`\>\>

***

### transform()?

> `optional` **transform**: (`value`, `payload`) => [`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<[`input`](../type-aliases/input.md)\<`B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:981

Only defined inside $ZodCodec instances.

#### Parameters

##### value

[`output`](../type-aliases/output.md)\<`A`\>

##### payload

[`ParsePayload`](ParsePayload.md)\<[`output`](../type-aliases/output.md)\<`A`\>\>

#### Returns

[`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<[`input`](../type-aliases/input.md)\<`B`\>\>

***

### type

> **type**: `"pipe"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:977

#### Overrides

[`$ZodTypeDef`]($ZodTypeDef.md).[`type`]($ZodTypeDef.md#type)
