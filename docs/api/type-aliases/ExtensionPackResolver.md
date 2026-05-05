# Type Alias: ExtensionPackResolver

> **ExtensionPackResolver** = \{ `package`: `string`; `version?`: `string`; \} \| \{ `module`: `string`; \} \| \{ `factory`: () => `Promise`\<[`ExtensionPack`](../interfaces/ExtensionPack.md)\> \| [`ExtensionPack`](../interfaces/ExtensionPack.md); \}

Defined in: [packages/agentos/src/extensions/manifest.ts:4](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/extensions/manifest.ts#L4)
