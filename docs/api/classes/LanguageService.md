# Class: LanguageService

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:45](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/LanguageService.ts#L45)

High-level language orchestration service used by AgentOS runtime.

## Implements

- [`ILanguageService`](../interfaces/ILanguageService.md)

## Constructors

### Constructor

> **new LanguageService**(`config`): `LanguageService`

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:51](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/LanguageService.ts#L51)

#### Parameters

##### config

[`AgentOSLanguageConfig`](../interfaces/AgentOSLanguageConfig.md)

#### Returns

`LanguageService`

## Methods

### detectLanguages()

> **detectLanguages**(`text`): `Promise`\<[`DetectedLanguageResult`](../interfaces/DetectedLanguageResult.md)[]\>

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:86](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/LanguageService.ts#L86)

Perform language detection across configured providers & merge results.

#### Parameters

##### text

`string`

#### Returns

`Promise`\<[`DetectedLanguageResult`](../interfaces/DetectedLanguageResult.md)[]\>

#### Implementation of

[`ILanguageService`](../interfaces/ILanguageService.md).[`detectLanguages`](../interfaces/ILanguageService.md#detectlanguages)

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:53](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/LanguageService.ts#L53)

Initialize providers and internal caches.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ILanguageService`](../interfaces/ILanguageService.md).[`initialize`](../interfaces/ILanguageService.md#initialize)

***

### maybeNormalizeForPivot()

> **maybeNormalizeForPivot**(`content`, `source`, `pivot?`): `Promise`\<\{ `normalized`: `string`; `providerId?`: `string`; \} \| `null`\>

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:147](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/LanguageService.ts#L147)

Attempt pivot normalization of content (source->pivot) if pivot provided.

#### Parameters

##### content

`string`

##### source

`string`

##### pivot?

`string`

#### Returns

`Promise`\<\{ `normalized`: `string`; `providerId?`: `string`; \} \| `null`\>

#### Implementation of

[`ILanguageService`](../interfaces/ILanguageService.md).[`maybeNormalizeForPivot`](../interfaces/ILanguageService.md#maybenormalizeforpivot)

***

### maybeTranslateForDisplay()

> **maybeTranslateForDisplay**(`content`, `source`, `target`): `Promise`\<[`TranslationResult`](../interfaces/TranslationResult.md) \| `null`\>

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:154](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/LanguageService.ts#L154)

Translate post-generation to user display target (if differs).

#### Parameters

##### content

`string`

##### source

`string`

##### target

`string`

#### Returns

`Promise`\<[`TranslationResult`](../interfaces/TranslationResult.md) \| `null`\>

#### Implementation of

[`ILanguageService`](../interfaces/ILanguageService.md).[`maybeTranslateForDisplay`](../interfaces/ILanguageService.md#maybetranslatefordisplay)

***

### negotiate()

> **negotiate**(`params`): [`LanguageNegotiationResult`](../interfaces/LanguageNegotiationResult.md)

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:103](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/LanguageService.ts#L103)

Determine target/pivot languages given negotiation inputs.

#### Parameters

##### params

[`LanguageNegotiationParams`](../interfaces/LanguageNegotiationParams.md)

#### Returns

[`LanguageNegotiationResult`](../interfaces/LanguageNegotiationResult.md)

#### Implementation of

[`ILanguageService`](../interfaces/ILanguageService.md).[`negotiate`](../interfaces/ILanguageService.md#negotiate)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:201](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/LanguageService.ts#L201)

Graceful shutdown for providers.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ILanguageService`](../interfaces/ILanguageService.md).[`shutdown`](../interfaces/ILanguageService.md#shutdown)

***

### translateQueryForRag()

> **translateQueryForRag**(`query`, `source`, `pivot`): `Promise`\<[`TranslationResult`](../interfaces/TranslationResult.md) \| `null`\>

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:159](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/LanguageService.ts#L159)

Translate query for RAG pivot search.

#### Parameters

##### query

`string`

##### source

`string`

##### pivot

`string`

#### Returns

`Promise`\<[`TranslationResult`](../interfaces/TranslationResult.md) \| `null`\>

#### Implementation of

[`ILanguageService`](../interfaces/ILanguageService.md).[`translateQueryForRag`](../interfaces/ILanguageService.md#translatequeryforrag)

***

### translateRagResults()

> **translateRagResults**(`results`, `target`): `Promise`\<`object`[]\>

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:164](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/LanguageService.ts#L164)

Translate retrieved RAG results back to target language.

#### Parameters

##### results

`object`[]

##### target

`string`

#### Returns

`Promise`\<`object`[]\>

#### Implementation of

[`ILanguageService`](../interfaces/ILanguageService.md).[`translateRagResults`](../interfaces/ILanguageService.md#translateragresults)

***

### translateToolArguments()

> **translateToolArguments**(`args`, `source`, `toolLanguage`): `Promise`\<\{ `providerId?`: `string`; `translatedArgs`: `Record`\<`string`, `any`\>; \} \| `null`\>

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:177](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/LanguageService.ts#L177)

Wrap tool input translation logic.

#### Parameters

##### args

`Record`\<`string`, `any`\>

##### source

`string`

##### toolLanguage

`string`

#### Returns

`Promise`\<\{ `providerId?`: `string`; `translatedArgs`: `Record`\<`string`, `any`\>; \} \| `null`\>

#### Implementation of

[`ILanguageService`](../interfaces/ILanguageService.md).[`translateToolArguments`](../interfaces/ILanguageService.md#translatetoolarguments)

***

### translateToolResult()

> **translateToolResult**(`result`, `source`, `target`): `Promise`\<\{ `providerId?`: `string`; `translatedResult`: `any`; \} \| `null`\>

Defined in: [packages/agentos/src/nlp/language/LanguageService.ts:189](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/LanguageService.ts#L189)

Wrap tool result translation logic.

#### Parameters

##### result

`any`

##### source

`string`

##### target

`string`

#### Returns

`Promise`\<\{ `providerId?`: `string`; `translatedResult`: `any`; \} \| `null`\>

#### Implementation of

[`ILanguageService`](../interfaces/ILanguageService.md).[`translateToolResult`](../interfaces/ILanguageService.md#translatetoolresult)
