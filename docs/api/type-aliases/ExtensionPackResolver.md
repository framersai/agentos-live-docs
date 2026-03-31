# Type Alias: ExtensionPackResolver

> **ExtensionPackResolver** = \{ `package`: `string`; `version?`: `string`; \} \| \{ `module`: `string`; \} \| \{ `factory`: () => `Promise`\<[`ExtensionPack`](../interfaces/ExtensionPack.md)\> \| [`ExtensionPack`](../interfaces/ExtensionPack.md); \}

Defined in: [packages/agentos/src/extensions/manifest.ts:4](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/manifest.ts#L4)
