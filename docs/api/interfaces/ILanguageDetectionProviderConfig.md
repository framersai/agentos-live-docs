# Interface: ILanguageDetectionProviderConfig

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:28](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/interfaces.ts#L28)

Configuration descriptor for a language detection provider.

## Properties

### id

> **id**: `string`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:30](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/interfaces.ts#L30)

Unique ID referenced in AgentOSConfig.languageConfig.detectionProviders.

***

### minConfidence?

> `optional` **minConfidence**: `number`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:36](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/interfaces.ts#L36)

Minimum confidence threshold before a result is considered.

***

### params?

> `optional` **params**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:32](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/interfaces.ts#L32)

Optional initialization parameters (API keys, model hints, etc.).

***

### priority?

> `optional` **priority**: `number`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:34](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/interfaces.ts#L34)

Relative priority (lower executes earlier).
