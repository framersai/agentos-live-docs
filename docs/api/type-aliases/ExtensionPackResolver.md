# Type Alias: ExtensionPackResolver

> **ExtensionPackResolver** = \{ `package`: `string`; `version?`: `string`; \} \| \{ `module`: `string`; \} \| \{ `factory`: () => `Promise`\<[`ExtensionPack`](../interfaces/ExtensionPack.md)\> \| [`ExtensionPack`](../interfaces/ExtensionPack.md); \}

Defined in: [packages/agentos/src/extensions/manifest.ts:4](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/manifest.ts#L4)
