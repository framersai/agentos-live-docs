# Interface: IUsageLedgerPersistence

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:35](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/utils/usage/UsageLedger.ts#L35)

Persistence adapter contract enabling storage engines.

## Methods

### loadAll()

> **loadAll**(): `Promise`\<`UsageBucket`[]\>

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:37](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/utils/usage/UsageLedger.ts#L37)

#### Returns

`Promise`\<`UsageBucket`[]\>

***

### save()

> **save**(`bucket`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:36](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/utils/usage/UsageLedger.ts#L36)

#### Parameters

##### bucket

`UsageBucket`

#### Returns

`Promise`\<`void`\>
