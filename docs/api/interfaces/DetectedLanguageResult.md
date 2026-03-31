# Interface: DetectedLanguageResult

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:16](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/nlp/language/interfaces.ts#L16)

Represents a single language confidence result.
Code SHOULD be a BCP-47 or ISO 639-1 code (e.g. "en", "en-US", "es", "fr-FR").

## Properties

### code

> **code**: `string`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:18](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/nlp/language/interfaces.ts#L18)

Detected language code (BCP-47 preferred; may degrade to ISO 639-1).

***

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:20](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/nlp/language/interfaces.ts#L20)

Confidence score in range [0,1].

***

### providerMetadata?

> `optional` **providerMetadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:22](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/nlp/language/interfaces.ts#L22)

Optional provider-specific metadata (raw probabilities, tokens, etc.).
