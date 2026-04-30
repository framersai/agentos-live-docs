# Type Alias: ToolResultPayload

> **ToolResultPayload** = \{ `result`: `any`; `type`: `"success"`; \} \| \{ `error`: \{ `code`: `string`; `details?`: `any`; `message`: `string`; \}; `type`: `"error"`; \}

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:108](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/cognitive_substrate/IGMI.ts#L108)

**`Export`**

Payload for providing tool results, abstracting success/error.

## Interface

ToolResultPayload
