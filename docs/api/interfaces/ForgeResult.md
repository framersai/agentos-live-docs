# Interface: ForgeResult

Defined in: [packages/agentos/src/emergent/types.ts:575](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/types.ts#L575)

Result returned after a forge_tool invocation.

On success the new tool is registered and available immediately. On failure
the `verdict` field explains why the judge rejected the tool.

## Properties

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/emergent/types.ts:603](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/types.ts#L603)

Human-readable error message for system-level failures (e.g., sandbox crash,
schema parse error). Distinct from judge rejection — check `verdict` for those.

***

### success

> **success**: `boolean`

Defined in: [packages/agentos/src/emergent/types.ts:579](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/types.ts#L579)

`true` when the tool was forged, judged, and registered successfully.

***

### tool?

> `optional` **tool**: [`EmergentTool`](EmergentTool.md)

Defined in: [packages/agentos/src/emergent/types.ts:590](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/types.ts#L590)

The full emergent tool record, present only when `success` is `true`.

***

### toolId?

> `optional` **toolId**: `string`

Defined in: [packages/agentos/src/emergent/types.ts:585](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/types.ts#L585)

The assigned tool ID, present only when `success` is `true`.

#### Example

```ts
"emergent:a1b2c3d4-e5f6-..."
```

***

### verdict?

> `optional` **verdict**: [`CreationVerdict`](CreationVerdict.md)

Defined in: [packages/agentos/src/emergent/types.ts:597](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/types.ts#L597)

The judge's creation verdict.
Present whether the forge succeeded or was rejected — callers can inspect
`verdict.reasoning` to understand why a rejection occurred.
