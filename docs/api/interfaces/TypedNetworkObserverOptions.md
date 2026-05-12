# Interface: TypedNetworkObserverOptions

Defined in: [packages/agentos/src/memory/retrieval/typed-network/TypedNetworkObserver.ts:66](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/TypedNetworkObserver.ts#L66)

Construction options for the observer.

## Properties

### llm

> **llm**: [`ITypedExtractionLLM`](ITypedExtractionLLM.md)

Defined in: [packages/agentos/src/memory/retrieval/typed-network/TypedNetworkObserver.ts:68](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/TypedNetworkObserver.ts#L68)

LLM adapter implementing the 6-step extraction call.

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [packages/agentos/src/memory/retrieval/typed-network/TypedNetworkObserver.ts:70](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/TypedNetworkObserver.ts#L70)

Max output tokens. Default 4096 (Hindsight extractions are typically 50-200 facts × ~30 tokens each).

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [packages/agentos/src/memory/retrieval/typed-network/TypedNetworkObserver.ts:72](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/TypedNetworkObserver.ts#L72)

Temperature. Default 0 for deterministic extraction.

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/memory/retrieval/typed-network/TypedNetworkObserver.ts:80](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/TypedNetworkObserver.ts#L80)

Per-attempt request timeout in milliseconds. When the underlying
`llm.invoke()` does not resolve within this window the attempt is
abandoned and the observer falls through to the retry path. Used
to prevent stale TCP sockets / hung OpenAI requests from
deadlocking long-running ingest pipelines. Default 30 000 ms (30 s).
