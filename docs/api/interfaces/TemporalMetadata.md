# Interface: TemporalMetadata

Defined in: [packages/agentos/src/memory/pipeline/observation/temporal.ts:23](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/observation/temporal.ts#L23)

Three-date temporal model attached to memory traces.

- `referencedAt` — when the event the memory refers to actually occurred.
- `relativeLabel` — human-friendly relative time description.
- `span` — optional time range if the memory covers a period.

## Properties

### referencedAt?

> `optional` **referencedAt**: `number`

Defined in: [packages/agentos/src/memory/pipeline/observation/temporal.ts:25](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/observation/temporal.ts#L25)

When the event this memory refers to actually happened (Unix ms).

***

### relativeLabel?

> `optional` **relativeLabel**: `string`

Defined in: [packages/agentos/src/memory/pipeline/observation/temporal.ts:27](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/observation/temporal.ts#L27)

Human-friendly relative time label, e.g. "last Tuesday".

***

### span?

> `optional` **span**: \[`number`, `number`\]

Defined in: [packages/agentos/src/memory/pipeline/observation/temporal.ts:29](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/pipeline/observation/temporal.ts#L29)

Time span if this covers a period: [startMs, endMs].
