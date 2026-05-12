# Interface: \_ZodType\<Internals\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:84

## Extends

- [`ZodType`](ZodType-1.md)\<`any`, `any`, `Internals`\>

## Extended by

- [`_ZodString`](ZodString.md)
- [`_ZodNumber`](ZodNumber.md)
- [`_ZodBoolean`](ZodBoolean.md)
- [`_ZodBigInt`](ZodBigInt.md)
- [`ZodSymbol`](ZodSymbol.md)
- [`ZodUndefined`](ZodUndefined.md)
- [`ZodNull`](ZodNull.md)
- [`ZodAny`](ZodAny.md)
- [`ZodUnknown`](ZodUnknown.md)
- [`ZodNever`](ZodNever.md)
- [`ZodVoid`](ZodVoid.md)
- [`_ZodDate`](ZodDate.md)
- [`ZodArray`](ZodArray.md)
- [`ZodObject`](ZodObject.md)
- [`ZodUnion`](ZodUnion.md)
- [`ZodXor`](ZodXor.md)
- [`ZodIntersection`](ZodIntersection.md)
- [`ZodTuple`](ZodTuple.md)
- [`ZodRecord`](ZodRecord.md)
- [`ZodMap`](ZodMap.md)
- [`ZodSet`](ZodSet.md)
- [`ZodEnum`](ZodEnum.md)
- [`ZodLiteral`](ZodLiteral.md)
- [`ZodFile`](ZodFile.md)
- [`ZodTransform`](ZodTransform.md)
- [`ZodOptional`](ZodOptional.md)
- [`ZodExactOptional`](ZodExactOptional.md)
- [`ZodNullable`](ZodNullable.md)
- [`ZodDefault`](ZodDefault.md)
- [`ZodPrefault`](ZodPrefault.md)
- [`ZodNonOptional`](ZodNonOptional.md)
- [`ZodSuccess`](ZodSuccess.md)
- [`ZodCatch`](ZodCatch.md)
- [`ZodNaN`](ZodNaN.md)
- [`ZodPipe`](ZodPipe.md)
- [`ZodReadonly`](ZodReadonly.md)
- [`ZodTemplateLiteral`](ZodTemplateLiteral.md)
- [`ZodLazy`](ZodLazy.md)
- [`ZodPromise`](ZodPromise.md)
- [`ZodFunction`](ZodFunction.md)
- [`ZodCustom`](ZodCustom.md)

## Type Parameters

### Internals

`Internals` *extends* [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md) = [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)

## Properties

### ~~\_def~~

