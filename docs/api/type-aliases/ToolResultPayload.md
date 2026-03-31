# Type Alias: ToolResultPayload

> **ToolResultPayload** = \{ `result`: `any`; `type`: `"success"`; \} \| \{ `error`: \{ `code`: `string`; `details?`: `any`; `message`: `string`; \}; `type`: `"error"`; \}

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:108](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/cognitive_substrate/IGMI.ts#L108)

**`Export`**

Payload for providing tool results, abstracting success/error.

## Interface

ToolResultPayload
