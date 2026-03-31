# Type Alias: DeepPartial\<T\>

> **DeepPartial**\<`T`\> = `T` *extends* `object` ? `{ [K in keyof T]?: DeepPartial<T[K]> }` : `T`

Defined in: [packages/agentos/src/api/streamObject.ts:31](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/streamObject.ts#L31)

Recursively makes every property in `T` optional, including nested objects.
Used to type the partial objects yielded by `StreamObjectResult.partialObjectStream`
as the LLM incrementally builds the JSON response.

## Type Parameters

### T

`T`

The source type to make deeply partial.
