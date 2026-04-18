# Interface: StreamObjectResult\<T\>

Defined in: [packages/agentos/src/api/streamObject.ts:122](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L122)

The result object returned immediately by [streamObject](../functions/streamObject.md).

Consumers iterate `partialObjectStream` for incremental partial objects,
or `await` the promise properties for the final validated result.

## Type Parameters

### T

`T`

The inferred type from the Zod schema.

## Properties

### object

> **object**: `Promise`\<`T`\>

Defined in: [packages/agentos/src/api/streamObject.ts:142](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L142)

Resolves to the final Zod-validated object when the stream completes.

#### Throws

When the final JSON fails validation.

***

### partialObjectStream

> **partialObjectStream**: `AsyncIterable`\<[`DeepPartial`](../type-aliases/DeepPartial.md)\<`T`\>\>

Defined in: [packages/agentos/src/api/streamObject.ts:135](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L135)

Async iterable yielding partial objects as the LLM builds the JSON
response token by token. Each yielded value has the same shape as `T`
but with all fields optional ([DeepPartial](../type-aliases/DeepPartial.md)).

#### Example

```ts
for await (const partial of result.partialObjectStream) {
  console.log('partial:', partial);
}
```

***

### text

> **text**: `Promise`\<`string`\>

Defined in: [packages/agentos/src/api/streamObject.ts:145](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L145)

Resolves to the raw text when the stream completes.

***

### usage

> **usage**: `Promise`\<[`TokenUsage`](TokenUsage.md)\>

Defined in: [packages/agentos/src/api/streamObject.ts:148](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L148)

Resolves to aggregated token usage when the stream completes.