> **\_def**: `Internals`\[`"def"`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:10

#### Deprecated

Use `.def` instead.

#### Inherited from

[`ZodType`](ZodType-1.md).[`_def`](ZodType-1.md#_def)

***

### ~~\_input~~

> **\_input**: `Internals`\[`"input"`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:14

#### Deprecated

Use `z.input<typeof schema>` instead.

#### Inherited from

[`ZodType`](ZodType-1.md).[`_input`](ZodType-1.md#_input)

***

### ~~\_output~~

> **\_output**: `Internals`\[`"output"`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:12

#### Deprecated

Use `z.output<typeof schema>` instead.

#### Inherited from

[`ZodType`](ZodType-1.md).[`_output`](ZodType-1.md#_output)

***

### \_zod

> **\_zod**: `Internals`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:93

#### Inherited from

[`ZodType`](ZodType-1.md).[`_zod`](ZodType-1.md#_zod)

***

### ~standard

> **~standard**: [`ZodStandardSchemaWithJSON`](../type-aliases/ZodStandardSchemaWithJSON.md)\<`_ZodType`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:15

#### Inherited from

[`ZodType`](ZodType-1.md).[`~standard`](ZodType-1.md#standard)

***

### def

> **def**: `Internals`\[`"def"`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:7

#### Inherited from

[`ZodType`](ZodType-1.md).[`def`](ZodType-1.md#def)

***

### description?

> `optional` **description**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:60

#### Inherited from

[`ZodType`](ZodType-1.md).[`description`](ZodType-1.md#description)

***

### spa()

> **spa**: (`data`, `params?`) => `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:29

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`spa`](ZodType-1.md#spa)

***

### type

> **type**: `Internals`\[`"def"`\]\[`"type"`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:8

#### Inherited from

[`ZodType`](ZodType-1.md).[`type`](ZodType-1.md#type)

## Methods

### and()

> **and**\<`T`\>(`incoming`): [`ZodIntersection`](ZodIntersection.md)\<`_ZodType`\<`Internals`\>, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:52

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### incoming

`T`

#### Returns

[`ZodIntersection`](ZodIntersection.md)\<`_ZodType`\<`Internals`\>, `T`\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`and`](ZodType-1.md#and)

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

[`ZodType`](ZodType-1.md).[`apply`](ZodType-1.md#apply)

***

### array()

> **array**(): [`ZodArray`](ZodArray.md)\<`_ZodType`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:50

#### Returns

[`ZodArray`](ZodArray.md)\<`_ZodType`\<`Internals`\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`array`](ZodType-1.md#array)

***

### brand()

> **brand**\<`T`, `Dir`\>(`value?`): `PropertyKey` *extends* `T` ? `_ZodType`\<`Internals`\> : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`_ZodType`\<`Internals`\>, `T`, `Dir`\>

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

`PropertyKey` *extends* `T` ? `_ZodType`\<`Internals`\> : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`_ZodType`\<`Internals`\>, `T`, `Dir`\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`brand`](ZodType-1.md#brand)

***

### catch()

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`_ZodType`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:54

##### Parameters

###### def

[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>

##### Returns

[`ZodCatch`](ZodCatch.md)\<`_ZodType`\<`Internals`\>\>

##### Inherited from

[`ZodType`](ZodType-1.md).[`catch`](ZodType-1.md#catch)

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`_ZodType`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:55

##### Parameters

###### def

(`ctx`) => [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>

##### Returns

[`ZodCatch`](ZodCatch.md)\<`_ZodType`\<`Internals`\>\>

##### Inherited from

[`ZodType`](ZodType-1.md).[`catch`](ZodType-1.md#catch)

***

### check()

> **check**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:18

#### Parameters

##### checks

...([`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\> \| [`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>)[]

#### Returns

`this`

#### Inherited from

[`ZodType`](ZodType-1.md).[`check`](ZodType-1.md#check)

***

### clone()

> **clone**(`def?`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:20

#### Parameters

##### def?

`Internals`\[`"def"`\]

##### params?

###### parent

`boolean`

#### Returns

`this`

#### Inherited from

[`ZodType`](ZodType-1.md).[`clone`](ZodType-1.md#clone)

***

### decode()

> **decode**(`data`, `params?`): [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:31

#### Parameters

##### data

[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`decode`](ZodType-1.md#decode)

***

### decodeAsync()

> **decodeAsync**(`data`, `params?`): `Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:33

#### Parameters

##### data

[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`decodeAsync`](ZodType-1.md#decodeasync)

***

### default()

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`_ZodType`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:46

##### Parameters

###### def

[`NoUndefined`](../namespaces/util/type-aliases/NoUndefined.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>

##### Returns

[`ZodDefault`](ZodDefault.md)\<`_ZodType`\<`Internals`\>\>

##### Inherited from

[`ZodType`](ZodType-1.md).[`default`](ZodType-1.md#default)

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`_ZodType`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:47

##### Parameters

###### def

() => [`NoUndefined`](../namespaces/util/type-aliases/NoUndefined.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>

##### Returns

[`ZodDefault`](ZodDefault.md)\<`_ZodType`\<`Internals`\>\>

##### Inherited from

[`ZodType`](ZodType-1.md).[`default`](ZodType-1.md#default)

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

[`ZodType`](ZodType-1.md).[`describe`](ZodType-1.md#describe)

***

### encode()

> **encode**(`data`, `params?`): [`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:30

#### Parameters

##### data

[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`encode`](ZodType-1.md#encode)

***

### encodeAsync()

> **encodeAsync**(`data`, `params?`): `Promise`\<[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:32

#### Parameters

##### data

[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`encodeAsync`](ZodType-1.md#encodeasync)

***

### exactOptional()

> **exactOptional**(): [`ZodExactOptional`](ZodExactOptional.md)\<`_ZodType`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:42

#### Returns

[`ZodExactOptional`](ZodExactOptional.md)\<`_ZodType`\<`Internals`\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`exactOptional`](ZodType-1.md#exactoptional)

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

[`ZodType`](ZodType-1.md).[`isNullable`](ZodType-1.md#isnullable)

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

[`ZodType`](ZodType-1.md).[`isOptional`](ZodType-1.md#isoptional)

***

### meta()

#### Call Signature

> **meta**(): \{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:62

Returns the metadata associated with this instance in `z.globalRegistry`

##### Returns

\{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

##### Inherited from

[`ZodType`](ZodType-1.md).[`meta`](ZodType-1.md#meta)

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

[`ZodType`](ZodType-1.md).[`meta`](ZodType-1.md#meta)

***

### nonoptional()

> **nonoptional**(`params?`): [`ZodNonOptional`](ZodNonOptional.md)\<`_ZodType`\<`Internals`\>\>

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

[`ZodNonOptional`](ZodNonOptional.md)\<`_ZodType`\<`Internals`\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`nonoptional`](ZodType-1.md#nonoptional)

***

### nullable()

> **nullable**(): [`ZodNullable`](ZodNullable.md)\<`_ZodType`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:44

#### Returns

[`ZodNullable`](ZodNullable.md)\<`_ZodType`\<`Internals`\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`nullable`](ZodType-1.md#nullable)

***

### nullish()

> **nullish**(): [`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`_ZodType`\<`Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:45

#### Returns

[`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`_ZodType`\<`Internals`\>\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`nullish`](ZodType-1.md#nullish)

***

### optional()

> **optional**(): [`ZodOptional`](ZodOptional.md)\<`_ZodType`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:41

#### Returns

[`ZodOptional`](ZodOptional.md)\<`_ZodType`\<`Internals`\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`optional`](ZodType-1.md#optional)

***

### or()

> **or**\<`T`\>(`option`): [`ZodUnion`](ZodUnion.md)\<\[`_ZodType`\<`Internals`\>, `T`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:51

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### option

`T`

#### Returns

[`ZodUnion`](ZodUnion.md)\<\[`_ZodType`\<`Internals`\>, `T`\]\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`or`](ZodType-1.md#or)

***

### overwrite()

> **overwrite**(`fn`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:40

#### Parameters

##### fn

(`x`) => [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>

#### Returns

`this`

#### Inherited from

[`ZodType`](ZodType-1.md).[`overwrite`](ZodType-1.md#overwrite)

***

### parse()

> **parse**(`data`, `params?`): [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:25

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`parse`](ZodType-1.md#parse)

***

### parseAsync()

> **parseAsync**(`data`, `params?`): `Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:27

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`parseAsync`](ZodType-1.md#parseasync)

***

### pipe()

> **pipe**\<`T`\>(`target`): [`ZodPipe`](ZodPipe.md)\<`_ZodType`\<`Internals`\>, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:56

#### Type Parameters

##### T

`T` *extends* [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>\>

#### Parameters

##### target

`T` | [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`_ZodType`\<`Internals`\>, `T`\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`pipe`](ZodType-1.md#pipe)

***

### prefault()

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`_ZodType`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:48

##### Parameters

###### def

() => [`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`_ZodType`\<`Internals`\>\>

##### Inherited from

[`ZodType`](ZodType-1.md).[`prefault`](ZodType-1.md#prefault)

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`_ZodType`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:49

##### Parameters

###### def

[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`_ZodType`\<`Internals`\>\>

##### Inherited from

[`ZodType`](ZodType-1.md).[`prefault`](ZodType-1.md#prefault)

***

### readonly()

> **readonly**(): [`ZodReadonly`](ZodReadonly.md)\<`_ZodType`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:57

#### Returns

[`ZodReadonly`](ZodReadonly.md)\<`_ZodType`\<`Internals`\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`readonly`](ZodType-1.md#readonly)

***

### refine()

> **refine**\<`Ch`\>(`check`, `params?`): `Ch` *extends* (`arg`) => `arg is R` ? `_ZodType`\<`Internals`\> & [`ZodType`](ZodType-1.md)\<`R`, [`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, [`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>\>\> : `_ZodType`\<`Internals`\>

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

`Ch` *extends* (`arg`) => `arg is R` ? `_ZodType`\<`Internals`\> & [`ZodType`](ZodType-1.md)\<`R`, [`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, [`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>\>\> : `_ZodType`\<`Internals`\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`refine`](ZodType-1.md#refine)

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

...`_ZodType`\<`Internals`\> *extends* `R`\[`"_schema"`\] ? `undefined` *extends* `R`\[`"_meta"`\] ? \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `_ZodType`\<`Internals`\>\>?\] : \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `_ZodType`\<`Internals`\>\>\] : \[`"Incompatible schema"`\]

#### Returns

`this`

#### Inherited from

[`ZodType`](ZodType-1.md).[`register`](ZodType-1.md#register)

***

### safeDecode()

> **safeDecode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:35

#### Parameters

##### data

[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`safeDecode`](ZodType-1.md#safedecode)

***

### safeDecodeAsync()

> **safeDecodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:37

#### Parameters

##### data

[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`safeDecodeAsync`](ZodType-1.md#safedecodeasync)

***

### safeEncode()

> **safeEncode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:34

#### Parameters

##### data

[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`safeEncode`](ZodType-1.md#safeencode)

***

### safeEncodeAsync()

> **safeEncodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:36

#### Parameters

##### data

[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`input`](../namespaces/core/type-aliases/input.md)\<`_ZodType`\<`Internals`\>\>\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`safeEncodeAsync`](ZodType-1.md#safeencodeasync)

***

### safeParse()

> **safeParse**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:26

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`safeParse`](ZodType-1.md#safeparse)

***

### safeParseAsync()

> **safeParseAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:28

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`safeParseAsync`](ZodType-1.md#safeparseasync)

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

[`ZodType`](ZodType-1.md).[`superRefine`](ZodType-1.md#superrefine)

***

### toJSONSchema()

> **toJSONSchema**(`params?`): [`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`_ZodType`\<`Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:17

Converts this schema to a JSON Schema representation.

#### Parameters

##### params?

[`ToJSONSchemaParams`](../namespaces/core/type-aliases/ToJSONSchemaParams.md)

#### Returns

[`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`_ZodType`\<`Internals`\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`toJSONSchema`](ZodType-1.md#tojsonschema)

***

### transform()

> **transform**\<`NewOut`\>(`transform`): [`ZodPipe`](ZodPipe.md)\<`_ZodType`\<`Internals`\>, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:53

#### Type Parameters

##### NewOut

`NewOut`

#### Parameters

##### transform

(`arg`, `ctx`) => `NewOut` \| `Promise`\<`NewOut`\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`_ZodType`\<`Internals`\>, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, [`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>\>

#### Inherited from

[`ZodType`](ZodType-1.md).[`transform`](ZodType-1.md#transform)

***

### with()

> **with**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:19

#### Parameters

##### checks

...([`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\> \| [`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`_ZodType`\<`Internals`\>\>\>)[]

#### Returns

`this`

#### Inherited from

[`ZodType`](ZodType-1.md).[`with`](ZodType-1.md#with)
