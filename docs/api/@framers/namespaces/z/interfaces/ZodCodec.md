# Interface: ZodCodec\<A, B\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:645

## Extends

- [`ZodPipe`](ZodPipe.md)\<`A`, `B`\>.[`$ZodCodec`](../namespaces/core/interfaces/$ZodCodec.md)\<`A`, `B`\>

## Type Parameters

### A

`A` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md) = [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)

### B

`B` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md) = [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)

## Properties

### ~~\_def~~

> **\_def**: [`$ZodPipeDef`](../namespaces/core/interfaces/$ZodPipeDef.md)\<`A`, `B`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:10

#### Deprecated

Use `.def` instead.

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`_def`](ZodPipe.md#_def)

***

### ~~\_input~~

> **\_input**: [`input`](../namespaces/core/type-aliases/input.md)\<`A`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:14

#### Deprecated

Use `z.input<typeof schema>` instead.

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`_input`](ZodPipe.md#_input)

***

### ~~\_output~~

> **\_output**: [`output`](../namespaces/core/type-aliases/output.md)\<`B`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:12

#### Deprecated

Use `z.output<typeof schema>` instead.

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`_output`](ZodPipe.md#_output)

***

### \_zod

> **\_zod**: [`$ZodCodecInternals`](../namespaces/core/interfaces/$ZodCodecInternals.md)\<`A`, `B`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:647

#### Overrides

[`ZodPipe`](ZodPipe.md).[`_zod`](ZodPipe.md#_zod)

***

### ~standard

> **~standard**: [`ZodStandardSchemaWithJSON`](../type-aliases/ZodStandardSchemaWithJSON.md)\<`ZodCodec`\<`A`, `B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:646

#### Overrides

[`ZodPipe`](ZodPipe.md).[`~standard`](ZodPipe.md#standard)

***

### def

> **def**: [`$ZodCodecDef`](../namespaces/core/interfaces/$ZodCodecDef.md)\<`A`, `B`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:648

#### Overrides

[`ZodPipe`](ZodPipe.md).[`def`](ZodPipe.md#def)

***

### description?

> `optional` **description**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:60

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`description`](ZodPipe.md#description)

***

### in

> **in**: `A`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:640

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`in`](ZodPipe.md#in)

***

### out

> **out**: `B`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:641

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`out`](ZodPipe.md#out)

***

### spa()

> **spa**: (`data`, `params?`) => `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:29

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`spa`](ZodPipe.md#spa)

***

### type

> **type**: `"pipe"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:8

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`type`](ZodPipe.md#type)

## Methods

### and()

> **and**\<`T`\>(`incoming`): [`ZodIntersection`](ZodIntersection.md)\<`ZodCodec`\<`A`, `B`\>, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:52

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### incoming

`T`

#### Returns

[`ZodIntersection`](ZodIntersection.md)\<`ZodCodec`\<`A`, `B`\>, `T`\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`and`](ZodPipe.md#and)

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

[`ZodPipe`](ZodPipe.md).[`apply`](ZodPipe.md#apply)

***

### array()

> **array**(): [`ZodArray`](ZodArray.md)\<`ZodCodec`\<`A`, `B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:50

#### Returns

[`ZodArray`](ZodArray.md)\<`ZodCodec`\<`A`, `B`\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`array`](ZodPipe.md#array)

***

### brand()

> **brand**\<`T`, `Dir`\>(`value?`): `PropertyKey` *extends* `T` ? `ZodCodec`\<`A`, `B`\> : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodCodec`\<`A`, `B`\>, `T`, `Dir`\>

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

`PropertyKey` *extends* `T` ? `ZodCodec`\<`A`, `B`\> : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodCodec`\<`A`, `B`\>, `T`, `Dir`\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`brand`](ZodPipe.md#brand)

***

### catch()

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodCodec`\<`A`, `B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:54

##### Parameters

###### def

[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodCodec`\<`A`, `B`\>\>

##### Inherited from

[`ZodPipe`](ZodPipe.md).[`catch`](ZodPipe.md#catch)

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodCodec`\<`A`, `B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:55

##### Parameters

###### def

(`ctx`) => [`output`](../namespaces/core/type-aliases/output.md)\<`B`\>

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodCodec`\<`A`, `B`\>\>

##### Inherited from

[`ZodPipe`](ZodPipe.md).[`catch`](ZodPipe.md#catch)

***

### check()

> **check**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:18

#### Parameters

##### checks

...([`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\> \| [`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>)[]

#### Returns

`this`

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`check`](ZodPipe.md#check)

***

### clone()

> **clone**(`def?`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:20

#### Parameters

##### def?

[`$ZodPipeDef`](../namespaces/core/interfaces/$ZodPipeDef.md)\<`A`, `B`\>

##### params?

###### parent

`boolean`

#### Returns

`this`

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`clone`](ZodPipe.md#clone)

***

### decode()

> **decode**(`data`, `params?`): [`output`](../namespaces/core/type-aliases/output.md)\<`B`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:31

#### Parameters

##### data

[`input`](../namespaces/core/type-aliases/input.md)\<`A`\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`decode`](ZodPipe.md#decode)

***

### decodeAsync()

> **decodeAsync**(`data`, `params?`): `Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:33

#### Parameters

##### data

[`input`](../namespaces/core/type-aliases/input.md)\<`A`\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`decodeAsync`](ZodPipe.md#decodeasync)

***

### default()

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodCodec`\<`A`, `B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:46

##### Parameters

###### def

[`NoUndefined`](../namespaces/util/type-aliases/NoUndefined.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodCodec`\<`A`, `B`\>\>

##### Inherited from

[`ZodPipe`](ZodPipe.md).[`default`](ZodPipe.md#default)

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodCodec`\<`A`, `B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:47

##### Parameters

###### def

() => [`NoUndefined`](../namespaces/util/type-aliases/NoUndefined.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodCodec`\<`A`, `B`\>\>

##### Inherited from

[`ZodPipe`](ZodPipe.md).[`default`](ZodPipe.md#default)

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

[`ZodPipe`](ZodPipe.md).[`describe`](ZodPipe.md#describe)

***

### encode()

> **encode**(`data`, `params?`): [`input`](../namespaces/core/type-aliases/input.md)\<`A`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:30

#### Parameters

##### data

[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`input`](../namespaces/core/type-aliases/input.md)\<`A`\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`encode`](ZodPipe.md#encode)

***

### encodeAsync()

> **encodeAsync**(`data`, `params?`): `Promise`\<[`input`](../namespaces/core/type-aliases/input.md)\<`A`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:32

#### Parameters

##### data

[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`input`](../namespaces/core/type-aliases/input.md)\<`A`\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`encodeAsync`](ZodPipe.md#encodeasync)

***

### exactOptional()

> **exactOptional**(): [`ZodExactOptional`](ZodExactOptional.md)\<`ZodCodec`\<`A`, `B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:42

#### Returns

[`ZodExactOptional`](ZodExactOptional.md)\<`ZodCodec`\<`A`, `B`\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`exactOptional`](ZodPipe.md#exactoptional)

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

[`ZodPipe`](ZodPipe.md).[`isNullable`](ZodPipe.md#isnullable)

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

[`ZodPipe`](ZodPipe.md).[`isOptional`](ZodPipe.md#isoptional)

***

### meta()

#### Call Signature

> **meta**(): \{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:62

Returns the metadata associated with this instance in `z.globalRegistry`

##### Returns

\{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

##### Inherited from

[`ZodPipe`](ZodPipe.md).[`meta`](ZodPipe.md#meta)

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

[`ZodPipe`](ZodPipe.md).[`meta`](ZodPipe.md#meta)

***

### nonoptional()

> **nonoptional**(`params?`): [`ZodNonOptional`](ZodNonOptional.md)\<`ZodCodec`\<`A`, `B`\>\>

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

[`ZodNonOptional`](ZodNonOptional.md)\<`ZodCodec`\<`A`, `B`\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`nonoptional`](ZodPipe.md#nonoptional)

***

### nullable()

> **nullable**(): [`ZodNullable`](ZodNullable.md)\<`ZodCodec`\<`A`, `B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:44

#### Returns

[`ZodNullable`](ZodNullable.md)\<`ZodCodec`\<`A`, `B`\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`nullable`](ZodPipe.md#nullable)

***

### nullish()

> **nullish**(): [`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodCodec`\<`A`, `B`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:45

#### Returns

[`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodCodec`\<`A`, `B`\>\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`nullish`](ZodPipe.md#nullish)

***

### optional()

> **optional**(): [`ZodOptional`](ZodOptional.md)\<`ZodCodec`\<`A`, `B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:41

#### Returns

[`ZodOptional`](ZodOptional.md)\<`ZodCodec`\<`A`, `B`\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`optional`](ZodPipe.md#optional)

***

### or()

> **or**\<`T`\>(`option`): [`ZodUnion`](ZodUnion.md)\<\[`ZodCodec`\<`A`, `B`\>, `T`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:51

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### option

`T`

#### Returns

[`ZodUnion`](ZodUnion.md)\<\[`ZodCodec`\<`A`, `B`\>, `T`\]\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`or`](ZodPipe.md#or)

***

### overwrite()

> **overwrite**(`fn`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:40

#### Parameters

##### fn

(`x`) => [`output`](../namespaces/core/type-aliases/output.md)\<`B`\>

#### Returns

`this`

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`overwrite`](ZodPipe.md#overwrite)

***

### parse()

> **parse**(`data`, `params?`): [`output`](../namespaces/core/type-aliases/output.md)\<`B`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:25

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`parse`](ZodPipe.md#parse)

***

### parseAsync()

> **parseAsync**(`data`, `params?`): `Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:27

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`parseAsync`](ZodPipe.md#parseasync)

***

### pipe()

> **pipe**\<`T`\>(`target`): [`ZodPipe`](ZodPipe.md)\<`ZodCodec`\<`A`, `B`\>, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:56

#### Type Parameters

##### T

`T` *extends* [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, [`output`](../namespaces/core/type-aliases/output.md)\<`B`\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, [`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>\>

#### Parameters

##### target

`T` | [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, [`output`](../namespaces/core/type-aliases/output.md)\<`B`\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, [`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodCodec`\<`A`, `B`\>, `T`\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`pipe`](ZodPipe.md#pipe)

***

### prefault()

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodCodec`\<`A`, `B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:48

##### Parameters

###### def

() => [`input`](../namespaces/core/type-aliases/input.md)\<`A`\>

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodCodec`\<`A`, `B`\>\>

##### Inherited from

[`ZodPipe`](ZodPipe.md).[`prefault`](ZodPipe.md#prefault)

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodCodec`\<`A`, `B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:49

##### Parameters

###### def

[`input`](../namespaces/core/type-aliases/input.md)\<`A`\>

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodCodec`\<`A`, `B`\>\>

##### Inherited from

[`ZodPipe`](ZodPipe.md).[`prefault`](ZodPipe.md#prefault)

***

### readonly()

> **readonly**(): [`ZodReadonly`](ZodReadonly.md)\<`ZodCodec`\<`A`, `B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:57

#### Returns

[`ZodReadonly`](ZodReadonly.md)\<`ZodCodec`\<`A`, `B`\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`readonly`](ZodPipe.md#readonly)

***

### refine()

> **refine**\<`Ch`\>(`check`, `params?`): `Ch` *extends* (`arg`) => `arg is R` ? `ZodCodec`\<`A`, `B`\> & [`ZodType`](ZodType-1.md)\<`R`, [`input`](../namespaces/core/type-aliases/input.md)\<`A`\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, [`input`](../namespaces/core/type-aliases/input.md)\<`A`\>\>\> : `ZodCodec`\<`A`, `B`\>

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

`Ch` *extends* (`arg`) => `arg is R` ? `ZodCodec`\<`A`, `B`\> & [`ZodType`](ZodType-1.md)\<`R`, [`input`](../namespaces/core/type-aliases/input.md)\<`A`\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, [`input`](../namespaces/core/type-aliases/input.md)\<`A`\>\>\> : `ZodCodec`\<`A`, `B`\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`refine`](ZodPipe.md#refine)

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

...`ZodCodec`\<`A`, `B`\> *extends* `R`\[`"_schema"`\] ? `undefined` *extends* `R`\[`"_meta"`\] ? \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodCodec`\<`A`, `B`\>\>?\] : \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodCodec`\<`A`, `B`\>\>\] : \[`"Incompatible schema"`\]

#### Returns

`this`

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`register`](ZodPipe.md#register)

***

### safeDecode()

> **safeDecode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:35

#### Parameters

##### data

[`input`](../namespaces/core/type-aliases/input.md)\<`A`\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`safeDecode`](ZodPipe.md#safedecode)

***

### safeDecodeAsync()

> **safeDecodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:37

#### Parameters

##### data

[`input`](../namespaces/core/type-aliases/input.md)\<`A`\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`safeDecodeAsync`](ZodPipe.md#safedecodeasync)

***

### safeEncode()

> **safeEncode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`input`](../namespaces/core/type-aliases/input.md)\<`A`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:34

#### Parameters

##### data

[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`input`](../namespaces/core/type-aliases/input.md)\<`A`\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`safeEncode`](ZodPipe.md#safeencode)

***

### safeEncodeAsync()

> **safeEncodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`input`](../namespaces/core/type-aliases/input.md)\<`A`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:36

#### Parameters

##### data

[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`input`](../namespaces/core/type-aliases/input.md)\<`A`\>\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`safeEncodeAsync`](ZodPipe.md#safeencodeasync)

***

### safeParse()

> **safeParse**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:26

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`safeParse`](ZodPipe.md#safeparse)

***

### safeParseAsync()

> **safeParseAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:28

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`safeParseAsync`](ZodPipe.md#safeparseasync)

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

[`ZodPipe`](ZodPipe.md).[`superRefine`](ZodPipe.md#superrefine)

***

### toJSONSchema()

> **toJSONSchema**(`params?`): [`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodCodec`\<`A`, `B`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:17

Converts this schema to a JSON Schema representation.

#### Parameters

##### params?

[`ToJSONSchemaParams`](../namespaces/core/type-aliases/ToJSONSchemaParams.md)

#### Returns

[`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodCodec`\<`A`, `B`\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`toJSONSchema`](ZodPipe.md#tojsonschema)

***

### transform()

> **transform**\<`NewOut`\>(`transform`): [`ZodPipe`](ZodPipe.md)\<`ZodCodec`\<`A`, `B`\>, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, [`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:53

#### Type Parameters

##### NewOut

`NewOut`

#### Parameters

##### transform

(`arg`, `ctx`) => `NewOut` \| `Promise`\<`NewOut`\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodCodec`\<`A`, `B`\>, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, [`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>\>

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`transform`](ZodPipe.md#transform)

***

### with()

> **with**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:19

#### Parameters

##### checks

...([`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\> \| [`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`B`\>\>)[]

#### Returns

`this`

#### Inherited from

[`ZodPipe`](ZodPipe.md).[`with`](ZodPipe.md#with)
