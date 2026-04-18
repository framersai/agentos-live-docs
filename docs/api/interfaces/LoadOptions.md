# Interface: LoadOptions

Defined in: [packages/agentos/src/memory/io/facade/types.ts:651](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/facade/types.ts#L651)

Options for the lower-level `Memory.load()` document-parsing primitive.

## Properties

### format?

> `optional` **format**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:656](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/facade/types.ts#L656)

Format hint passed directly to the document parser.

#### Example

```ts
'pdf' | 'docx' | 'md' | 'txt'
```
