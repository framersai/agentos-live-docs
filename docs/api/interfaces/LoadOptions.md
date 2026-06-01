# Interface: LoadOptions

Defined in: [packages/agentos/src/cognition/memory/io/facade/types.ts:659](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/types.ts#L659)

Options for the lower-level `Memory.load()` document-parsing primitive.

## Properties

### format?

> `optional` **format**: `string`

Defined in: [packages/agentos/src/cognition/memory/io/facade/types.ts:664](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/types.ts#L664)

Format hint passed directly to the document parser.

#### Example

```ts
'pdf' | 'docx' | 'md' | 'txt'
```
