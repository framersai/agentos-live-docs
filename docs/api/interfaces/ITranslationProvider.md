# Interface: ITranslationProvider

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:97](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/interfaces.ts#L97)

Pluggable translation provider interface.

## Properties

### id

> `readonly` **id**: `string`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:98](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/interfaces.ts#L98)

***

### isInitialized

> `readonly` **isInitialized**: `boolean`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:99](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/interfaces.ts#L99)

## Methods

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:100](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/interfaces.ts#L100)

#### Returns

`Promise`\<`void`\>

***

### shutdown()?

> `optional` **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:102](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/interfaces.ts#L102)

#### Returns

`Promise`\<`void`\>

***

### translate()

> **translate**(`input`, `source`, `target`, `options?`): `Promise`\<[`TranslationResult`](TranslationResult.md)\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:101](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/nlp/language/interfaces.ts#L101)

#### Parameters

##### input

`string`

##### source

`string`

##### target

`string`

##### options?

[`TranslationOptions`](TranslationOptions.md)

#### Returns

`Promise`\<[`TranslationResult`](TranslationResult.md)\>
