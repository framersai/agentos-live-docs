# Interface: TranslationOptions

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:76](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/nlp/language/interfaces.ts#L76)

Options for translation calls.

## Properties

### abortSignal?

> `optional` **abortSignal**: `AbortSignal`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:83](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/nlp/language/interfaces.ts#L83)

Abort controller for cancellation semantics.

***

### domain?

> `optional` **domain**: [`TranslationDomain`](../type-aliases/TranslationDomain.md)

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:77](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/nlp/language/interfaces.ts#L77)

***

### preserveFormatting?

> `optional` **preserveFormatting**: `boolean`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:79](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/nlp/language/interfaces.ts#L79)

Preserve markdown/code fencing.

***

### streamingCallback()?

> `optional` **streamingCallback**: (`delta`) => `void`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:81](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/nlp/language/interfaces.ts#L81)

If streaming incremental translation is desired (phase 2).

#### Parameters

##### delta

`string`

#### Returns

`void`
