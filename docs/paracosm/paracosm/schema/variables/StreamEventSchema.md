# Variable: StreamEventSchema

> `const` **StreamEventSchema**: `ZodDiscriminatedUnion`\<\[`ZodObject`\<\{ `data`: `ZodObject`\<\{ `births`: `ZodOptional`\<`ZodNumber`\>; `category`: `ZodOptional`\<`ZodString`\>; `crisis`: `ZodOptional`\<`ZodString`\>; `deaths`: `ZodOptional`\<`ZodNumber`\>; `description`: `ZodOptional`\<`ZodString`\>; `emergent`: `ZodOptional`\<`ZodBoolean`\>; `metrics`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodNumber`\>\>; `pacing`: `ZodOptional`\<`ZodUnknown`\>; `summary`: `ZodOptional`\<`ZodString`\>; `title`: `ZodOptional`\<`ZodString`\>; `totalEvents`: `ZodOptional`\<`ZodNumber`\>; `turnSummary`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>; `leader`: `ZodString`; `time`: `ZodOptional`\<`ZodNumber`\>; `turn`: `ZodOptional`\<`ZodNumber`\>; `type`: `ZodLiteral`\<`string`\>; \}, `$strip`\>, `ZodObject`\<\{ `data`: `ZodObject`\<\{ `category`: `ZodString`; `description`: `ZodOptional`\<`ZodString`\>; `emergent`: `ZodOptional`\<`ZodBoolean`\>; `eventIndex`: `ZodNumber`; `pacing`: `ZodOptional`\<`ZodUnknown`\>; `summary`: `ZodOptional`\<`ZodString`\>; `title`: `ZodString`; `totalEvents`: `ZodNumber`; `turnSummary`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>; `leader`: `ZodString`; `time`: `ZodOptional`\<`ZodNumber`\>; `turn`: `ZodOptional`\<`ZodNumber`\>; `type`: `ZodLiteral`\<`string`\>; \}, `$strip`\>, `ZodObject`\<\{ `data`: `ZodObject`\<\{ `department`: `ZodString`; `eventIndex`: `ZodNumber`; `summary`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>; `leader`: `ZodString`; `time`: `ZodOptional`\<`ZodNumber`\>; `turn`: `ZodOptional`\<`ZodNumber`\>; `type`: `ZodLiteral`\<`string`\>; \}, `$strip`\>\], `"type"`\>

Defined in: [apps/paracosm/src/engine/schema/stream.ts:239](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/stream.ts#L239)

Every SSE event emitted by `runSimulation` validates against this
union. Consumers `switch` on `event.type` for full narrow-typed access
to `event.data` fields.

## Example

```ts
import { StreamEventSchema } from 'paracosm/schema';

for await (const raw of sse) {
  const event = StreamEventSchema.parse(JSON.parse(raw));
  switch (event.type) {
    case 'outcome':         console.log(event.data.systemDeltas); break;
    case 'decision_made':   console.log(event.data.rationale); break;
    case 'provider_error':  console.error(event.data.kind, event.data.message); break;
  }
}
```
