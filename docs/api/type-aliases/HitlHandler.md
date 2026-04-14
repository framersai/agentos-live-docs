# Type Alias: HitlHandler()

> **HitlHandler** = (`request`) => `Promise`\<[`ApprovalDecision`](../interfaces/ApprovalDecision.md)\>

Defined in: [packages/agentos/src/api/hitl.ts:45](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/hitl.ts#L45)

An async function that receives an [ApprovalRequest](../interfaces/ApprovalRequest.md) and resolves to
an [ApprovalDecision](../interfaces/ApprovalDecision.md).  Assign to `HitlConfig.handler`.

## Parameters

### request

[`ApprovalRequest`](../interfaces/ApprovalRequest.md)

## Returns

`Promise`\<[`ApprovalDecision`](../interfaces/ApprovalDecision.md)\>
