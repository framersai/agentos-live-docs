# Interface: StatisticalUtilityAIConfig

Defined in: [packages/agentos/src/nlp/ai\_utilities/StatisticalUtilityAI.ts:56](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/nlp/ai_utilities/StatisticalUtilityAI.ts#L56)

Base configuration for any IUtilityAI implementation.

## Extends

- [`UtilityAIConfigBase`](UtilityAIConfigBase.md)

## Properties

### classifierConfig?

> `optional` **classifierConfig**: `object`

Defined in: [packages/agentos/src/nlp/ai\_utilities/StatisticalUtilityAI.ts:71](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/nlp/ai_utilities/StatisticalUtilityAI.ts#L71)

#### naiveBayes?

> `optional` **naiveBayes**: `object`

##### naiveBayes.defaultAlpha?

> `optional` **defaultAlpha**: `number`

##### naiveBayes.defaultModelId?

> `optional` **defaultModelId**: `string`

##### naiveBayes.modelStoragePath?

> `optional` **modelStoragePath**: `string`

***

### customStopWordsPaths?

> `optional` **customStopWordsPaths**: `Record`\<`string`, `string`\>

Defined in: [packages/agentos/src/nlp/ai\_utilities/StatisticalUtilityAI.ts:61](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/nlp/ai_utilities/StatisticalUtilityAI.ts#L61)

***

### defaultLanguage?

> `optional` **defaultLanguage**: `string`

Defined in: [packages/agentos/src/nlp/ai\_utilities/IUtilityAI.ts:21](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/nlp/ai_utilities/IUtilityAI.ts#L21)

Default language for processing if not specified in method options (e.g., 'en', 'es'). BCP-47 format preferred.

#### Inherited from

[`UtilityAIConfigBase`](UtilityAIConfigBase.md).[`defaultLanguage`](UtilityAIConfigBase.md#defaultlanguage)

***

### defaultStopWordsLanguage?

> `optional` **defaultStopWordsLanguage**: `string`

Defined in: [packages/agentos/src/nlp/ai\_utilities/StatisticalUtilityAI.ts:60](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/nlp/ai_utilities/StatisticalUtilityAI.ts#L60)

***

### languageDetectionConfig?

> `optional` **languageDetectionConfig**: `object`

Defined in: [packages/agentos/src/nlp/ai\_utilities/StatisticalUtilityAI.ts:82](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/nlp/ai_utilities/StatisticalUtilityAI.ts#L82)

#### nGramProfilePath?

> `optional` **nGramProfilePath**: `string`

***

### readabilitySyllableAlgorithm?

> `optional` **readabilitySyllableAlgorithm**: `"regex_approx"` \| `"dictionary_lookup"`

Defined in: [packages/agentos/src/nlp/ai\_utilities/StatisticalUtilityAI.ts:86](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/nlp/ai_utilities/StatisticalUtilityAI.ts#L86)

***

### resourcePath?

> `optional` **resourcePath**: `string`

Defined in: [packages/agentos/src/nlp/ai\_utilities/StatisticalUtilityAI.ts:58](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/nlp/ai_utilities/StatisticalUtilityAI.ts#L58)

Path to a directory containing resource files (e.g., stop word lists, lexicons, trained models for statistical utilities).

#### Overrides

[`UtilityAIConfigBase`](UtilityAIConfigBase.md).[`resourcePath`](UtilityAIConfigBase.md#resourcepath)

***

### sentimentConfig?

> `optional` **sentimentConfig**: `object`

Defined in: [packages/agentos/src/nlp/ai\_utilities/StatisticalUtilityAI.ts:78](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/nlp/ai_utilities/StatisticalUtilityAI.ts#L78)

#### defaultLexiconLanguage?

> `optional` **defaultLexiconLanguage**: `string`

#### lexiconPath?

> `optional` **lexiconPath**: `string`

***

### summarizerConfig?

> `optional` **summarizerConfig**: `object`

Defined in: [packages/agentos/src/nlp/ai\_utilities/StatisticalUtilityAI.ts:63](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/nlp/ai_utilities/StatisticalUtilityAI.ts#L63)

#### lexRank?

> `optional` **lexRank**: `object`

##### lexRank.dampingFactor?

> `optional` **dampingFactor**: `number`

##### lexRank.epsilon?

> `optional` **epsilon**: `number`

##### lexRank.maxIterations?

> `optional` **maxIterations**: `number`

##### lexRank.similarityThreshold?

> `optional` **similarityThreshold**: `number`

***

### utilityId?

> `optional` **utilityId**: `string`

Defined in: [packages/agentos/src/nlp/ai\_utilities/IUtilityAI.ts:19](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/nlp/ai_utilities/IUtilityAI.ts#L19)

Unique identifier for this specific utility AI service instance.

#### Inherited from

[`UtilityAIConfigBase`](UtilityAIConfigBase.md).[`utilityId`](UtilityAIConfigBase.md#utilityid)
