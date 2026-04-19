# Interface: CostGuardConfig

Defined in: [packages/agentos/src/safety/runtime/CostGuard.ts:10](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/runtime/CostGuard.ts#L10)

## Properties

### maxDailyCostUsd

> **maxDailyCostUsd**: `number`

Defined in: [packages/agentos/src/safety/runtime/CostGuard.ts:14](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/runtime/CostGuard.ts#L14)

Maximum USD spend per agent per day.

#### Default

```ts
5.00
```

***

### maxSessionCostUsd

> **maxSessionCostUsd**: `number`

Defined in: [packages/agentos/src/safety/runtime/CostGuard.ts:12](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/runtime/CostGuard.ts#L12)

Maximum USD spend per agent session.

#### Default

```ts
1.00
```

***

### maxSingleOperationCostUsd

> **maxSingleOperationCostUsd**: `number`

Defined in: [packages/agentos/src/safety/runtime/CostGuard.ts:16](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/runtime/CostGuard.ts#L16)

Maximum USD spend per single operation.

#### Default

```ts
0.50
```

***

### onCapReached()?

> `optional` **onCapReached**: (`agentId`, `capType`, `currentCost`, `limit`) => `void`

Defined in: [packages/agentos/src/safety/runtime/CostGuard.ts:18](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/runtime/CostGuard.ts#L18)

Callback when a cap is hit.

#### Parameters

##### agentId

`string`

##### capType

[`CostCapType`](../type-aliases/CostCapType.md)

##### currentCost

`number`

##### limit

`number`

#### Returns

`void`
