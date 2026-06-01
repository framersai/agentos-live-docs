# Interface: FactSupersessionOptions

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts:38](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts#L38)

Options for constructing a [FactSupersession](../classes/FactSupersession.md).

## Properties

### llmInvoker

> **llmInvoker**: `LlmInvoker`

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts:40](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts#L40)

LLM invoker used for the supersession pass.

***

### maxTraces?

> `optional` **maxTraces**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts:42](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts#L42)

Max traces to send to the LLM.

#### Default

```ts
10
```

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts:44](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts#L44)

Max wall-clock ms before timeout fallback.

#### Default

```ts
8000
```
