# Class: SessionSummarizer

Defined in: [packages/agentos/src/cognition/memory/ingest/SessionSummarizer.ts:155](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/ingest/SessionSummarizer.ts#L155)

LLM-backed session summarizer with a persistent on-disk cache.

## Example

```ts
const summarizer = new SessionSummarizer({
  invoker: async (system, user) => {
    const resp = await reader.invoke({ system, user, maxTokens: 140, temperature: 0 });
    return { text: resp.text, tokensIn: resp.tokensIn, tokensOut: resp.tokensOut, model: resp.model };
  },
  cacheDir: '/path/to/data/.session-summary-cache',
  modelId: 'gpt-5-mini',
});

const summary = await summarizer.summarize('conv-26-session-3', sessionText);
// => "User discussed adopting a new rescue dog from a Portland shelter..."
```

## Constructors

### Constructor

> **new SessionSummarizer**(`opts`): `SessionSummarizer`

Defined in: [packages/agentos/src/cognition/memory/ingest/SessionSummarizer.ts:169](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/ingest/SessionSummarizer.ts#L169)

#### Parameters

##### opts

[`SessionSummarizerOptions`](../interfaces/SessionSummarizerOptions.md)

#### Returns

`SessionSummarizer`

## Properties

### stats

> `readonly` **stats**: [`SummarizerStats`](../interfaces/SummarizerStats.md)

Defined in: [packages/agentos/src/cognition/memory/ingest/SessionSummarizer.ts:157](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/ingest/SessionSummarizer.ts#L157)

Running stats for diagnostics.

## Methods

### computeCacheKey()

> **computeCacheKey**(`sessionText`): `string`

Defined in: [packages/agentos/src/cognition/memory/ingest/SessionSummarizer.ts:240](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/ingest/SessionSummarizer.ts#L240)

Build the SHA-256 cache key from session content + model + template.
Exposed for tests; callers should use [summarize](#summarize).

#### Parameters

##### sessionText

`string`

#### Returns

`string`

***

### getTemplateVersion()

> **getTemplateVersion**(): `string`

Defined in: [packages/agentos/src/cognition/memory/ingest/SessionSummarizer.ts:251](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/ingest/SessionSummarizer.ts#L251)

Expose the resolved template version — useful for cache-key fingerprints in other layers.

#### Returns

`string`

***

### summarize()

> **summarize**(`_sessionKey`, `sessionText`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/cognition/memory/ingest/SessionSummarizer.ts:183](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/ingest/SessionSummarizer.ts#L183)

Summarize a single session. Returns cached result if available,
otherwise calls the LLM and writes to cache.

#### Parameters

##### \_sessionKey

`string`

— a stable identifier for the session (e.g. `${caseId}:${sessionId}`).
                    Used only for logging; the cache key is content-addressed.

##### sessionText

`string`

— the raw text of the session (all turns concatenated).

#### Returns

`Promise`\<`string`\>
