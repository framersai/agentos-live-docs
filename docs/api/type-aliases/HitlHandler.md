# Type Alias: HitlHandler()

> **HitlHandler** = (`request`) => `Promise`\<[`ApprovalDecision`](../interfaces/ApprovalDecision.md)\>

Defined in: [packages/agentos/src/api/hitl.ts:44](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/hitl.ts#L44)

An async function that receives an [ApprovalRequest](../interfaces/ApprovalRequest.md) and resolves to
an [ApprovalDecision](../interfaces/ApprovalDecision.md).  Assign to `HitlConfig.handler`.

## Parameters

### request

[`ApprovalRequest`](../interfaces/ApprovalRequest.md)

## Returns

`Promise`\<[`ApprovalDecision`](../interfaces/ApprovalDecision.md)\>
