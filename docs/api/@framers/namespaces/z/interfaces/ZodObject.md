# Interface: ZodObject\<Shape, Config\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:431

## Extends

- [`_ZodType`](ZodType.md)\<[`$ZodObjectInternals`](../namespaces/core/interfaces/$ZodObjectInternals.md)\<`Shape`, `Config`\>\>.[`$ZodObject`](../namespaces/core/interfaces/$ZodObject.md)\<`Shape`, `Config`\>

## Type Parameters

### Shape

`Shape` *extends* [`$ZodShape`](../namespaces/core/type-aliases/$ZodShape.md) = [`$ZodLooseShape`](../namespaces/core/type-aliases/$ZodLooseShape.md)

### Config

`Config` *extends* [`$ZodObjectConfig`](../namespaces/core/type-aliases/$ZodObjectConfig.md) = [`$strip`](../namespaces/core/type-aliases/$strip.md)

## Properties

### ~~\_def~~

> **\_def**: [`$ZodObjectDef`](../namespaces/core/interfaces/$ZodObjectDef.md)\<`Shape`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:10

#### Deprecated

Use `.def` instead.

#### Inherited from

[`_ZodType`](ZodType.md).[`_def`](ZodType.md#_def)

***

### ~~\_input~~

> **\_input**: [`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`, `Config`\[`"in"`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:14

#### Deprecated

Use `z.input<typeof schema>` instead.

#### Inherited from

[`_ZodType`](ZodType.md).[`_input`](ZodType.md#_input)

***

### ~~\_output~~

> **\_output**: [`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:12

#### Deprecated

Use `z.output<typeof schema>` instead.

#### Inherited from

[`_ZodType`](ZodType.md).[`_output`](ZodType.md#_output)

***

### \_zod

> **\_zod**: [`$ZodObjectInternals`](../namespaces/core/interfaces/$ZodObjectInternals.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:93

#### Inherited from

[`_ZodType`](ZodType.md).[`_zod`](ZodType.md#_zod)

***

### ~standard

> **~standard**: [`ZodStandardSchemaWithJSON`](../type-aliases/ZodStandardSchemaWithJSON.md)\<`ZodObject`\<`Shape`, `Config`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:434

#### Overrides

[`_ZodType`](ZodType.md).[`~standard`](ZodType.md#standard)

***

### def

> **def**: [`$ZodObjectDef`](../namespaces/core/interfaces/$ZodObjectDef.md)\<`Shape`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:7

#### Inherited from

[`_ZodType`](ZodType.md).[`def`](ZodType.md#def)

***

### description?

> `optional` **description**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:60

#### Inherited from

[`_ZodType`](ZodType.md).[`description`](ZodType.md#description)

***

### shape

> **shape**: `Shape`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:435

***

### spa()

> **spa**: (`data`, `params?`) => `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:29

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`spa`](ZodType.md#spa)

***

### type

> **type**: `"object"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:8

#### Inherited from

[`_ZodType`](ZodType.md).[`type`](ZodType.md#type)

## Methods

### and()

> **and**\<`T`\>(`incoming`): [`ZodIntersection`](ZodIntersection.md)\<`ZodObject`\<`Shape`, `Config`\>, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:52

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### incoming

`T`

#### Returns

[`ZodIntersection`](ZodIntersection.md)\<`ZodObject`\<`Shape`, `Config`\>, `T`\>

#### Inherited from

[`_ZodType`](ZodType.md).[`and`](ZodType.md#and)

***

### apply()

> **apply**\<`T`\>(`fn`): `T`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:82

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

(`schema`) => `T`

#### Returns

`T`

#### Inherited from

[`_ZodType`](ZodType.md).[`apply`](ZodType.md#apply)

***

### array()

> **array**(): [`ZodArray`](ZodArray.md)\<`ZodObject`\<`Shape`, `Config`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:50

#### Returns

[`ZodArray`](ZodArray.md)\<`ZodObject`\<`Shape`, `Config`\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`array`](ZodType.md#array)

***

### brand()

> **brand**\<`T`, `Dir`\>(`value?`): `PropertyKey` *extends* `T` ? `ZodObject`\<`Shape`, `Config`\> : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodObject`\<`Shape`, `Config`\>, `T`, `Dir`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:24

#### Type Parameters

##### T

`T` *extends* `PropertyKey` = `PropertyKey`

##### Dir

`Dir` *extends* `"inout"` \| `"in"` \| `"out"` = `"out"`

#### Parameters

##### value?

`T`

#### Returns

`PropertyKey` *extends* `T` ? `ZodObject`\<`Shape`, `Config`\> : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodObject`\<`Shape`, `Config`\>, `T`, `Dir`\>

#### Inherited from

[`_ZodType`](ZodType.md).[`brand`](ZodType.md#brand)

***

### catch()

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodObject`\<`Shape`, `Config`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:54

##### Parameters

###### def

[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`\>

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodObject`\<`Shape`, `Config`\>\>

##### Inherited from

[`_ZodType`](ZodType.md).[`catch`](ZodType.md#catch)

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodObject`\<`Shape`, `Config`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:55

##### Parameters

###### def

(`ctx`) => [`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`\>

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodObject`\<`Shape`, `Config`\>\>

##### Inherited from

[`_ZodType`](ZodType.md).[`catch`](ZodType.md#catch)

***

### catchall()

> **catchall**\<`T`\>(`schema`): `ZodObject`\<`Shape`, [`$catchall`](../namespaces/core/type-aliases/$catchall.md)\<`T`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:438

Define a schema to validate all unrecognized keys. This overrides the existing strict/loose behavior.

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### schema

`T`

#### Returns

`ZodObject`\<`Shape`, [`$catchall`](../namespaces/core/type-aliases/$catchall.md)\<`T`\>\>

***

### check()

> **check**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:18

#### Parameters

##### checks

...([`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\> \| [`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>)[]

#### Returns

`this`

#### Inherited from

[`_ZodType`](ZodType.md).[`check`](ZodType.md#check)

***

### clone()

> **clone**(`def?`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:20

#### Parameters

##### def?

[`$ZodObjectDef`](../namespaces/core/interfaces/$ZodObjectDef.md)\<`Shape`\>

##### params?

###### parent

`boolean`

#### Returns

`this`

#### Inherited from

[`_ZodType`](ZodType.md).[`clone`](ZodType.md#clone)

***

### decode()

> **decode**(`data`, `params?`): [`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:31

#### Parameters

##### data

[`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`\>

#### Inherited from

[`_ZodType`](ZodType.md).[`decode`](ZodType.md#decode)

***

### decodeAsync()

> **decodeAsync**(`data`, `params?`): `Promise`\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:33

#### Parameters

##### data

[`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`decodeAsync`](ZodType.md#decodeasync)

***

### default()

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodObject`\<`Shape`, `Config`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:46

##### Parameters

###### def

[`NoUndefined`](../namespaces/util/type-aliases/NoUndefined.md)\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodObject`\<`Shape`, `Config`\>\>

##### Inherited from

[`_ZodType`](ZodType.md).[`default`](ZodType.md#default)

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodObject`\<`Shape`, `Config`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:47

##### Parameters

###### def

() => [`NoUndefined`](../namespaces/util/type-aliases/NoUndefined.md)\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodObject`\<`Shape`, `Config`\>\>

##### Inherited from

[`_ZodType`](ZodType.md).[`default`](ZodType.md#default)

***

### describe()

> **describe**(`description`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:59

Returns a new instance that has been registered in `z.globalRegistry` with the specified description

#### Parameters

##### description

`string`

#### Returns

`this`

#### Inherited from

[`_ZodType`](ZodType.md).[`describe`](ZodType.md#describe)

***

### encode()

> **encode**(`data`, `params?`): [`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:30

#### Parameters

##### data

[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`\>

#### Inherited from

[`_ZodType`](ZodType.md).[`encode`](ZodType.md#encode)

***

### encodeAsync()

> **encodeAsync**(`data`, `params?`): `Promise`\<[`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`, `Config`\[`"in"`\]\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:32

#### Parameters

##### data

[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`, `Config`\[`"in"`\]\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`encodeAsync`](ZodType.md#encodeasync)

***

### exactOptional()

> **exactOptional**(): [`ZodExactOptional`](ZodExactOptional.md)\<`ZodObject`\<`Shape`, `Config`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:42

#### Returns

[`ZodExactOptional`](ZodExactOptional.md)\<`ZodObject`\<`Shape`, `Config`\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`exactOptional`](ZodType.md#exactoptional)

***

### extend()

> **extend**\<`U`\>(`shape`): `ZodObject`\<\{ \[k in string \| number \| symbol\]: ((keyof Shape & keyof U) extends never ? Shape & U : \{ \[K in string \| number \| symbol as K extends keyof U ? never : K\]: Shape\[K\] \} & \{ \[K in string \| number \| symbol\]: U\[K\] \})\[k\] \}, `Config`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:447

#### Type Parameters

##### U

`U` *extends* [`$ZodLooseShape`](../namespaces/core/type-aliases/$ZodLooseShape.md)

#### Parameters

##### shape

`U`

#### Returns

`ZodObject`\<\{ \[k in string \| number \| symbol\]: ((keyof Shape & keyof U) extends never ? Shape & U : \{ \[K in string \| number \| symbol as K extends keyof U ? never : K\]: Shape\[K\] \} & \{ \[K in string \| number \| symbol\]: U\[K\] \})\[k\] \}, `Config`\>

***

### ~~isNullable()~~

> **isNullable**(): `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:81

#### Returns

`boolean`

#### Deprecated

Try safe-parsing `null` (this is what `isNullable` does internally):

```ts
const schema = z.string().nullable();
const isNullable = schema.safeParse(null).success; // true
```

#### Inherited from

[`_ZodType`](ZodType.md).[`isNullable`](ZodType.md#isnullable)

***

### ~~isOptional()~~

> **isOptional**(): `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:72

#### Returns

`boolean`

#### Deprecated

Try safe-parsing `undefined` (this is what `isOptional` does internally):

```ts
const schema = z.string().optional();
const isOptional = schema.safeParse(undefined).success; // true
```

#### Inherited from

[`_ZodType`](ZodType.md).[`isOptional`](ZodType.md#isoptional)

***

### keyof()

> **keyof**(): [`ZodEnum`](ZodEnum.md)\<`{ [k in string]: { [k in string]: k }[k] }`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:436

#### Returns

[`ZodEnum`](ZodEnum.md)\<`{ [k in string]: { [k in string]: k }[k] }`\>

***

### loose()

> **loose**(): `ZodObject`\<`Shape`, [`$loose`](../namespaces/core/type-aliases/$loose.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:442

Consider `z.looseObject(A.shape)` instead

#### Returns

`ZodObject`\<`Shape`, [`$loose`](../namespaces/core/type-aliases/$loose.md)\>

***

### ~~merge()~~

> **merge**\<`U`\>(`other`): `ZodObject`\<\{ \[k in string \| number \| symbol\]: ((keyof Shape & keyof U\["shape"\]) extends never ? Shape & U\["shape"\] : \{ \[K in string \| number \| symbol as K extends keyof U\["shape"\] ? never : K\]: Shape\[K\] \} & \{ \[K in string \| number \| symbol\]: U\["shape"\]\[K\] \})\[k\] \}, `U`\[`"_zod"`\]\[`"config"`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:452

#### Type Parameters

##### U

`U` *extends* `ZodObject`\<[`$ZodLooseShape`](../namespaces/core/type-aliases/$ZodLooseShape.md), [`$strip`](../namespaces/core/type-aliases/$strip.md)\>

#### Parameters

##### other

`U`

#### Returns

`ZodObject`\<\{ \[k in string \| number \| symbol\]: ((keyof Shape & keyof U\["shape"\]) extends never ? Shape & U\["shape"\] : \{ \[K in string \| number \| symbol as K extends keyof U\["shape"\] ? never : K\]: Shape\[K\] \} & \{ \[K in string \| number \| symbol\]: U\["shape"\]\[K\] \})\[k\] \}, `U`\[`"_zod"`\]\[`"config"`\]\>

#### Deprecated

Use [`A.extend(B.shape)`](https://zod.dev/api?id=extend) instead.

***

### meta()

#### Call Signature

> **meta**(): \{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:62

Returns the metadata associated with this instance in `z.globalRegistry`

##### Returns

\{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

##### Inherited from

[`_ZodType`](ZodType.md).[`meta`](ZodType.md#meta)

#### Call Signature

> **meta**(`data`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:64

Returns a new instance that has been registered in `z.globalRegistry` with the specified metadata

##### Parameters

###### data

###### deprecated?

`boolean`

###### description?

`string`

###### id?

`string`

###### title?

`string`

##### Returns

`this`

##### Inherited from

[`_ZodType`](ZodType.md).[`meta`](ZodType.md#meta)

***

### nonoptional()

> **nonoptional**(`params?`): [`ZodNonOptional`](ZodNonOptional.md)\<`ZodObject`\<`Shape`, `Config`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:43

#### Parameters

##### params?

`string` |

\{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>; `message?`: `string`; \}

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

#### Returns

[`ZodNonOptional`](ZodNonOptional.md)\<`ZodObject`\<`Shape`, `Config`\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`nonoptional`](ZodType.md#nonoptional)

***

### nullable()

> **nullable**(): [`ZodNullable`](ZodNullable.md)\<`ZodObject`\<`Shape`, `Config`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:44

#### Returns

[`ZodNullable`](ZodNullable.md)\<`ZodObject`\<`Shape`, `Config`\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`nullable`](ZodType.md#nullable)

***

### nullish()

> **nullish**(): [`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodObject`\<`Shape`, `Config`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:45

#### Returns

[`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodObject`\<`Shape`, `Config`\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`nullish`](ZodType.md#nullish)

***

### omit()

> **omit**\<`M`\>(`mask`): `ZodObject`\<\{ \[k in string \| number \| symbol\]: Omit\<Shape, Extract\<keyof Shape, keyof M\>\>\[k\] \}, `Config`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:454

#### Type Parameters

##### M

`M` *extends* [`Mask`](../namespaces/util/type-aliases/Mask.md)\<keyof `Shape`\>

#### Parameters

##### mask

`M` & `Record`\<`Exclude`\<keyof `M`, keyof `Shape`\>, `never`\>

#### Returns

`ZodObject`\<\{ \[k in string \| number \| symbol\]: Omit\<Shape, Extract\<keyof Shape, keyof M\>\>\[k\] \}, `Config`\>

***

### optional()

> **optional**(): [`ZodOptional`](ZodOptional.md)\<`ZodObject`\<`Shape`, `Config`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:41

#### Returns

[`ZodOptional`](ZodOptional.md)\<`ZodObject`\<`Shape`, `Config`\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`optional`](ZodType.md#optional)

***

### or()

> **or**\<`T`\>(`option`): [`ZodUnion`](ZodUnion.md)\<\[`ZodObject`\<`Shape`, `Config`\>, `T`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:51

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### option

`T`

#### Returns

[`ZodUnion`](ZodUnion.md)\<\[`ZodObject`\<`Shape`, `Config`\>, `T`\]\>

#### Inherited from

[`_ZodType`](ZodType.md).[`or`](ZodType.md#or)

***

### overwrite()

> **overwrite**(`fn`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:40

#### Parameters

##### fn

(`x`) => [`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`\>

#### Returns

`this`

#### Inherited from

[`_ZodType`](ZodType.md).[`overwrite`](ZodType.md#overwrite)

***

### parse()

> **parse**(`data`, `params?`): [`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:25

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`\>

#### Inherited from

[`_ZodType`](ZodType.md).[`parse`](ZodType.md#parse)

***

### parseAsync()

> **parseAsync**(`data`, `params?`): `Promise`\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:27

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`parseAsync`](ZodType.md#parseasync)

***

### partial()

#### Call Signature

> **partial**(): `ZodObject`\<\{ \[k in string \| number \| symbol\]: ZodOptional\<Shape\[k\]\> \}, `Config`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:455

##### Returns

`ZodObject`\<\{ \[k in string \| number \| symbol\]: ZodOptional\<Shape\[k\]\> \}, `Config`\>

#### Call Signature

> **partial**\<`M`\>(`mask`): `ZodObject`\<\{ \[k in string \| number \| symbol\]: k extends keyof M ? ZodOptional\<Shape\[k\<k\>\]\> : Shape\[k\] \}, `Config`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:458

##### Type Parameters

###### M

`M` *extends* [`Mask`](../namespaces/util/type-aliases/Mask.md)\<keyof `Shape`\>

##### Parameters

###### mask

`M` & `Record`\<`Exclude`\<keyof `M`, keyof `Shape`\>, `never`\>

##### Returns

`ZodObject`\<\{ \[k in string \| number \| symbol\]: k extends keyof M ? ZodOptional\<Shape\[k\<k\>\]\> : Shape\[k\] \}, `Config`\>

***

### ~~passthrough()~~

> **passthrough**(): `ZodObject`\<`Shape`, [`$loose`](../namespaces/core/type-aliases/$loose.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:440

#### Returns

`ZodObject`\<`Shape`, [`$loose`](../namespaces/core/type-aliases/$loose.md)\>

#### Deprecated

Use `z.looseObject()` or `.loose()` instead.

***

### pick()

> **pick**\<`M`\>(`mask`): `ZodObject`\<\{ \[k in string \| number \| symbol\]: Pick\<Shape, Extract\<keyof Shape, keyof M\>\>\[k\] \}, `Config`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:453

#### Type Parameters

##### M

`M` *extends* [`Mask`](../namespaces/util/type-aliases/Mask.md)\<keyof `Shape`\>

#### Parameters

##### mask

`M` & `Record`\<`Exclude`\<keyof `M`, keyof `Shape`\>, `never`\>

#### Returns

`ZodObject`\<\{ \[k in string \| number \| symbol\]: Pick\<Shape, Extract\<keyof Shape, keyof M\>\>\[k\] \}, `Config`\>

***

### pipe()

> **pipe**\<`T`\>(`target`): [`ZodPipe`](ZodPipe.md)\<`ZodObject`\<`Shape`, `Config`\>, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:56

#### Type Parameters

##### T

`T` *extends* [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, [`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, [`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>\>

#### Parameters

##### target

`T` | [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, [`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, [`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodObject`\<`Shape`, `Config`\>, `T`\>

#### Inherited from

[`_ZodType`](ZodType.md).[`pipe`](ZodType.md#pipe)

***

### prefault()

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodObject`\<`Shape`, `Config`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:48

##### Parameters

###### def

() => [`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`\>

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodObject`\<`Shape`, `Config`\>\>

##### Inherited from

[`_ZodType`](ZodType.md).[`prefault`](ZodType.md#prefault)

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodObject`\<`Shape`, `Config`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:49

##### Parameters

###### def

[`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`\>

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodObject`\<`Shape`, `Config`\>\>

##### Inherited from

[`_ZodType`](ZodType.md).[`prefault`](ZodType.md#prefault)

***

### readonly()

> **readonly**(): [`ZodReadonly`](ZodReadonly.md)\<`ZodObject`\<`Shape`, `Config`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:57

#### Returns

[`ZodReadonly`](ZodReadonly.md)\<`ZodObject`\<`Shape`, `Config`\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`readonly`](ZodType.md#readonly)

***

### refine()

> **refine**\<`Ch`\>(`check`, `params?`): `Ch` *extends* (`arg`) => `arg is R` ? `ZodObject`\<`Shape`, `Config`\> & [`ZodType`](ZodType-1.md)\<`R`, [`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`, `Config`\[`"in"`\]\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, [`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`, `Config`\[`"in"`\]\>\>\> : `ZodObject`\<`Shape`, `Config`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:38

#### Type Parameters

##### Ch

`Ch` *extends* (`arg`) => `unknown`

#### Parameters

##### check

`Ch`

##### params?

`string` |

\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>\>; `message?`: `string`; `params?`: `Record`\<`string`, `any`\>; `path?`: `PropertyKey`[]; `when?`: (`payload`) => `boolean`; \}

###### abort?

`boolean`

If true, no later checks will be executed if this check fails. Default `false`.

###### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

###### params?

`Record`\<`string`, `any`\>

###### path?

`PropertyKey`[]

###### when?

(`payload`) => `boolean`

If provided, this check will only be executed if the function returns `true`. Defaults to `payload => z.util.isAborted(payload)`.

#### Returns

`Ch` *extends* (`arg`) => `arg is R` ? `ZodObject`\<`Shape`, `Config`\> & [`ZodType`](ZodType-1.md)\<`R`, [`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`, `Config`\[`"in"`\]\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, [`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`, `Config`\[`"in"`\]\>\>\> : `ZodObject`\<`Shape`, `Config`\>

#### Inherited from

[`_ZodType`](ZodType.md).[`refine`](ZodType.md#refine)

***

### register()

> **register**\<`R`\>(`registry`, ...`meta`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:23

#### Type Parameters

##### R

`R` *extends* [`$ZodRegistry`](../namespaces/core/classes/$ZodRegistry.md)\<`MetadataType`, [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>\>

#### Parameters

##### registry

`R`

##### meta

...`ZodObject`\<`Shape`, `Config`\> *extends* `R`\[`"_schema"`\] ? `undefined` *extends* `R`\[`"_meta"`\] ? \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodObject`\<`Shape`, `Config`\>\>?\] : \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodObject`\<`Shape`, `Config`\>\>\] : \[`"Incompatible schema"`\]

#### Returns

`this`

#### Inherited from

[`_ZodType`](ZodType.md).[`register`](ZodType.md#register)

***

### required()

#### Call Signature

> **required**(): `ZodObject`\<\{ \[k in string \| number \| symbol\]: ZodNonOptional\<Shape\[k\]\> \}, `Config`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:461

##### Returns

`ZodObject`\<\{ \[k in string \| number \| symbol\]: ZodNonOptional\<Shape\[k\]\> \}, `Config`\>

#### Call Signature

> **required**\<`M`\>(`mask`): `ZodObject`\<\{ \[k in string \| number \| symbol\]: k extends keyof M ? ZodNonOptional\<Shape\[k\<k\>\]\> : Shape\[k\] \}, `Config`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:464

##### Type Parameters

###### M

`M` *extends* [`Mask`](../namespaces/util/type-aliases/Mask.md)\<keyof `Shape`\>

##### Parameters

###### mask

`M` & `Record`\<`Exclude`\<keyof `M`, keyof `Shape`\>, `never`\>

##### Returns

`ZodObject`\<\{ \[k in string \| number \| symbol\]: k extends keyof M ? ZodNonOptional\<Shape\[k\<k\>\]\> : Shape\[k\] \}, `Config`\>

***

### safeDecode()

> **safeDecode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:35

#### Parameters

##### data

[`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`safeDecode`](ZodType.md#safedecode)

***

### safeDecodeAsync()

> **safeDecodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:37

#### Parameters

##### data

[`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`safeDecodeAsync`](ZodType.md#safedecodeasync)

***

### safeEncode()

> **safeEncode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`, `Config`\[`"in"`\]\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:34

#### Parameters

##### data

[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`, `Config`\[`"in"`\]\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`safeEncode`](ZodType.md#safeencode)

***

### safeEncodeAsync()

> **safeEncodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`, `Config`\[`"in"`\]\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:36

#### Parameters

##### data

[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferObjectInput`](../namespaces/core/type-aliases/$InferObjectInput.md)\<`Shape`, `Config`\[`"in"`\]\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`safeEncodeAsync`](ZodType.md#safeencodeasync)

***

### safeExtend()

> **safeExtend**\<`U`\>(`shape`): `ZodObject`\<\{ \[k in string \| number \| symbol\]: ((keyof Shape & keyof U) extends never ? Shape & U : \{ \[K in string \| number \| symbol as K extends keyof U ? never : K\]: Shape\[K\] \} & \{ \[K in string \| number \| symbol\]: U\[K\] \})\[k\] \}, `Config`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:448

#### Type Parameters

##### U

`U` *extends* [`$ZodLooseShape`](../namespaces/core/type-aliases/$ZodLooseShape.md)

#### Parameters

##### shape

[`SafeExtendShape`](../type-aliases/SafeExtendShape.md)\<`Shape`, `U`\> & `Partial`\<`Record`\<keyof `Shape`, [`SomeType`](../namespaces/core/type-aliases/SomeType.md)\>\>

#### Returns

`ZodObject`\<\{ \[k in string \| number \| symbol\]: ((keyof Shape & keyof U) extends never ? Shape & U : \{ \[K in string \| number \| symbol as K extends keyof U ? never : K\]: Shape\[K\] \} & \{ \[K in string \| number \| symbol\]: U\[K\] \})\[k\] \}, `Config`\>

***

### safeParse()

> **safeParse**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:26

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`safeParse`](ZodType.md#safeparse)

***

### safeParseAsync()

> **safeParseAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:28

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`safeParseAsync`](ZodType.md#safeparseasync)

***

### strict()

> **strict**(): `ZodObject`\<`Shape`, [`$strict`](../namespaces/core/type-aliases/$strict.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:444

Consider `z.strictObject(A.shape)` instead

#### Returns

`ZodObject`\<`Shape`, [`$strict`](../namespaces/core/type-aliases/$strict.md)\>

***

### strip()

> **strip**(): `ZodObject`\<`Shape`, [`$strip`](../namespaces/core/type-aliases/$strip.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:446

This is the default behavior. This method call is likely unnecessary.

#### Returns

`ZodObject`\<`Shape`, [`$strip`](../namespaces/core/type-aliases/$strip.md)\>

***

### superRefine()

> **superRefine**(`refinement`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:39

#### Parameters

##### refinement

(`arg`, `ctx`) => `void` \| `Promise`\<`void`\>

#### Returns

`this`

#### Inherited from

[`_ZodType`](ZodType.md).[`superRefine`](ZodType.md#superrefine)

***

### toJSONSchema()

> **toJSONSchema**(`params?`): [`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodObject`\<`Shape`, `Config`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:17

Converts this schema to a JSON Schema representation.

#### Parameters

##### params?

[`ToJSONSchemaParams`](../namespaces/core/type-aliases/ToJSONSchemaParams.md)

#### Returns

[`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodObject`\<`Shape`, `Config`\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`toJSONSchema`](ZodType.md#tojsonschema)

***

### transform()

> **transform**\<`NewOut`\>(`transform`): [`ZodPipe`](ZodPipe.md)\<`ZodObject`\<`Shape`, `Config`\>, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, [`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:53

#### Type Parameters

##### NewOut

`NewOut`

#### Parameters

##### transform

(`arg`, `ctx`) => `NewOut` \| `Promise`\<`NewOut`\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodObject`\<`Shape`, `Config`\>, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, [`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>\>

#### Inherited from

[`_ZodType`](ZodType.md).[`transform`](ZodType.md#transform)

***

### with()

> **with**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:19

#### Parameters

##### checks

...([`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\> \| [`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<[`$InferObjectOutput`](../namespaces/core/type-aliases/$InferObjectOutput.md)\<`Shape`, `Config`\[`"out"`\]\>\>)[]

#### Returns

`this`

#### Inherited from

[`_ZodType`](ZodType.md).[`with`](ZodType.md#with)
