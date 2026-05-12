# ~~Class: JSONSchemaGenerator~~

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema-generator.d.cts:32

Legacy class-based interface for JSON Schema generation.
This class wraps the new functional implementation to provide backward compatibility.

## Deprecated

Use the `toJSONSchema` function instead for new code.

## Example

```typescript
// Legacy usage (still supported)
const gen = new JSONSchemaGenerator({ target: "draft-07" });
gen.process(schema);
const result = gen.emit(schema);

// Preferred modern usage
const result = toJSONSchema(schema, { target: "draft-07" });
```

## Constructors

### Constructor

> **new JSONSchemaGenerator**(`params?`): `JSONSchemaGenerator`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema-generator.d.cts:53

#### Parameters

##### params?

`JSONSchemaGeneratorConstructorParams`

#### Returns

`JSONSchemaGenerator`

## Accessors

### ~~counter~~

#### Get Signature

> **get** **counter**(): `number`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema-generator.d.cts:49

##### Deprecated

Access via ctx instead

##### Returns

`number`

#### Set Signature

> **set** **counter**(`value`): `void`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema-generator.d.cts:50

##### Parameters

###### value

`number`

##### Returns

`void`

***

### ~~io~~

#### Get Signature

> **get** **io**(): `"input"` \| `"output"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema-generator.d.cts:47

##### Deprecated

Access via ctx instead

##### Returns

`"input"` \| `"output"`

***

### ~~metadataRegistry~~

#### Get Signature

> **get** **metadataRegistry**(): [`$ZodRegistry`]($ZodRegistry.md)\<`Record`\<`string`, `any`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema-generator.d.cts:35

##### Deprecated

Access via ctx instead

##### Returns

[`$ZodRegistry`]($ZodRegistry.md)\<`Record`\<`string`, `any`\>\>

***

### ~~override~~

#### Get Signature

> **get** **override**(): (`ctx`) => `void`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema-generator.d.cts:41

##### Deprecated

Access via ctx instead

##### Returns

> (`ctx`): `void`

###### Parameters

###### ctx

###### jsonSchema

[`JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema-1.md)

###### path

(`string` \| `number`)[]

###### zodSchema

[`$ZodType`](../interfaces/$ZodType-1.md)

###### Returns

`void`

***

### ~~seen~~

#### Get Signature

> **get** **seen**(): `Map`\<[`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>, [`Seen`](../interfaces/Seen.md)\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema-generator.d.cts:52

##### Deprecated

Access via ctx instead

##### Returns

`Map`\<[`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>, [`Seen`](../interfaces/Seen.md)\>

***

### ~~target~~

#### Get Signature

> **get** **target**(): `"draft-04"` \| `"draft-07"` \| `"draft-2020-12"` \| `"openapi-3.0"` \| `object` & `string`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema-generator.d.cts:37

##### Deprecated

Access via ctx instead

##### Returns

`"draft-04"` \| `"draft-07"` \| `"draft-2020-12"` \| `"openapi-3.0"` \| `object` & `string`

***

### ~~unrepresentable~~

#### Get Signature

> **get** **unrepresentable**(): `"throw"` \| `"any"`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema-generator.d.cts:39

##### Deprecated

Access via ctx instead

##### Returns

`"throw"` \| `"any"`

## Methods

### ~~emit()~~

> **emit**(`schema`, `_params?`): [`JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema-1.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema-generator.d.cts:63

Emit the final JSON Schema after processing.
Must call process() first.

#### Parameters

##### schema

[`$ZodType`](../interfaces/$ZodType-1.md)

##### \_params?

`EmitParams`

#### Returns

[`JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema-1.md)

***

### ~~process()~~

> **process**(`schema`, `_params?`): [`JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema-1.md)

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/json-schema-generator.d.cts:58

Process a schema to prepare it for JSON Schema generation.
This must be called before emit().

#### Parameters

##### schema

[`$ZodType`](../interfaces/$ZodType-1.md)

##### \_params?

[`ProcessParams`](../interfaces/ProcessParams.md)

#### Returns

[`JSONSchema`](../namespaces/JSONSchema/type-aliases/JSONSchema-1.md)
