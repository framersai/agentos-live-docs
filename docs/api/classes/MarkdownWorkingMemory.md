# Class: MarkdownWorkingMemory

Defined in: [packages/agentos/src/memory/core/working/MarkdownWorkingMemory.ts:29](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/working/MarkdownWorkingMemory.ts#L29)

Persistent markdown working memory backed by a .md file on disk.
The agent reads and fully replaces this file via tools.
File contents are injected into the system prompt every turn.

## Constructors

### Constructor

> **new MarkdownWorkingMemory**(`filePath`, `template?`, `maxTokens?`): `MarkdownWorkingMemory`

Defined in: [packages/agentos/src/memory/core/working/MarkdownWorkingMemory.ts:30](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/working/MarkdownWorkingMemory.ts#L30)

#### Parameters

##### filePath

`string`

##### template?

`string` = `DEFAULT_TEMPLATE`

##### maxTokens?

`number` = `2000`

#### Returns

`MarkdownWorkingMemory`

## Methods

### ensureFile()

> **ensureFile**(): `void`

Defined in: [packages/agentos/src/memory/core/working/MarkdownWorkingMemory.ts:37](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/working/MarkdownWorkingMemory.ts#L37)

Creates the file with the template if it doesn't exist.

#### Returns

`void`

***

### estimateTokens()

> **estimateTokens**(): `number`

Defined in: [packages/agentos/src/memory/core/working/MarkdownWorkingMemory.ts:76](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/working/MarkdownWorkingMemory.ts#L76)

Estimates token count (~4 chars per token).

#### Returns

`number`

***

### getFilePath()

> **getFilePath**(): `string`

Defined in: [packages/agentos/src/memory/core/working/MarkdownWorkingMemory.ts:86](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/working/MarkdownWorkingMemory.ts#L86)

Returns the file path for reference.

#### Returns

`string`

***

### read()

> **read**(): `string`

Defined in: [packages/agentos/src/memory/core/working/MarkdownWorkingMemory.ts:45](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/working/MarkdownWorkingMemory.ts#L45)

Reads current file contents. Returns empty string if file missing.

#### Returns

`string`

***

### write()

> **write**(`content`): [`WriteResult`](../interfaces/WriteResult.md)

Defined in: [packages/agentos/src/memory/core/working/MarkdownWorkingMemory.ts:55](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/working/MarkdownWorkingMemory.ts#L55)

Replaces file contents entirely. Truncates if over maxTokens.

#### Parameters

##### content

`string`

#### Returns

[`WriteResult`](../interfaces/WriteResult.md)
