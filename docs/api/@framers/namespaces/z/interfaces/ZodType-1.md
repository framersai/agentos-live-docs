# Interface: ZodType\<Output, Input, Internals\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:6

## Extends

- [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`Output`, `Input`, `Internals`\>

## Extended by

- [`_ZodType`](ZodType.md)

## Type Parameters

### Output

`Output` = `unknown`

### Input

`Input` = `unknown`

### Internals

`Internals` *extends* [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`Output`, `Input`\> = [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`Output`, `Input`\>

## Properties

### ~~\_def~~

> **\_def**: `Internals`\[`"def"`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:10

#### Deprecated

Use `.def` instead.

***

### ~~\_input~~

> **\_input**: `Internals`\[`"input"`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:14

#### Deprecated

Use `z.input<typeof schema>` instead.

***

### ~~\_output~~

> **\_output**: `Internals`\[`"output"`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:12

#### Deprecated

Use `z.output<typeof schema>` instead.

***

### \_zod

> **\_zod**: `Internals`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:93

#### Inherited from

[`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md).[`_zod`](../namespaces/core/interfaces/$ZodType-1.md#_zod)

***

### ~standard

> **~standard**: [`ZodStandardSchemaWithJSON`](../type-aliases/ZodStandardSchemaWithJSON.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:15

#### Overrides

[`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md).[`~standard`](../namespaces/core/interfaces/$ZodType-1.md#standard)

***

### def

> **def**: `Internals`\[`"def"`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:7

***

### description?

> `optional` **description**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:60

***

### spa()

> **spa**: (`data`, `params?`) => `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:29

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>\>

***

### type

> **type**: `Internals`\[`"def"`\]\[`"type"`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:8

## Methods

### and()

> **and**\<`T`\>(`incoming`): [`ZodIntersection`](ZodIntersection.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:52

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### incoming

`T`

#### Returns

[`ZodIntersection`](ZodIntersection.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>, `T`\>

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

***

### array()

> **array**(): [`ZodArray`](ZodArray.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:50

#### Returns

[`ZodArray`](ZodArray.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

***

### brand()

> **brand**\<`T`, `Dir`\>(`value?`): `PropertyKey` *extends* `T` ? `ZodType`\<`Output`, `Input`, `Internals`\> : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>, `T`, `Dir`\>

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

`PropertyKey` *extends* `T` ? `ZodType`\<`Output`, `Input`, `Internals`\> : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>, `T`, `Dir`\>

***

### catch()

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:54

##### Parameters

###### def

[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:55

##### Parameters

###### def

(`ctx`) => [`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

***

### check()

> **check**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:18

#### Parameters

##### checks

...([`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\> \| [`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>)[]

#### Returns

`this`

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

***

### decode()

> **decode**(`data`, `params?`): [`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:31

#### Parameters

##### data

[`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

***

### decodeAsync()

> **decodeAsync**(`data`, `params?`): `Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:33

#### Parameters

##### data

[`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>

***

### default()

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:46

##### Parameters

###### def

[`NoUndefined`](../namespaces/util/type-aliases/NoUndefined.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:47

##### Parameters

###### def

() => [`NoUndefined`](../namespaces/util/type-aliases/NoUndefined.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

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

***

### encode()

> **encode**(`data`, `params?`): [`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:30

#### Parameters

##### data

[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

***

### encodeAsync()

> **encodeAsync**(`data`, `params?`): `Promise`\<[`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:32

#### Parameters

##### data

[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>

***

### exactOptional()

> **exactOptional**(): [`ZodExactOptional`](ZodExactOptional.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:42

#### Returns

[`ZodExactOptional`](ZodExactOptional.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

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

***

### meta()

#### Call Signature

> **meta**(): \{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:62

Returns the metadata associated with this instance in `z.globalRegistry`

##### Returns

\{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

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

***

### nonoptional()

> **nonoptional**(`params?`): [`ZodNonOptional`](ZodNonOptional.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

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

[`ZodNonOptional`](ZodNonOptional.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

***

### nullable()

> **nullable**(): [`ZodNullable`](ZodNullable.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:44

#### Returns

[`ZodNullable`](ZodNullable.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

***

### nullish()

> **nullish**(): [`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:45

#### Returns

[`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>

***

### optional()

> **optional**(): [`ZodOptional`](ZodOptional.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:41

#### Returns

[`ZodOptional`](ZodOptional.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

***

### or()

> **or**\<`T`\>(`option`): [`ZodUnion`](ZodUnion.md)\<\[`ZodType`\<`Output`, `Input`, `Internals`\>, `T`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:51

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### option

`T`

#### Returns

[`ZodUnion`](ZodUnion.md)\<\[`ZodType`\<`Output`, `Input`, `Internals`\>, `T`\]\>

***

### overwrite()

> **overwrite**(`fn`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:40

#### Parameters

##### fn

(`x`) => [`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

#### Returns

`this`

***

### parse()

> **parse**(`data`, `params?`): [`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:25

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

***

### parseAsync()

> **parseAsync**(`data`, `params?`): `Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:27

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>

***

### pipe()

> **pipe**\<`T`\>(`target`): [`ZodPipe`](ZodPipe.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:56

#### Type Parameters

##### T

`T` *extends* [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, [`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, [`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>\>

#### Parameters

##### target

`T` | [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, [`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, [`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>, `T`\>

***

### prefault()

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:48

##### Parameters

###### def

() => [`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:49

##### Parameters

###### def

[`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

***

### readonly()

> **readonly**(): [`ZodReadonly`](ZodReadonly.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:57

#### Returns

[`ZodReadonly`](ZodReadonly.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

***

### refine()

> **refine**\<`Ch`\>(`check`, `params?`): `Ch` *extends* (`arg`) => `arg is R` ? `ZodType`\<`Output`, `Input`, `Internals`\> & `ZodType`\<`R`, [`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, [`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>\> : `ZodType`\<`Output`, `Input`, `Internals`\>

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

`Ch` *extends* (`arg`) => `arg is R` ? `ZodType`\<`Output`, `Input`, `Internals`\> & `ZodType`\<`R`, [`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>, [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, [`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>\> : `ZodType`\<`Output`, `Input`, `Internals`\>

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

...`ZodType`\<`Output`, `Input`, `Internals`\> *extends* `R`\[`"_schema"`\] ? `undefined` *extends* `R`\[`"_meta"`\] ? \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodType`\<`Output`, `Input`, `Internals`\>\>?\] : \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodType`\<`Output`, `Input`, `Internals`\>\>\] : \[`"Incompatible schema"`\]

#### Returns

`this`

***

### safeDecode()

> **safeDecode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:35

#### Parameters

##### data

[`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>

***

### safeDecodeAsync()

> **safeDecodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:37

#### Parameters

##### data

[`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>\>

***

### safeEncode()

> **safeEncode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:34

#### Parameters

##### data

[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>

***

### safeEncodeAsync()

> **safeEncodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:36

#### Parameters

##### data

[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`input`](../namespaces/core/type-aliases/input.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>\>

***

### safeParse()

> **safeParse**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:26

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>

***

### safeParseAsync()

> **safeParseAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:28

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>\>

***

### superRefine()

> **superRefine**(`refinement`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:39

#### Parameters

##### refinement

(`arg`, `ctx`) => `void` \| `Promise`\<`void`\>

#### Returns

`this`

***

### toJSONSchema()

> **toJSONSchema**(`params?`): [`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:17

Converts this schema to a JSON Schema representation.

#### Parameters

##### params?

[`ToJSONSchemaParams`](../namespaces/core/type-aliases/ToJSONSchemaParams.md)

#### Returns

[`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>

***

### transform()

> **transform**\<`NewOut`\>(`transform`): [`ZodPipe`](ZodPipe.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, [`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:53

#### Type Parameters

##### NewOut

`NewOut`

#### Parameters

##### transform

(`arg`, `ctx`) => `NewOut` \| `Promise`\<`NewOut`\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, [`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>\>

***

### with()

> **with**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:19

#### Parameters

##### checks

...([`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\> \| [`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<[`output`](../namespaces/core/type-aliases/output.md)\<`ZodType`\<`Output`, `Input`, `Internals`\>\>\>)[]

#### Returns

`this`
