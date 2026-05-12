# Interface: TypedNetworkRetrieverOptions

Defined in: [packages/agentos/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts:57](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts#L57)

Construction options.

## Properties

### activationThreshold?

> `optional` **activationThreshold**: `number`

Defined in: [packages/agentos/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts:65](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts#L65)

Activation cutoff for spreading. Default 0.05.

***

### maxDepth?

> `optional` **maxDepth**: `number`

Defined in: [packages/agentos/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts:63](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts#L63)

Maximum hops for spreading activation. Default 3.

***

### spreading

> **spreading**: [`TypedSpreadingActivation`](../classes/TypedSpreadingActivation.md)

Defined in: [packages/agentos/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts:61](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts#L61)

Pre-constructed spreading-activation engine.

***

### store

> **store**: [`TypedNetworkStore`](../classes/TypedNetworkStore.md)

Defined in: [packages/agentos/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts:59](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts#L59)

The typed-network store populated at ingest time.
