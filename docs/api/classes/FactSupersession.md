# Class: FactSupersession

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts:94](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts#L94)

Post-retrieval fact supersession filter.

## Example

```ts
const fs = new FactSupersession({
  llmInvoker: async (system, user) => (await reader.invoke({ system, user, maxTokens: 200, temperature: 0 })).text,
});
const result = await fs.resolve({ traces: retrieval.retrieved, query: caseQuery });
// Feed `result.traces` to the reader instead of `retrieval.retrieved`.
```

## Constructors

### Constructor

> **new FactSupersession**(`opts`): `FactSupersession`

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts:99](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts#L99)

#### Parameters

##### opts

[`FactSupersessionOptions`](../interfaces/FactSupersessionOptions.md)

#### Returns

`FactSupersession`

## Methods

### resolve()

> **resolve**(`input`): `Promise`\<[`FactSupersessionResult`](../interfaces/FactSupersessionResult.md)\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts:105](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts#L105)

#### Parameters

##### input

[`FactSupersessionInput`](../interfaces/FactSupersessionInput.md)

#### Returns

`Promise`\<[`FactSupersessionResult`](../interfaces/FactSupersessionResult.md)\>
