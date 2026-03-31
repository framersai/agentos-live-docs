# Interface: AgencyStreamResult

Defined in: [packages/agentos/src/api/types.ts:764](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L764)

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

Defined in: [packages/agentos/src/api/types.ts:784](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L784)

Final per-agent execution ledger for the streamed run.

***

### finalTextStream

> **finalTextStream**: `AsyncIterable`\<`string`\>

Defined in: [packages/agentos/src/api/types.ts:796](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L796)

Finalized approved-only text stream.

Unlike `textStream`, this yields only the post-guardrail/post-HITL answer.
For most runs it emits a single finalized chunk.

***

### fullStream

> **fullStream**: `AsyncIterable`\<[`AgencyStreamPart`](../type-aliases/AgencyStreamPart.md)\>

Defined in: [packages/agentos/src/api/types.ts:773](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L773)

Structured live + finalized event stream.

This includes raw text/tool/lifecycle events and also the finalized
`final-output` event after post-processing completes.

***

### parsed

> **parsed**: `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/api/types.ts:789](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L789)

Final structured payload; resolves to `undefined` when structured output
was not configured for the run.

***

### text

> **text**: `Promise`\<`string`\>

Defined in: [packages/agentos/src/api/types.ts:775](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L775)

Finalized scalar text after guardrails, HITL, and parsing hooks.

***

### textStream

> **textStream**: `AsyncIterable`\<`string`\>

Defined in: [packages/agentos/src/api/types.ts:766](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L766)

Raw live text chunks from the underlying strategy.

***

### usage

> **usage**: `Promise`\<\{ `completionTokens`: `number`; `costUSD?`: `number`; `promptTokens`: `number`; `totalTokens`: `number`; \}\>

Defined in: [packages/agentos/src/api/types.ts:777](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L777)

Final aggregate usage for the streamed run.
