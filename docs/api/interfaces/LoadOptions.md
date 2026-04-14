# Interface: LoadOptions

Defined in: [packages/agentos/src/memory/io/facade/types.ts:651](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L651)

Options for the lower-level `Memory.load()` document-parsing primitive.

## Properties

### format?

> `optional` **format**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:656](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L656)

Format hint passed directly to the document parser.

#### Example

```ts
'pdf' | 'docx' | 'md' | 'txt'
```
