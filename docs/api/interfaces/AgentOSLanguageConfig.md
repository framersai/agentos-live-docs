# Interface: AgentOSLanguageConfig

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:22](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/LanguageService.ts#L22)

## Properties

### autoDetect?

> `optional` **autoDetect**: `boolean`

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:27](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/LanguageService.ts#L27)

***

### defaultLanguage

> **defaultLanguage**: `string`

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:23](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/LanguageService.ts#L23)

***

### detectionProviderConfigs?

> `optional` **detectionProviderConfigs**: `object`[]

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:30](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/LanguageService.ts#L30)

Detection provider configs (ordered by priority).

#### id

> **id**: `string`

#### params?

> `optional` **params**: `Record`\<`string`, `any`\>

#### priority?

> `optional` **priority**: `number`

***

### enableCaching?

> `optional` **enableCaching**: `boolean`

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:38](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/LanguageService.ts#L38)

Optional caching of translation outputs.

***

### enableCodeAwareTranslation?

> `optional` **enableCodeAwareTranslation**: `boolean`

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:36](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/LanguageService.ts#L36)

Enable partitioning of code blocks from prose during translation for better fidelity.

***

### enablePivotNormalization?

> `optional` **enablePivotNormalization**: `boolean`

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:42](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/LanguageService.ts#L42)

If true, attempt pivot normalization (source->pivot) before generation.

***

### fallbackLanguages?

> `optional` **fallbackLanguages**: `string`[]

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:25](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/LanguageService.ts#L25)

***

### maxDirectCharsPerTranslation?

> `optional` **maxDirectCharsPerTranslation**: `number`

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:34](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/LanguageService.ts#L34)

Maximum characters to attempt direct single-shot translation before chunking.

***

### pivotLanguage?

> `optional` **pivotLanguage**: `string`

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:26](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/LanguageService.ts#L26)

***

### preferSourceLanguageResponses?

> `optional` **preferSourceLanguageResponses**: `boolean`

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:28](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/LanguageService.ts#L28)

***

### supportedLanguages

> **supportedLanguages**: `string`[]

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:24](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/LanguageService.ts#L24)

***

### translationCacheMaxEntries?

> `optional` **translationCacheMaxEntries**: `number`

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:40](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/LanguageService.ts#L40)

Approximate max entries in translation cache (LRU).

***

### translationProviderConfigs?

> `optional` **translationProviderConfigs**: `object`[]

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:32](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/nlp/language/LanguageService.ts#L32)

Translation provider configs.

#### costTier?

> `optional` **costTier**: `"low"` \| `"medium"` \| `"high"`

#### id

> **id**: `string`

#### params?

> `optional` **params**: `Record`\<`string`, `any`\>

#### priority?

> `optional` **priority**: `number`

#### supportedLanguages?

> `optional` **supportedLanguages**: `string`[]
