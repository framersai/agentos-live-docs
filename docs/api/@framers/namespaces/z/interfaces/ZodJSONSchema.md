# Interface: ZodJSONSchema

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:735

## Extends

- `_ZodJSONSchema`

## Properties

### ~~\_def~~

> **\_def**: [`$ZodUnionDef`](../namespaces/core/interfaces/$ZodUnionDef.md)\<\[[`ZodString`](ZodString-1.md), [`ZodNumber`](ZodNumber-1.md), [`ZodBoolean`](ZodBoolean-1.md), [`ZodNull`](ZodNull.md), [`ZodArray`](ZodArray.md)\<`ZodJSONSchema`\>, [`ZodRecord`](ZodRecord.md)\<[`ZodString`](ZodString-1.md), `ZodJSONSchema`\>\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:10

#### Deprecated

Use `.def` instead.

#### Inherited from

`_ZodJSONSchema._def`

***

### ~~\_input~~

> **\_input**: `string` \| `number` \| `boolean` \| `Record`\<`string`, [`JSONType`](../namespaces/util/type-aliases/JSONType.md)\> \| [`JSONType`](../namespaces/util/type-aliases/JSONType.md)[] \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:14

#### Deprecated

Use `z.input<typeof schema>` instead.

#### Inherited from

`_ZodJSONSchema._input`

***

### ~~\_output~~

> **\_output**: `string` \| `number` \| `boolean` \| `Record`\<`string`, [`JSONType`](../namespaces/util/type-aliases/JSONType.md)\> \| [`JSONType`](../namespaces/util/type-aliases/JSONType.md)[] \| `null`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:12

#### Deprecated

Use `z.output<typeof schema>` instead.

#### Inherited from

`_ZodJSONSchema._output`

***

### \_zod

> **\_zod**: [`ZodJSONSchemaInternals`](ZodJSONSchemaInternals.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:736

#### Overrides

`_ZodJSONSchema._zod`

***

### ~standard

> **~standard**: [`ZodStandardSchemaWithJSON`](../type-aliases/ZodStandardSchemaWithJSON.md)\<`ZodJSONSchema`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:473

#### Inherited from

`_ZodJSONSchema.~standard`

***

### def

> **def**: [`$ZodUnionDef`](../namespaces/core/interfaces/$ZodUnionDef.md)\<\[[`ZodString`](ZodString-1.md), [`ZodNumber`](ZodNumber-1.md), [`ZodBoolean`](ZodBoolean-1.md), [`ZodNull`](ZodNull.md), [`ZodArray`](ZodArray.md)\<`ZodJSONSchema`\>, [`ZodRecord`](ZodRecord.md)\<[`ZodString`](ZodString-1.md), `ZodJSONSchema`\>\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:7

#### Inherited from

`_ZodJSONSchema.def`

***

### description?

> `optional` **description**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:60

#### Inherited from

`_ZodJSONSchema.description`

***

### options

> **options**: \[[`ZodString`](ZodString-1.md), [`ZodNumber`](ZodNumber-1.md), [`ZodBoolean`](ZodBoolean-1.md), [`ZodNull`](ZodNull.md), [`ZodArray`](ZodArray.md)\<`ZodJSONSchema`\>, [`ZodRecord`](ZodRecord.md)\<[`ZodString`](ZodString-1.md), `ZodJSONSchema`\>\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:474

#### Inherited from

`_ZodJSONSchema.options`

***

### spa()

> **spa**: (`data`, `params?`) => `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:29

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>\>

#### Inherited from

`_ZodJSONSchema.spa`

***

### type

> **type**: `"union"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:8

#### Inherited from

`_ZodJSONSchema.type`

## Methods

### and()

> **and**\<`T`\>(`incoming`): [`ZodIntersection`](ZodIntersection.md)\<`ZodJSONSchema`, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:52

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### incoming

`T`

#### Returns

[`ZodIntersection`](ZodIntersection.md)\<`ZodJSONSchema`, `T`\>

#### Inherited from

`_ZodJSONSchema.and`

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

`_ZodJSONSchema.apply`

***

### array()

> **array**(): [`ZodArray`](ZodArray.md)\<`ZodJSONSchema`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:50

#### Returns

[`ZodArray`](ZodArray.md)\<`ZodJSONSchema`\>

#### Inherited from

`_ZodJSONSchema.array`

***

### brand()

> **brand**\<`T`, `Dir`\>(`value?`): `PropertyKey` *extends* `T` ? `ZodJSONSchema` : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodJSONSchema`, `T`, `Dir`\>

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

`PropertyKey` *extends* `T` ? `ZodJSONSchema` : [`$ZodBranded`](../namespaces/core/type-aliases/$ZodBranded.md)\<`ZodJSONSchema`, `T`, `Dir`\>

#### Inherited from

`_ZodJSONSchema.brand`

***

### catch()

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodJSONSchema`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:54

##### Parameters

###### def

[`JSONType`](../namespaces/util/type-aliases/JSONType.md)

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodJSONSchema`\>

##### Inherited from

`_ZodJSONSchema.catch`

#### Call Signature

> **catch**(`def`): [`ZodCatch`](ZodCatch.md)\<`ZodJSONSchema`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:55

##### Parameters

###### def

(`ctx`) => [`JSONType`](../namespaces/util/type-aliases/JSONType.md)

##### Returns

[`ZodCatch`](ZodCatch.md)\<`ZodJSONSchema`\>

##### Inherited from

`_ZodJSONSchema.catch`

***

### check()

> **check**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:18

#### Parameters

##### checks

...([`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\> \| [`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>)[]

#### Returns

`this`

#### Inherited from

`_ZodJSONSchema.check`

***

### clone()

> **clone**(`def?`, `params?`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:20

#### Parameters

##### def?

[`$ZodUnionDef`](../namespaces/core/interfaces/$ZodUnionDef.md)\<\[[`ZodString`](ZodString-1.md), [`ZodNumber`](ZodNumber-1.md), [`ZodBoolean`](ZodBoolean-1.md), [`ZodNull`](ZodNull.md), [`ZodArray`](ZodArray.md)\<`ZodJSONSchema`\>, [`ZodRecord`](ZodRecord.md)\<[`ZodString`](ZodString-1.md), `ZodJSONSchema`\>\]\>

##### params?

###### parent

`boolean`

#### Returns

`this`

#### Inherited from

`_ZodJSONSchema.clone`

***

### decode()

> **decode**(`data`, `params?`): [`JSONType`](../namespaces/util/type-aliases/JSONType.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:31

#### Parameters

##### data

[`JSONType`](../namespaces/util/type-aliases/JSONType.md)

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`JSONType`](../namespaces/util/type-aliases/JSONType.md)

#### Inherited from

`_ZodJSONSchema.decode`

***

### decodeAsync()

> **decodeAsync**(`data`, `params?`): `Promise`\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:33

#### Parameters

##### data

[`JSONType`](../namespaces/util/type-aliases/JSONType.md)

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>

#### Inherited from

`_ZodJSONSchema.decodeAsync`

***

### default()

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodJSONSchema`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:46

##### Parameters

###### def

[`JSONType`](../namespaces/util/type-aliases/JSONType.md)

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodJSONSchema`\>

##### Inherited from

`_ZodJSONSchema.default`

#### Call Signature

> **default**(`def`): [`ZodDefault`](ZodDefault.md)\<`ZodJSONSchema`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:47

##### Parameters

###### def

() => [`JSONType`](../namespaces/util/type-aliases/JSONType.md)

##### Returns

[`ZodDefault`](ZodDefault.md)\<`ZodJSONSchema`\>

##### Inherited from

`_ZodJSONSchema.default`

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

`_ZodJSONSchema.describe`

***

### encode()

> **encode**(`data`, `params?`): [`JSONType`](../namespaces/util/type-aliases/JSONType.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:30

#### Parameters

##### data

[`JSONType`](../namespaces/util/type-aliases/JSONType.md)

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`JSONType`](../namespaces/util/type-aliases/JSONType.md)

#### Inherited from

`_ZodJSONSchema.encode`

***

### encodeAsync()

> **encodeAsync**(`data`, `params?`): `Promise`\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:32

#### Parameters

##### data

[`JSONType`](../namespaces/util/type-aliases/JSONType.md)

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>

#### Inherited from

`_ZodJSONSchema.encodeAsync`

***

### exactOptional()

> **exactOptional**(): [`ZodExactOptional`](ZodExactOptional.md)\<`ZodJSONSchema`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:42

#### Returns

[`ZodExactOptional`](ZodExactOptional.md)\<`ZodJSONSchema`\>

#### Inherited from

`_ZodJSONSchema.exactOptional`

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

`_ZodJSONSchema.isNullable`

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

`_ZodJSONSchema.isOptional`

***

### meta()

#### Call Signature

> **meta**(): \{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:62

Returns the metadata associated with this instance in `z.globalRegistry`

##### Returns

\{\[`key`: `string`\]: `unknown`; `deprecated?`: `boolean`; `description?`: `string`; `id?`: `string`; `title?`: `string`; \} \| `undefined`

##### Inherited from

`_ZodJSONSchema.meta`

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

`_ZodJSONSchema.meta`

***

### nonoptional()

> **nonoptional**(`params?`): [`ZodNonOptional`](ZodNonOptional.md)\<`ZodJSONSchema`\>

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

[`ZodNonOptional`](ZodNonOptional.md)\<`ZodJSONSchema`\>

#### Inherited from

`_ZodJSONSchema.nonoptional`

***

### nullable()

> **nullable**(): [`ZodNullable`](ZodNullable.md)\<`ZodJSONSchema`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:44

#### Returns

[`ZodNullable`](ZodNullable.md)\<`ZodJSONSchema`\>

#### Inherited from

`_ZodJSONSchema.nullable`

***

### nullish()

> **nullish**(): [`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodJSONSchema`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:45

#### Returns

[`ZodOptional`](ZodOptional.md)\<[`ZodNullable`](ZodNullable.md)\<`ZodJSONSchema`\>\>

#### Inherited from

`_ZodJSONSchema.nullish`

***

### optional()

> **optional**(): [`ZodOptional`](ZodOptional.md)\<`ZodJSONSchema`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:41

#### Returns

[`ZodOptional`](ZodOptional.md)\<`ZodJSONSchema`\>

#### Inherited from

`_ZodJSONSchema.optional`

***

### or()

> **or**\<`T`\>(`option`): [`ZodUnion`](ZodUnion.md)\<\[`ZodJSONSchema`, `T`\]\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:51

#### Type Parameters

##### T

`T` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

#### Parameters

##### option

`T`

#### Returns

[`ZodUnion`](ZodUnion.md)\<\[`ZodJSONSchema`, `T`\]\>

#### Inherited from

`_ZodJSONSchema.or`

***

### overwrite()

> **overwrite**(`fn`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:40

#### Parameters

##### fn

(`x`) => [`JSONType`](../namespaces/util/type-aliases/JSONType.md)

#### Returns

`this`

#### Inherited from

`_ZodJSONSchema.overwrite`

***

### parse()

> **parse**(`data`, `params?`): [`JSONType`](../namespaces/util/type-aliases/JSONType.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:25

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`JSONType`](../namespaces/util/type-aliases/JSONType.md)

#### Inherited from

`_ZodJSONSchema.parse`

***

### parseAsync()

> **parseAsync**(`data`, `params?`): `Promise`\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:27

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>

#### Inherited from

`_ZodJSONSchema.parseAsync`

***

### pipe()

> **pipe**\<`T`\>(`target`): [`ZodPipe`](ZodPipe.md)\<`ZodJSONSchema`, `T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:56

#### Type Parameters

##### T

`T` *extends* [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, [`JSONType`](../namespaces/util/type-aliases/JSONType.md), [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, [`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>\>

#### Parameters

##### target

`T` | [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`any`, [`JSONType`](../namespaces/util/type-aliases/JSONType.md), [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`any`, [`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodJSONSchema`, `T`\>

#### Inherited from

`_ZodJSONSchema.pipe`

***

### prefault()

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodJSONSchema`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:48

##### Parameters

###### def

() => [`JSONType`](../namespaces/util/type-aliases/JSONType.md)

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodJSONSchema`\>

##### Inherited from

`_ZodJSONSchema.prefault`

#### Call Signature

> **prefault**(`def`): [`ZodPrefault`](ZodPrefault.md)\<`ZodJSONSchema`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:49

##### Parameters

###### def

[`JSONType`](../namespaces/util/type-aliases/JSONType.md)

##### Returns

[`ZodPrefault`](ZodPrefault.md)\<`ZodJSONSchema`\>

##### Inherited from

`_ZodJSONSchema.prefault`

***

### readonly()

> **readonly**(): [`ZodReadonly`](ZodReadonly.md)\<`ZodJSONSchema`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:57

#### Returns

[`ZodReadonly`](ZodReadonly.md)\<`ZodJSONSchema`\>

#### Inherited from

`_ZodJSONSchema.readonly`

***

### refine()

> **refine**\<`Ch`\>(`check`, `params?`): `Ch` *extends* (`arg`) => `arg is R` ? `ZodJSONSchema` & [`ZodType`](ZodType-1.md)\<`R`, [`JSONType`](../namespaces/util/type-aliases/JSONType.md), [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, [`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>\> : `ZodJSONSchema`

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

`Ch` *extends* (`arg`) => `arg is R` ? `ZodJSONSchema` & [`ZodType`](ZodType-1.md)\<`R`, [`JSONType`](../namespaces/util/type-aliases/JSONType.md), [`$ZodTypeInternals`](../namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`R`, [`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>\> : `ZodJSONSchema`

#### Inherited from

`_ZodJSONSchema.refine`

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

...`ZodJSONSchema` *extends* `R`\[`"_schema"`\] ? `undefined` *extends* `R`\[`"_meta"`\] ? \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodJSONSchema`\>?\] : \[[`$replace`](../namespaces/core/type-aliases/$replace.md)\<`R`\[`"_meta"`\], `R`\[`"_schema"`\] & `ZodJSONSchema`\>\] : \[`"Incompatible schema"`\]

#### Returns

`this`

#### Inherited from

`_ZodJSONSchema.register`

***

### safeDecode()

> **safeDecode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:35

#### Parameters

##### data

[`JSONType`](../namespaces/util/type-aliases/JSONType.md)

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>

#### Inherited from

`_ZodJSONSchema.safeDecode`

***

### safeDecodeAsync()

> **safeDecodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:37

#### Parameters

##### data

[`JSONType`](../namespaces/util/type-aliases/JSONType.md)

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>\>

#### Inherited from

`_ZodJSONSchema.safeDecodeAsync`

***

### safeEncode()

> **safeEncode**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:34

#### Parameters

##### data

[`JSONType`](../namespaces/util/type-aliases/JSONType.md)

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>

#### Inherited from

`_ZodJSONSchema.safeEncode`

***

### safeEncodeAsync()

> **safeEncodeAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:36

#### Parameters

##### data

[`JSONType`](../namespaces/util/type-aliases/JSONType.md)

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>\>

#### Inherited from

`_ZodJSONSchema.safeEncodeAsync`

***

### safeParse()

> **safeParse**(`data`, `params?`): [`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:26

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>

#### Inherited from

`_ZodJSONSchema.safeParse`

***

### safeParseAsync()

> **safeParseAsync**(`data`, `params?`): `Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:28

#### Parameters

##### data

`unknown`

##### params?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

#### Returns

`Promise`\<[`ZodSafeParseResult`](../type-aliases/ZodSafeParseResult.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>\>

#### Inherited from

`_ZodJSONSchema.safeParseAsync`

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

`_ZodJSONSchema.superRefine`

***

### toJSONSchema()

> **toJSONSchema**(`params?`): [`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodJSONSchema`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:17

Converts this schema to a JSON Schema representation.

#### Parameters

##### params?

[`ToJSONSchemaParams`](../namespaces/core/type-aliases/ToJSONSchemaParams.md)

#### Returns

[`ZodStandardJSONSchemaPayload`](../namespaces/core/interfaces/ZodStandardJSONSchemaPayload.md)\<`ZodJSONSchema`\>

#### Inherited from

`_ZodJSONSchema.toJSONSchema`

***

### transform()

> **transform**\<`NewOut`\>(`transform`): [`ZodPipe`](ZodPipe.md)\<`ZodJSONSchema`, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, [`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:53

#### Type Parameters

##### NewOut

`NewOut`

#### Parameters

##### transform

(`arg`, `ctx`) => `NewOut` \| `Promise`\<`NewOut`\>

#### Returns

[`ZodPipe`](ZodPipe.md)\<`ZodJSONSchema`, [`ZodTransform`](ZodTransform.md)\<`Awaited`\<`NewOut`\>, [`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>\>

#### Inherited from

`_ZodJSONSchema.transform`

***

### with()

> **with**(...`checks`): `this`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/schemas.d.cts:19

#### Parameters

##### checks

...([`CheckFn`](../namespaces/core/type-aliases/CheckFn.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\> \| [`$ZodCheck`](../namespaces/core/interfaces/$ZodCheck.md)\<[`JSONType`](../namespaces/util/type-aliases/JSONType.md)\>)[]

#### Returns

`this`

#### Inherited from

`_ZodJSONSchema.with`
