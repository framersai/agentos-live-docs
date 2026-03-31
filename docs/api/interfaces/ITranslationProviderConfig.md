# Interface: ITranslationProviderConfig

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:59](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/nlp/language/interfaces.ts#L59)

Configuration descriptor for a translation provider.

## Properties

### costTier?

> `optional` **costTier**: `"low"` \| `"medium"` \| `"high"`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:63](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/nlp/language/interfaces.ts#L63)

Cost tier hint for routing ("low", "medium", "high").

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:60](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/nlp/language/interfaces.ts#L60)

***

### maxCharsPerRequest?

> `optional` **maxCharsPerRequest**: `number`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:67](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/nlp/language/interfaces.ts#L67)

Maximum characters per request (provider constraint).

***

### params?

> `optional` **params**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:61](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/nlp/language/interfaces.ts#L61)

***

### priority?

> `optional` **priority**: `number`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:65](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/nlp/language/interfaces.ts#L65)

Relative priority for fallback ordering.

***

### supportedLanguages?

> `optional` **supportedLanguages**: `string`[]

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:69](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/nlp/language/interfaces.ts#L69)

Supported language codes subset; undefined means provider attempts all.
