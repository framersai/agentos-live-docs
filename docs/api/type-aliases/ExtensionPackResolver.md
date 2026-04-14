# Type Alias: ExtensionPackResolver

> **ExtensionPackResolver** = \{ `package`: `string`; `version?`: `string`; \} \| \{ `module`: `string`; \} \| \{ `factory`: () => `Promise`\<[`ExtensionPack`](../interfaces/ExtensionPack.md)\> \| [`ExtensionPack`](../interfaces/ExtensionPack.md); \}

Defined in: [packages/agentos/src/extensions/manifest.ts:4](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/manifest.ts#L4)
