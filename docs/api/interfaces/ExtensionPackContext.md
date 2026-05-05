# Interface: ExtensionPackContext

Defined in: [packages/agentos/src/extensions/manifest.ts:45](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/extensions/manifest.ts#L45)

## Properties

### getSecret()?

> `optional` **getSecret**: (`secretId`) => `string` \| `undefined`

Defined in: [packages/agentos/src/extensions/manifest.ts:50](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/extensions/manifest.ts#L50)

#### Parameters

##### secretId

`string`

#### Returns

`string` \| `undefined`

***

### logger?

> `optional` **logger**: [`ILogger`](ILogger.md)

Defined in: [packages/agentos/src/extensions/manifest.ts:49](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/extensions/manifest.ts#L49)

***

### manifestEntry?

> `optional` **manifestEntry**: [`ExtensionPackManifestEntry`](../type-aliases/ExtensionPackManifestEntry.md)

Defined in: [packages/agentos/src/extensions/manifest.ts:46](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/extensions/manifest.ts#L46)

***

### options?

> `optional` **options**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/extensions/manifest.ts:48](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/extensions/manifest.ts#L48)

***

### services?

> `optional` **services**: [`ISharedServiceRegistry`](ISharedServiceRegistry.md)

Defined in: [packages/agentos/src/extensions/manifest.ts:51](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/extensions/manifest.ts#L51)

***

### source?

> `optional` **source**: [`ExtensionSourceMetadata`](ExtensionSourceMetadata.md)

Defined in: [packages/agentos/src/extensions/manifest.ts:47](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/extensions/manifest.ts#L47)
