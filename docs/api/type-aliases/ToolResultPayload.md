# Type Alias: ToolResultPayload

> **ToolResultPayload** = \{ `result`: `any`; `type`: `"success"`; \} \| \{ `error`: \{ `code`: `string`; `details?`: `any`; `message`: `string`; \}; `type`: `"error"`; \}

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:108](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/cognitive_substrate/IGMI.ts#L108)

**`Export`**

Payload for providing tool results, abstracting success/error.

## Interface

ToolResultPayload
