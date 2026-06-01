# Interface: ITypedExtractionLLM

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkObserver.ts:54](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkObserver.ts#L54)

Provider-agnostic LLM interface for the extractor. Matches the
shape used elsewhere in agentos for classifier / observer LLM
adapters: a single `invoke(args)` async method returning the raw
text response. Implementations wrap OpenAI, Anthropic, local
models, or test mocks.

## Methods

### invoke()

> **invoke**(`args`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkObserver.ts:55](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkObserver.ts#L55)

#### Parameters

##### args

###### maxTokens

`number`

###### system

`string`

###### temperature

`number`

###### user

`string`

#### Returns

`Promise`\<`string`\>
