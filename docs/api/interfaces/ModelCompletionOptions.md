# Interface: ModelCompletionOptions

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:506](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L506)

Options for LLM completion, compatible with IProvider.ModelCompletionOptions.

## Interface

ModelCompletionOptions

## Extends

- `Record`\<`string`, `any`\>

## Indexable

\[`key`: `string`\]: `any`

## Properties

### frequencyPenalty?

> `optional` **frequencyPenalty**: `number`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:512](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L512)

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:508](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L508)

***

### presencePenalty?

> `optional` **presencePenalty**: `number`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:511](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L511)

***

### responseFormat?

> `optional` **responseFormat**: `object`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:514](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L514)

#### type

> **type**: `"text"` \| `"json_object"`

***

### stopSequences?

> `optional` **stopSequences**: `string`[]

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:513](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L513)

***

### stream?

> `optional` **stream**: `boolean`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:515](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L515)

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:507](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L507)

***

### toolChoice?

> `optional` **toolChoice**: `any`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:518](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L518)

***

### tools?

> `optional` **tools**: `any`[]

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:517](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L517)

***

### topK?

> `optional` **topK**: `number`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:510](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L510)

***

### topP?

> `optional` **topP**: `number`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:509](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L509)

***

### userId?

> `optional` **userId**: `string`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:516](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L516)
