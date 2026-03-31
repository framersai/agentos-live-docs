# Class: TopicExtractor

Defined in: [packages/agentos/src/query-router/TopicExtractor.ts:58](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/TopicExtractor.ts#L58)

Extracts a compact, deduplicated topic list from a set of corpus chunks.

Designed to feed into the QueryClassifier's system prompt so the LLM
knows which documentation topics exist without receiving the full corpus.

## Example

```typescript
const extractor = new TopicExtractor();
const topics = extractor.extract(corpusChunks, { maxTopics: 30 });
const promptBlock = extractor.formatForPrompt(topics);
// "Authentication (docs/auth.md)\nDatabase (docs/database.md)\n..."
```

## Constructors

### Constructor

> **new TopicExtractor**(): `TopicExtractor`

#### Returns

`TopicExtractor`

## Methods

### extract()

> **extract**(`chunks`, `options?`): [`TopicEntry`](../interfaces/TopicEntry.md)[]

Defined in: [packages/agentos/src/query-router/TopicExtractor.ts:70](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/TopicExtractor.ts#L70)

Extract a deduplicated, sorted, and capped topic list from corpus chunks.

Deduplication key: `heading::sourcePath`. Two chunks with the same
heading from the same source file are collapsed into a single entry.

#### Parameters

##### chunks

[`CorpusChunk`](../interfaces/CorpusChunk.md)[]

Corpus chunks to scan for topics.

##### options?

`TopicExtractorOptions`

Optional extraction parameters.

#### Returns

[`TopicEntry`](../interfaces/TopicEntry.md)[]

Alphabetically sorted array of unique [TopicEntry](../interfaces/TopicEntry.md) items,
         limited to `maxTopics` entries.

***

### formatForPrompt()

> **formatForPrompt**(`topics`): `string`

Defined in: [packages/agentos/src/query-router/TopicExtractor.ts:112](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/TopicExtractor.ts#L112)

Format a topic list into a compact multi-line string suitable for
injection into a classifier system prompt.

Each line follows the pattern: `TopicName (source/path.md)`

#### Parameters

##### topics

[`TopicEntry`](../interfaces/TopicEntry.md)[]

Array of topic entries to format.

#### Returns

`string`

Newline-separated string with one topic per line.
