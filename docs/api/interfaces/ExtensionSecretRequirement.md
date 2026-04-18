# Interface: ExtensionSecretRequirement

Defined in: [packages/agentos/src/extensions/types.ts:81](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L81)

Declares a dependency on a named secret (API key / credential).

## Properties

### description?

> `optional` **description**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:87](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L87)

Optional context surfaced in tooling.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:83](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L83)

Unique identifier matching the shared secret catalog.

***

### optional?

> `optional` **optional**: `boolean`

Defined in: [packages/agentos/src/extensions/types.ts:85](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/types.ts#L85)

When true the descriptor can still activate without this secret.
