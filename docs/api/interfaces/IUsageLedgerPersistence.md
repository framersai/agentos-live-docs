# Interface: IUsageLedgerPersistence

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:48](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/utils/usage/UsageLedger.ts#L48)

Persistence adapter contract enabling storage engines.

## Methods

### loadAll()

> **loadAll**(): `Promise`\<`UsageBucket`[]\>

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:50](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/utils/usage/UsageLedger.ts#L50)

#### Returns

`Promise`\<`UsageBucket`[]\>

***

### save()

> **save**(`bucket`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:49](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/utils/usage/UsageLedger.ts#L49)

#### Parameters

##### bucket

`UsageBucket`

#### Returns

`Promise`\<`void`\>
