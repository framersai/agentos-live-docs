# Type Alias: ExtensionPackManifestEntry

> **ExtensionPackManifestEntry** = [`ExtensionPackResolver`](ExtensionPackResolver.md) & `object`

Defined in: [packages/agentos/src/extensions/manifest.ts:9](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/extensions/manifest.ts#L9)

## Type Declaration

### enabled?

> `optional` **enabled**: `boolean`

Allows enabling/disabling the entire pack via manifest.

### identifier?

> `optional` **identifier**: `string`

Identifier for diagnostics (e.g. file path within manifest).

### options?

> `optional` **options**: `Record`\<`string`, `unknown`\>

Optional configuration payload passed to the pack factory.

### priority?

> `optional` **priority**: `number`

Priority applied to descriptors emitted by this pack unless they override it individually.
