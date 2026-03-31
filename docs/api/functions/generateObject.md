# Function: generateObject()

> **generateObject**\<`T`\>(`opts`): `Promise`\<[`GenerateObjectResult`](../interfaces/GenerateObjectResult.md)\<`output`\<`T`\>\>\>

Defined in: [packages/agentos/src/api/generateObject.ts:313](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateObject.ts#L313)

Generates a structured object by forcing the LLM to produce JSON matching
a Zod schema.

Combines schema-aware prompt engineering with optional provider-native JSON
mode and automatic retry-with-feedback to reliably extract typed data from
unstructured text.

## Type Parameters

### T

`T` *extends* `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>

The Zod schema type. The returned `object` field is inferred
  as `z.infer<T>`.

## Parameters

### opts

[`GenerateObjectOptions`](../interfaces/GenerateObjectOptions.md)\<`T`\>

Generation options including the Zod schema, prompt/messages,
  and optional provider/model overrides.

## Returns

`Promise`\<[`GenerateObjectResult`](../interfaces/GenerateObjectResult.md)\<`output`\<`T`\>\>\>

A promise resolving to the validated object, raw text, usage, and metadata.

## Throws

When all retries are exhausted without
  producing valid JSON that passes Zod validation.

## Throws

When provider resolution fails (missing API key, unknown provider, etc.).

## Example

```ts
import { z } from 'zod';
import { generateObject } from '@framers/agentos';

const { object } = await generateObject({
  model: 'openai:gpt-4o',
  schema: z.object({ name: z.string(), age: z.number() }),
  prompt: 'Extract: "John is 30 years old"',
});

console.log(object.name); // "John"
console.log(object.age);  // 30
```

## See

 - [streamObject](streamObject.md) for streaming partial objects as they build up.
 - [generateText](generateText.md) for plain text generation without schema constraints.
