# Interface: AgencyStreamResult

Defined in: [packages/agentos/src/api/types.ts:956](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L956)

Public stream result returned by `agency().stream(...)`.

This exposes both low-latency raw streaming and finalized post-processing
results so callers can choose the right trade-off for their UI or runtime.

Prefer:
- `textStream` for raw token-by-token UX
- `fullStream` for structured lifecycle events
- `text` or `finalTextStream` for the finalized approved answer

`textStream` may differ from the finalized answer when output guardrails or
`beforeReturn` HITL rewrite the result. `finalTextStream` and `text` always
reflect the finalized post-processing output.

## Example

```ts
const stream = team.stream('Summarize HTTP/3 rollout risks.');

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk); // raw live output
}

for await (const approved of stream.finalTextStream) {
  console.log('Approved answer:', approved);
}

console.log(await stream.agentCalls);
console.log(await stream.text);
```

## Properties

### agentCalls

> **agentCalls**: `Promise`\<[`AgentCallRecord`](AgentCallRecord.md)[]\>

Defined in: [packages/agentos/src/api/types.ts:976](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L976)

Final per-agent execution ledger for the streamed run.

***

### finalTextStream

> **finalTextStream**: `AsyncIterable`\<`string`\>

Defined in: [packages/agentos/src/api/types.ts:988](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L988)

Finalized approved-only text stream.

Unlike `textStream`, this yields only the post-guardrail/post-HITL answer.
For most runs it emits a single finalized chunk.

***

### fullStream

> **fullStream**: `AsyncIterable`\<[`AgencyStreamPart`](../type-aliases/AgencyStreamPart.md)\>

Defined in: [packages/agentos/src/api/types.ts:965](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L965)

Structured live + finalized event stream.

This includes raw text/tool/lifecycle events and also the finalized
`final-output` event after post-processing completes.

***

### parsed

> **parsed**: `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/api/types.ts:981](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L981)

Final structured payload; resolves to `undefined` when structured output
was not configured for the run.

***

### text

> **text**: `Promise`\<`string`\>

Defined in: [packages/agentos/src/api/types.ts:967](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L967)

Finalized scalar text after guardrails, HITL, and parsing hooks.

***

### textStream

> **textStream**: `AsyncIterable`\<`string`\>

Defined in: [packages/agentos/src/api/types.ts:958](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L958)

Raw live text chunks from the underlying strategy.

***

### usage

> **usage**: `Promise`\<\{ `completionTokens`: `number`; `costUSD?`: `number`; `promptTokens`: `number`; `totalTokens`: `number`; \}\>

Defined in: [packages/agentos/src/api/types.ts:969](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L969)

Final aggregate usage for the streamed run.
