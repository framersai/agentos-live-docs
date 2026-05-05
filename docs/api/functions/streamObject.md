# Function: streamObject()

> **streamObject**\<`T`\>(`opts`): [`StreamObjectResult`](../interfaces/StreamObjectResult.md)\<[`output`](../@framers/namespaces/z/namespaces/core/type-aliases/output.md)\<`T`\>\>

Defined in: [packages/agentos/src/api/streamObject.ts:344](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/streamObject.ts#L344)

Streams a structured object by incrementally parsing JSON as the LLM
produces tokens, then validates the final result against a Zod schema.

Returns immediately with a [StreamObjectResult](../interfaces/StreamObjectResult.md) containing async
iterables and promises. The underlying LLM call begins lazily when a
consumer starts iterating `partialObjectStream` or awaits a promise.

## Type Parameters

### T

`T` *extends* [`ZodType`](../@framers/namespaces/z/interfaces/ZodType-1.md)\<`unknown`, `unknown`, [`$ZodTypeInternals`](../@framers/namespaces/z/namespaces/core/interfaces/$ZodTypeInternals-1.md)\<`unknown`, `unknown`\>\>

The Zod schema type. Partial objects are typed as
  `DeepPartial<z.infer<T>>`, and the final `object` promise resolves
  to `z.infer<T>`.

## Parameters

### opts

[`StreamObjectOptions`](../interfaces/StreamObjectOptions.md)\<`T`\>

Streaming generation options including the Zod schema,
  prompt/messages, and optional provider/model overrides.

## Returns

[`StreamObjectResult`](../interfaces/StreamObjectResult.md)\<[`output`](../@framers/namespaces/z/namespaces/core/type-aliases/output.md)\<`T`\>\>

A [StreamObjectResult](../interfaces/StreamObjectResult.md) with `partialObjectStream`, `object`,
  `text`, and `usage` properties.

## Example

```ts
import { z } from 'zod';
import { streamObject } from '@framers/agentos';

const result = streamObject({
  model: 'openai:gpt-4o',
  schema: z.object({ name: z.string(), hobbies: z.array(z.string()) }),
  prompt: 'Create a profile for a fictional character.',
});

for await (const partial of result.partialObjectStream) {
  console.log('partial:', partial);
}

const final = await result.object;
console.log('final:', final);
```

## See

 - [generateObject](generateObject.md) for non-streaming structured output.
 - [streamText](streamText.md) for plain text streaming.
