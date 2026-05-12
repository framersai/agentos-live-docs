# Interface: ZodError\<T\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/errors.d.cts:6

An Error-like class used to store Zod validation issues.

## Extends

- [`$ZodError`](../namespaces/core/interfaces/$ZodError.md)\<`T`\>

## Type Parameters

### T

`T` = `unknown`

## Properties

### \_zod

> **\_zod**: `object`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:134

#### def

> **def**: [`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)[]

#### output

> **output**: `T`

#### Inherited from

[`$ZodError`](../namespaces/core/interfaces/$ZodError.md).[`_zod`](../namespaces/core/interfaces/$ZodError.md#_zod)

***

### ~~isEmpty~~

> **isEmpty**: `boolean`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/errors.d.cts:18

#### Deprecated

Check `err.issues.length === 0` instead.

***

### issues

> **issues**: [`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)[]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:133

#### Inherited from

[`$ZodError`](../namespaces/core/interfaces/$ZodError.md).[`issues`](../namespaces/core/interfaces/$ZodError.md#issues)

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

[`$ZodError`](../namespaces/core/interfaces/$ZodError.md).[`message`](../namespaces/core/interfaces/$ZodError.md#message)

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:139

#### Inherited from

[`$ZodError`](../namespaces/core/interfaces/$ZodError.md).[`name`](../namespaces/core/interfaces/$ZodError.md#name)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:138

#### Inherited from

[`$ZodError`](../namespaces/core/interfaces/$ZodError.md).[`stack`](../namespaces/core/interfaces/$ZodError.md#stack)

***

### type

> **type**: `T`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:132

#### Inherited from

[`$ZodError`](../namespaces/core/interfaces/$ZodError.md).[`type`](../namespaces/core/interfaces/$ZodError.md#type)

## Methods

### ~~addIssue()~~

> **addIssue**(`issue`): `void`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/errors.d.cts:14

#### Parameters

##### issue

[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)

#### Returns

`void`

#### Deprecated

Push directly to `.issues` instead.

***

### ~~addIssues()~~

> **addIssues**(`issues`): `void`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/errors.d.cts:16

#### Parameters

##### issues

[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)[]

#### Returns

`void`

#### Deprecated

Push directly to `.issues` instead.

***

### flatten()

#### Call Signature

> **flatten**(): [`$ZodFlattenedError`](../namespaces/core/type-aliases/$ZodFlattenedError.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/errors.d.cts:11

##### Returns

[`$ZodFlattenedError`](../namespaces/core/type-aliases/$ZodFlattenedError.md)\<`T`\>

##### Deprecated

Use the `z.treeifyError(err)` function instead.

#### Call Signature

> **flatten**\<`U`\>(`mapper`): [`$ZodFlattenedError`](../namespaces/core/type-aliases/$ZodFlattenedError.md)\<`T`, `U`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/errors.d.cts:12

##### Type Parameters

###### U

`U`

##### Parameters

###### mapper

(`issue`) => `U`

##### Returns

[`$ZodFlattenedError`](../namespaces/core/type-aliases/$ZodFlattenedError.md)\<`T`, `U`\>

***

### format()

#### Call Signature

> **format**(): [`$ZodFormattedError`](../namespaces/core/type-aliases/$ZodFormattedError.md)\<`T`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/errors.d.cts:8

##### Returns

[`$ZodFormattedError`](../namespaces/core/type-aliases/$ZodFormattedError.md)\<`T`\>

##### Deprecated

Use the `z.treeifyError(err)` function instead.

#### Call Signature

> **format**\<`U`\>(`mapper`): [`$ZodFormattedError`](../namespaces/core/type-aliases/$ZodFormattedError.md)\<`T`, `U`\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/errors.d.cts:9

##### Type Parameters

###### U

`U`

##### Parameters

###### mapper

(`issue`) => `U`

##### Returns

[`$ZodFormattedError`](../namespaces/core/type-aliases/$ZodFormattedError.md)\<`T`, `U`\>
