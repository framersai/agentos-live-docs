# Class: TypedNetworkObserver

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkObserver.ts:94](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkObserver.ts#L94)

The 6-step extractor. Stateless aside from its constructor options;
safe to share across concurrent extractions.

## Constructors

### Constructor

> **new TypedNetworkObserver**(`options`): `TypedNetworkObserver`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkObserver.ts:100](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkObserver.ts#L100)

#### Parameters

##### options

[`TypedNetworkObserverOptions`](../interfaces/TypedNetworkObserverOptions.md)

#### Returns

`TypedNetworkObserver`

## Methods

### extract()

> **extract**(`sessionText`, `sessionId`): `Promise`\<[`TypedFact`](../interfaces/TypedFact.md)[]\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkObserver.ts:126](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkObserver.ts#L126)

Extract typed facts from a conversation block.

Resulting facts have stable IDs of the form
`<sessionId>-fact-<index>`, where `<index>` is the sequential
POST-DROP position so dropped facts produce contiguous IDs in the
returned array.

**Never throws on extractable input.** Catastrophic outer parse
failures (invalid JSON, primitive value, missing facts key) get
one retry; persistent failure returns `[]`. Bad individual facts
are dropped silently via per-fact `safeParse`.

#### Parameters

##### sessionText

`string`

Full conversation text. Will be wrapped in
  the user prompt's delimiters automatically.

##### sessionId

`string`

Stable identifier used to namespace the
  resulting fact IDs.

#### Returns

`Promise`\<[`TypedFact`](../interfaces/TypedFact.md)[]\>

Array of [TypedFact](../interfaces/TypedFact.md)s, possibly empty.
