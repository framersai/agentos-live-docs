# Type Alias: StreamPart

> **StreamPart** = \{ `text`: `string`; `type`: `"text"`; \} \| \{ `args`: `unknown`; `toolName`: `string`; `type`: `"tool-call"`; \} \| \{ `result`: `unknown`; `toolName`: `string`; `type`: `"tool-result"`; \} \| \{ `error`: `Error`; `type`: `"error"`; \}

Defined in: [packages/agentos/src/api/streamText.ts:52](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamText.ts#L52)

A discriminated union representing a single event emitted by the
`StreamTextResult.fullStream` iterable.

- `"text"` — incremental token delta from the model.
- `"tool-call"` — the model requested a tool invocation.
- `"tool-result"` — the tool has been executed and the result is available.
- `"error"` — an unrecoverable error occurred; the stream ends after this part.
