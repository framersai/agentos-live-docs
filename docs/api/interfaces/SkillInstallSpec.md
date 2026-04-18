# Interface: SkillInstallSpec

Defined in: [packages/agentos/src/skills/types.ts:23](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L23)

Installation specification for a skill dependency.

## Properties

### archive?

> `optional` **archive**: `string`

Defined in: [packages/agentos/src/skills/types.ts:56](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L56)

Archive filename for extraction

***

### bins?

> `optional` **bins**: `string`[]

Defined in: [packages/agentos/src/skills/types.ts:34](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L34)

Binary names that should exist after install

***

### extract?

> `optional` **extract**: `boolean`

Defined in: [packages/agentos/src/skills/types.ts:59](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L59)

Whether to extract the archive

***

### formula?

> `optional` **formula**: `string`

Defined in: [packages/agentos/src/skills/types.ts:41](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L41)

Homebrew formula name

***

### id?

> `optional` **id**: `string`

Defined in: [packages/agentos/src/skills/types.ts:25](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L25)

Unique identifier for this install spec

***

### kind

> **kind**: [`SkillInstallKind`](../type-aliases/SkillInstallKind.md)

Defined in: [packages/agentos/src/skills/types.ts:28](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L28)

Installation method

***

### label?

> `optional` **label**: `string`

Defined in: [packages/agentos/src/skills/types.ts:31](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L31)

Human-readable label

***

### module?

> `optional` **module**: `string`

Defined in: [packages/agentos/src/skills/types.ts:49](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L49)

Go module spec for `go install` (e.g. `golang.org/x/tools/cmd/goimports@latest`)

***

### os?

> `optional` **os**: readonly `string`[]

Defined in: [packages/agentos/src/skills/types.ts:37](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L37)

Limit to specific OS platforms

***

### package?

> `optional` **package**: `string`

Defined in: [packages/agentos/src/skills/types.ts:45](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L45)

Package name (apt package, npm package, uv tool package)

***

### stripComponents?

> `optional` **stripComponents**: `number`

Defined in: [packages/agentos/src/skills/types.ts:62](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L62)

Number of path components to strip during extraction

***

### targetDir?

> `optional` **targetDir**: `string`

Defined in: [packages/agentos/src/skills/types.ts:65](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L65)

Target directory for extracted files

***

### url?

> `optional` **url**: `string`

Defined in: [packages/agentos/src/skills/types.ts:53](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L53)

Download URL
