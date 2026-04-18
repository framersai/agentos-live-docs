# Type Alias: ToolResultPayload

> **ToolResultPayload** = \{ `result`: `any`; `type`: `"success"`; \} \| \{ `error`: \{ `code`: `string`; `details?`: `any`; `message`: `string`; \}; `type`: `"error"`; \}

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:108](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/cognitive_substrate/IGMI.ts#L108)

**`Export`**

Payload for providing tool results, abstracting success/error.

## Interface

ToolResultPayload
