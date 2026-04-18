# Interface: ExtensionSourceMetadata

Defined in: [packages/agentos/src/extensions/types.ts:31](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L31)

Metadata describing where a descriptor originated from. Useful for debugging,
audit logs, or surfacing provenance in developer tooling.

## Properties

### identifier?

> `optional` **identifier**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:43](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L43)

Identifier of the pack entry inside a manifest (path, local file, etc.).

***

### sourceName

> **sourceName**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:35](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L35)

Human-friendly name of the pack providing the descriptor (e.g. package name).

***

### sourceVersion?

> `optional` **sourceVersion**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:39](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L39)

Optional semantic version of the pack.
