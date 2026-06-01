# Interface: StreamObjectResult\<T\>

Defined in: [packages/agentos/src/api/streamObject.ts:123](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L123)

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

Defined in: [packages/agentos/src/api/streamObject.ts:143](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L143)

Resolves to the final Zod-validated object when the stream completes.

#### Throws

When the final JSON fails validation.

***

### partialObjectStream

> **partialObjectStream**: `AsyncIterable`\<[`DeepPartial`](../type-aliases/DeepPartial.md)\<`T`\>\>

Defined in: [packages/agentos/src/api/streamObject.ts:136](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L136)

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

Defined in: [packages/agentos/src/api/streamObject.ts:146](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L146)

Resolves to the raw text when the stream completes.

***

### usage

> **usage**: `Promise`\<[`TokenUsage`](TokenUsage.md)\>

Defined in: [packages/agentos/src/api/streamObject.ts:149](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L149)

Resolves to aggregated token usage when the stream completes.
