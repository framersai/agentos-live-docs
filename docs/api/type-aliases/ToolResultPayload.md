# Type Alias: ToolResultPayload

> **ToolResultPayload** = \{ `result`: `any`; `type`: `"success"`; \} \| \{ `error`: \{ `code`: `string`; `details?`: `any`; `message`: `string`; \}; `type`: `"error"`; \}

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:108](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/IGMI.ts#L108)

**`Export`**

Payload for providing tool results, abstracting success/error.

## Interface

ToolResultPayload
