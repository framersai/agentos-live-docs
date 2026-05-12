# Interface: ZodDiscriminatedUnion\<Options, Disc\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:487

## Extends

- [`ZodUnion`](ZodUnion.md)\<`Options`\>.[`$ZodDiscriminatedUnion`](../namespaces/core/interfaces/$ZodDiscriminatedUnion.md)\<`Options`, `Disc`\>

## Type Parameters

### Options

`Options` *extends* readonly [`SomeType`](../namespaces/core/type-aliases/SomeType.md)[] = readonly [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)[]

### Disc

`Disc` *extends* `string` = `string`

## Properties

### ~~\_def~~

> **\_def**: [`$ZodUnionDef`](../namespaces/core/interfaces/$ZodUnionDef.md)\<`Options`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:10

#### Deprecated

Use `.def` instead.

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`_def`](ZodUnion.md#_def)

***

### ~~\_input~~

> **\_input**: [`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:14

#### Deprecated

Use `z.input<typeof schema>` instead.

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`_input`](ZodUnion.md#_input)

***

### ~~\_output~~

> **\_output**: [`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:12

#### Deprecated

Use `z.output<typeof schema>` instead.

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`_output`](ZodUnion.md#_output)

***

### \_zod

> **\_zod**: [`$ZodDiscriminatedUnionInternals`](../namespaces/core/interfaces/$ZodDiscriminatedUnionInternals.md)\<`Options`, `Disc`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:489

#### Overrides

[`ZodUnion`](ZodUnion.md).[`_zod`](ZodUnion.md#_zod)

***

### ~standard

> **~standard**: [`ZodStandardSchemaWithJSON`](../type-aliases/ZodStandardSchemaWithJSON.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:488

#### Overrides

[`ZodUnion`](ZodUnion.md).[`~standard`](ZodUnion.md#standard)

***

### def

> **def**: [`$ZodDiscriminatedUnionDef`](../namespaces/core/interfaces/$ZodDiscriminatedUnionDef.md)\<`Options`, `Disc`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:490

#### Overrides

[`ZodUnion`](ZodUnion.md).[`def`](ZodUnion.md#def)

***

### description?

> `optional` **description**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:60

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`description`](ZodUnion.md#description)

***

### options

> **options**: `Options`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:474

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`options`](ZodUnion.md#options)

***

### spa()

> **spa**: (`data`, `params?`) => `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:29

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`spa`](ZodUnion.md#spa)

***

### type

> **type**: `"union"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:8

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`type`](ZodUnion.md#type)

## Methods

### and()

> **and**\<`T`\>(`incoming`): [`ZodIntersection`](ZodIntersection.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:52

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### incoming

`T`

#### Returns

[`ZodIntersection`](ZodIntersection.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>, `T`\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`and`](ZodUnion.md#and)

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

[`ZodUnion`](ZodUnion.md).[`apply`](ZodUnion.md#apply)

***

### array()

> **array**(): [`ZodArray`](ZodArray.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:50

#### Returns

[`ZodArray`](ZodArray.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`array`](ZodUnion.md#array)

***

### brand()

> **brand**\<`T`, `Dir`\>(`value?`): `PropertyKey` *extends* `T` ? `ZodDiscriminatedUnion`\<`Options`, `Disc`\> : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>, `T`, `Dir`\>

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

`PropertyKey` *extends* `T` ? `ZodDiscriminatedUnion`\<`Options`, `Disc`\> : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>, `T`, `Dir`\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`brand`](ZodUnion.md#brand)

***

### catch()

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:54

##### Parameters

###### def

[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

##### Inherited from

[`ZodUnion`](ZodUnion.md).[`catch`](ZodUnion.md#catch)

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:55

##### Parameters

###### def

(`ctx`) => [`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

##### Inherited from

[`ZodUnion`](ZodUnion.md).[`catch`](ZodUnion.md#catch)

***

### check()

> **check**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:18

#### Parameters

##### checks

...([`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\> \| [`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>)[]

#### Returns

`this`

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`check`](ZodUnion.md#check)

***

### clone()

> **clone**(`def?`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:20

#### Parameters

##### def?

[`$ZodUnionDef`](../namespaces/core/interfaces/$ZodUnionDef.md)\<`Options`\>

##### params?

###### parent

`boolean`

#### Returns

`this`

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`clone`](ZodUnion.md#clone)

***

### decode()

> **decode**(`data`, `params?`): [`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:31

#### Parameters

##### data

[`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`decode`](ZodUnion.md#decode)

***

### decodeAsync()

> **decodeAsync**(`data`, `params?`): `Promise`\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:33

#### Parameters

##### data

[`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`decodeAsync`](ZodUnion.md#decodeasync)

***

### default()

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:46

##### Parameters

###### def

[`NoUndefined`](../namespaces/util/type-aliases/NoUndefined.md)\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

##### Inherited from

[`ZodUnion`](ZodUnion.md).[`default`](ZodUnion.md#default)

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:47

##### Parameters

###### def

() => [`NoUndefined`](../namespaces/util/type-aliases/NoUndefined.md)\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

##### Inherited from

[`ZodUnion`](ZodUnion.md).[`default`](ZodUnion.md#default)

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

[`ZodUnion`](ZodUnion.md).[`describe`](ZodUnion.md#describe)

***

### encode()

> **encode**(`data`, `params?`): [`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:30

#### Parameters

##### data

[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`encode`](ZodUnion.md#encode)

***

### encodeAsync()

> **encodeAsync**(`data`, `params?`): `Promise`\<[`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:32

#### Parameters

##### data

[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`encodeAsync`](ZodUnion.md#encodeasync)

***

### exactOptional()

> **exactOptional**(): [`ZodExactOptional`](ZodExactOptional.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:42

#### Returns

[`ZodExactOptional`](ZodExactOptional.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`exactOptional`](ZodUnion.md#exactoptional)

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

[`ZodUnion`](ZodUnion.md).[`isNullable`](ZodUnion.md#isnullable)

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

[`ZodUnion`](ZodUnion.md).[`isOptional`](ZodUnion.md#isoptional)

***

### meta()

#### Call Signature

> **meta**(): \{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:62

Returns the metadata associated with this instance in `z.globalRegistry`

##### Returns

\{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

##### Inherited from

[`ZodUnion`](ZodUnion.md).[`meta`](ZodUnion.md#meta)

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

[`ZodUnion`](ZodUnion.md).[`meta`](ZodUnion.md#meta)

***

### nonoptional()

> **nonoptional**(`params?`): [`ZodNonOptional`](ZodNonOptional.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

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

[`ZodNonOptional`](ZodNonOptional.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`nonoptional`](ZodUnion.md#nonoptional)

***

### nullable()

> **nullable**(): [`ZodNullable`](ZodNullable.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:44

#### Returns

[`ZodNullable`](ZodNullable.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`nullable`](ZodUnion.md#nullable)

***

### nullish()

> **nullish**(): [`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:45

#### Returns

[`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`nullish`](ZodUnion.md#nullish)

***

### optional()

> **optional**(): [`ZodOptional`](ZodOptional.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:41

#### Returns

[`ZodOptional`](ZodOptional.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`optional`](ZodUnion.md#optional)

***

### or()

> **or**\<`T`\>(`option`): [`ZodUnion`](ZodUnion.md)\<\[`ZodDiscriminatedUnion`\<`Options`, `Disc`\>, `T`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:51

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### option

`T`

#### Returns

[`ZodUnion`](ZodUnion.md)\<\[`ZodDiscriminatedUnion`\<`Options`, `Disc`\>, `T`\]\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`or`](ZodUnion.md#or)

***

### overwrite()

> **overwrite**(`fn`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:40

#### Parameters

##### fn

(`x`) => [`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>

#### Returns

`this`

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`overwrite`](ZodUnion.md#overwrite)

***

### parse()

> **parse**(`data`, `params?`): [`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:25

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`parse`](ZodUnion.md#parse)

***

### parseAsync()

> **parseAsync**(`data`, `params?`): `Promise`\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:27

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`parseAsync`](ZodUnion.md#parseasync)

***

### pipe()

> **pipe**\<`T`\>(`target`): [`ZodPipe`](ZodPipe.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:56

#### Type Parameters

##### T

`T` *extends* [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, [`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, [`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>\>

#### Parameters

##### target

`T` | [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, [`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, [`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>, `T`\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`pipe`](ZodUnion.md#pipe)

***

### prefault()

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:48

##### Parameters

###### def

() => [`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

##### Inherited from

[`ZodUnion`](ZodUnion.md).[`prefault`](ZodUnion.md#prefault)

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:49

##### Parameters

###### def

[`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

##### Inherited from

[`ZodUnion`](ZodUnion.md).[`prefault`](ZodUnion.md#prefault)

***

### readonly()

> **readonly**(): [`ZodReadonly`](ZodReadonly.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:57

#### Returns

[`ZodReadonly`](ZodReadonly.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`readonly`](ZodUnion.md#readonly)

***

### refine()

> **refine**\<`Ch`\>(`check`, `params?`): `Ch` *extends* (`arg`) => `arg is R` ? `ZodDiscriminatedUnion`\<`Options`, `Disc`\> & [`ZodType`](ZodType-1.md)\<`R`, [`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, [`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>\>\> : `ZodDiscriminatedUnion`\<`Options`, `Disc`\>

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

`Ch` *extends* (`arg`) => `arg is R` ? `ZodDiscriminatedUnion`\<`Options`, `Disc`\> & [`ZodType`](ZodType-1.md)\<`R`, [`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, [`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>\>\> : `ZodDiscriminatedUnion`\<`Options`, `Disc`\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`refine`](ZodUnion.md#refine)

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

...`ZodDiscriminatedUnion`\<`Options`, `Disc`\> *extends* `R`\[`"_schema"`\] ? `undefined` *extends* `R`\[`"_meta"`\] ? \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>?\] : \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>\] : \[`"Incompatible schema"`\]

#### Returns

`this`

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`register`](ZodUnion.md#register)

***

### safeDecode()

> **safeDecode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:35

#### Parameters

##### data

[`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`safeDecode`](ZodUnion.md#safedecode)

***

### safeDecodeAsync()

> **safeDecodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:37

#### Parameters

##### data

[`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`safeDecodeAsync`](ZodUnion.md#safedecodeasync)

***

### safeEncode()

> **safeEncode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:34

#### Parameters

##### data

[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`safeEncode`](ZodUnion.md#safeencode)

***

### safeEncodeAsync()

> **safeEncodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:36

#### Parameters

##### data

[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferUnionInput`](../namespaces/core/type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`safeEncodeAsync`](ZodUnion.md#safeencodeasync)

***

### safeParse()

> **safeParse**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:26

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`safeParse`](ZodUnion.md#safeparse)

***

### safeParseAsync()

> **safeParseAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:28

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`safeParseAsync`](ZodUnion.md#safeparseasync)

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

[`ZodUnion`](ZodUnion.md).[`superRefine`](ZodUnion.md#superrefine)

***

### toJSONSchema()

> **toJSONSchema**(`params?`): [`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:17

Converts this schema to a JSON Schema representation.

#### Parameters

##### params?

[`ToJSONSchemaParams`](../namespaces/core/type-aliases/ToJSONSchemaParams.md)

#### Returns

[`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`toJSONSchema`](ZodUnion.md#tojsonschema)

***

### transform()

> **transform**\<`NewOut`\>(`transform`): [`ZodPipe`](ZodPipe.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, [`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:53

#### Type Parameters

##### NewOut

`NewOut`

#### Parameters

##### transform

(`arg`, `ctx`) => `NewOut` \| `Promise`\<`NewOut`\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodDiscriminatedUnion`\<`Options`, `Disc`\>, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, [`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>\>

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`transform`](ZodUnion.md#transform)

***

### with()

> **with**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:19

#### Parameters

##### checks

...([`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\> \| [`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<[`$InferUnionOutput`](../namespaces/core/type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>\>)[]

#### Returns

`this`

#### Inherited from

[`ZodUnion`](ZodUnion.md).[`with`](ZodUnion.md#with)
