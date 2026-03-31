# Interface: ITranslationProvider

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:97](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/nlp/language/interfaces.ts#L97)

Pluggable translation provider interface.

## Properties

### id

> `readonly` **id**: `string`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:98](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/nlp/language/interfaces.ts#L98)

***

### isInitialized

> `readonly` **isInitialized**: `boolean`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:99](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/nlp/language/interfaces.ts#L99)

## Methods

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:100](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/nlp/language/interfaces.ts#L100)

#### Returns

`Promise`\<`void`\>

***

### shutdown()?

> `optional` **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:102](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/nlp/language/interfaces.ts#L102)

#### Returns

`Promise`\<`void`\>

***

### translate()

> **translate**(`input`, `source`, `target`, `options?`): `Promise`\<[`TranslationResult`](TranslationResult.md)\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:101](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/nlp/language/interfaces.ts#L101)

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
