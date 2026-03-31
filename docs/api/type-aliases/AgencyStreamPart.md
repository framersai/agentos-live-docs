# Type Alias: AgencyStreamPart

> **AgencyStreamPart** = \{ `agent?`: `string`; `text`: `string`; `type`: `"text"`; \} \| \{ `agent?`: `string`; `args`: `unknown`; `toolName`: `string`; `type`: `"tool-call"`; \} \| \{ `agent?`: `string`; `result`: `unknown`; `toolName`: `string`; `type`: `"tool-result"`; \} \| \{ `agent?`: `string`; `error`: `Error`; `type`: `"error"`; \} \| \{ `agent`: `string`; `input`: `string`; `type`: `"agent-start"`; \} \| \{ `agent`: `string`; `durationMs`: `number`; `output`: `string`; `type`: `"agent-end"`; \} \| \{ `fromAgent`: `string`; `reason`: `string`; `toAgent`: `string`; `type`: `"agent-handoff"`; \} \| \{ `chosen`: `string`; `original`: `string`; `reason`: `string`; `type`: `"strategy-override"`; \} \| \{ `agentName`: `string`; `approved`: `boolean`; `instructions`: `string`; `type`: `"emergent-forge"`; \} \| \{ `action`: `string`; `agent`: `string`; `guardrailId`: `string`; `passed`: `boolean`; `type`: `"guardrail-result"`; \} \| \{ `request`: [`ApprovalRequest`](../interfaces/ApprovalRequest.md); `type`: `"approval-requested"`; \} \| \{ `approved`: `boolean`; `requestId`: `string`; `type`: `"approval-decided"`; \} \| \{ `agentCalls`: [`AgentCallRecord`](../interfaces/AgentCallRecord.md)[]; `durationMs`: `number`; `parsed?`: `unknown`; `text`: `string`; `type`: `"final-output"`; `usage`: \{ `completionTokens`: `number`; `costUSD?`: `number`; `promptTokens`: `number`; `totalTokens`: `number`; \}; \} \| \{ `action`: `string`; `agent`: `string`; `reason`: `string`; `type`: `"permission-denied"`; \}

Defined in: [packages/agentos/src/api/types.ts:671](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L671)

Discriminated union of all streaming events emitted by an `agency()` stream.
A superset of the base `StreamPart` type — includes all text/tool events
plus agency-level lifecycle events and the finalized post-processing snapshot.

`text` parts are low-latency raw stream chunks. The finalized approved answer
is surfaced separately through the `final-output` part, `AgencyStreamResult.text`,
and `AgencyStreamResult.finalTextStream`.
