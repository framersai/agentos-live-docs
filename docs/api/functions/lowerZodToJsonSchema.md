# Function: lowerZodToJsonSchema()

> **lowerZodToJsonSchema**(`schema`): `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/compiler/SchemaLowering.ts:38](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/compiler/SchemaLowering.ts#L38)

Converts a Zod schema instance to a plain JSON Schema object.

Recursively descends into ZodObject shapes, ZodArray item types, ZodOptional and
ZodDefault wrappers, transparently unwrapping them so the produced JSON Schema
is clean and does not contain Zod-specific metadata.

## Parameters

### schema

`ZodType`

Any Zod schema instance.

## Returns

`Record`\<`string`, `unknown`\>

A JSON Schema-compatible plain object.

## Example

```ts
const jsonSchema = lowerZodToJsonSchema(z.object({ name: z.string(), age: z.number().optional() }));
// → { type: 'object', properties: { name: { type: 'string' }, age: { type: 'number' } }, required: ['name'] }
```
