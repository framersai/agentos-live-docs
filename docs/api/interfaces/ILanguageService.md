# Interface: ILanguageService

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:132](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/nlp/language/interfaces.ts#L132)

High-level language orchestration service used by AgentOS runtime.

## Methods

### detectLanguages()

> **detectLanguages**(`text`): `Promise`\<[`DetectedLanguageResult`](DetectedLanguageResult.md)[]\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:137](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/nlp/language/interfaces.ts#L137)

Perform language detection across configured providers & merge results.

#### Parameters

##### text

`string`

#### Returns

`Promise`\<[`DetectedLanguageResult`](DetectedLanguageResult.md)[]\>

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:134](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/nlp/language/interfaces.ts#L134)

Initialize providers and internal caches.

#### Returns

`Promise`\<`void`\>

***

### maybeNormalizeForPivot()

> **maybeNormalizeForPivot**(`content`, `source`, `pivot?`): `Promise`\<\{ `normalized`: `string`; `providerId?`: `string`; \} \| `null`\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:143](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/nlp/language/interfaces.ts#L143)

Optional normalization before prompt construction (pivot).

#### Parameters

##### content

`string`

##### source

`string`

##### pivot?

`string`

#### Returns

`Promise`\<\{ `normalized`: `string`; `providerId?`: `string`; \} \| `null`\>

***

### maybeTranslateForDisplay()

> **maybeTranslateForDisplay**(`content`, `source`, `target`): `Promise`\<[`TranslationResult`](TranslationResult.md) \| `null`\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:146](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/nlp/language/interfaces.ts#L146)

Translate post-generation to user display target (if differs).

#### Parameters

##### content

`string`

##### source

`string`

##### target

`string`

#### Returns

`Promise`\<[`TranslationResult`](TranslationResult.md) \| `null`\>

***

### negotiate()

> **negotiate**(`params`): [`LanguageNegotiationResult`](LanguageNegotiationResult.md)

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:140](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/nlp/language/interfaces.ts#L140)

Determine target/pivot languages given negotiation inputs.

#### Parameters

##### params

[`LanguageNegotiationParams`](LanguageNegotiationParams.md)

#### Returns

[`LanguageNegotiationResult`](LanguageNegotiationResult.md)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:161](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/nlp/language/interfaces.ts#L161)

Graceful shutdown for providers.

#### Returns

`Promise`\<`void`\>

***

### translateQueryForRag()

> **translateQueryForRag**(`query`, `source`, `pivot`): `Promise`\<[`TranslationResult`](TranslationResult.md) \| `null`\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:149](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/nlp/language/interfaces.ts#L149)

Translate query for RAG pivot search.

#### Parameters

##### query

`string`

##### source

`string`

##### pivot

`string`

#### Returns

`Promise`\<[`TranslationResult`](TranslationResult.md) \| `null`\>

***

### translateRagResults()

> **translateRagResults**(`results`, `target`): `Promise`\<`object`[]\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:152](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/nlp/language/interfaces.ts#L152)

Translate retrieved RAG results back to target language.

#### Parameters

##### results

`object`[]

##### target

`string`

#### Returns

`Promise`\<`object`[]\>

***

### translateToolArguments()

> **translateToolArguments**(`args`, `source`, `toolLanguage`): `Promise`\<\{ `providerId?`: `string`; `translatedArgs`: `Record`\<`string`, `any`\>; \} \| `null`\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:155](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/nlp/language/interfaces.ts#L155)

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

***

### translateToolResult()

> **translateToolResult**(`result`, `source`, `target`): `Promise`\<\{ `providerId?`: `string`; `translatedResult`: `any`; \} \| `null`\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:158](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/nlp/language/interfaces.ts#L158)

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
