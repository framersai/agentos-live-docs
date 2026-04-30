# Type Alias: StreamPart

> **StreamPart** = \{ `text`: `string`; `type`: `"text"`; \} \| \{ `args`: `unknown`; `toolName`: `string`; `type`: `"tool-call"`; \} \| \{ `result`: `unknown`; `toolName`: `string`; `type`: `"tool-result"`; \} \| \{ `error`: `Error`; `type`: `"error"`; \}

Defined in: [packages/agentos/src/api/streamText.ts:53](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/streamText.ts#L53)

A discriminated union representing a single event emitted by the
`StreamTextResult.fullStream` iterable.

- `"text"` — incremental token delta from the model.
- `"tool-call"` — the model requested a tool invocation.
- `"tool-result"` — the tool has been executed and the result is available.
- `"error"` — an unrecoverable error occurred; the stream ends after this part.
