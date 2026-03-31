# Type Alias: ExtensionPackResolver

> **ExtensionPackResolver** = \{ `package`: `string`; `version?`: `string`; \} \| \{ `module`: `string`; \} \| \{ `factory`: () => `Promise`\<[`ExtensionPack`](../interfaces/ExtensionPack.md)\> \| [`ExtensionPack`](../interfaces/ExtensionPack.md); \}

Defined in: [packages/agentos/src/extensions/manifest.ts:4](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/manifest.ts#L4)
