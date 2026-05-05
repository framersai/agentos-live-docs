# Interface: AgencyStreamResult

Defined in: [packages/agentos/src/api/types.ts:1026](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1026)

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

Defined in: [packages/agentos/src/api/types.ts:1048](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1048)

Final per-agent execution ledger for the streamed run.

***

### finalTextStream

> **finalTextStream**: `AsyncIterable`\<`string`\>

Defined in: [packages/agentos/src/api/types.ts:1060](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1060)

Finalized approved-only text stream.

Unlike `textStream`, this yields only the post-guardrail/post-HITL answer.
For most runs it emits a single finalized chunk.

***

### fullStream

> **fullStream**: `AsyncIterable`\<[`AgencyStreamPart`](../type-aliases/AgencyStreamPart.md)\>

Defined in: [packages/agentos/src/api/types.ts:1035](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1035)

Structured live + finalized event stream.

This includes raw text/tool/lifecycle events and also the finalized
`final-output` event after post-processing completes.

***

### parsed

> **parsed**: `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/api/types.ts:1053](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1053)

Final structured payload; resolves to `undefined` when structured output
was not configured for the run.

***

### text

> **text**: `Promise`\<`string`\>

Defined in: [packages/agentos/src/api/types.ts:1037](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1037)

Finalized scalar text after guardrails, HITL, and parsing hooks.

***

### textStream

> **textStream**: `AsyncIterable`\<`string`\>

Defined in: [packages/agentos/src/api/types.ts:1028](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1028)

Raw live text chunks from the underlying strategy.

***

### usage

> **usage**: `Promise`\<\{ `cacheCreationTokens?`: `number`; `cacheReadTokens?`: `number`; `completionTokens`: `number`; `costUSD?`: `number`; `promptTokens`: `number`; `totalTokens`: `number`; \}\>

Defined in: [packages/agentos/src/api/types.ts:1039](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L1039)

Final aggregate usage for the streamed run.
