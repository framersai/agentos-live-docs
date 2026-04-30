# Interface: LoadOptions

Defined in: [packages/agentos/src/memory/io/facade/types.ts:659](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L659)

Options for the lower-level `Memory.load()` document-parsing primitive.

## Properties

### format?

> `optional` **format**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:664](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L664)

Format hint passed directly to the document parser.

#### Example

```ts
'pdf' | 'docx' | 'md' | 'txt'
```
