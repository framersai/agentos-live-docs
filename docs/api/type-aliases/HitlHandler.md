# Type Alias: HitlHandler()

> **HitlHandler** = (`request`) => `Promise`\<[`ApprovalDecision`](../interfaces/ApprovalDecision.md)\>

Defined in: [packages/agentos/src/api/hitl.ts:45](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/hitl.ts#L45)

An async function that receives an [ApprovalRequest](../interfaces/ApprovalRequest.md) and resolves to
an [ApprovalDecision](../interfaces/ApprovalDecision.md).  Assign to `HitlConfig.handler`.

## Parameters

### request

[`ApprovalRequest`](../interfaces/ApprovalRequest.md)

## Returns

`Promise`\<[`ApprovalDecision`](../interfaces/ApprovalDecision.md)\>
