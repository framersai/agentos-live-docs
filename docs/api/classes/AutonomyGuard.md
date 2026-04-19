# Class: AutonomyGuard

Defined in: [packages/agentos/src/provenance/enforcement/AutonomyGuard.ts:17](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/enforcement/AutonomyGuard.ts#L17)

## Constructors

### Constructor

> **new AutonomyGuard**(`config`, `ledger?`): `AutonomyGuard`

Defined in: [packages/agentos/src/provenance/enforcement/AutonomyGuard.ts:22](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/enforcement/AutonomyGuard.ts#L22)

#### Parameters

##### config

[`AutonomyConfig`](../interfaces/AutonomyConfig.md)

##### ledger?

[`SignedEventLedger`](SignedEventLedger.md) | `null`

#### Returns

`AutonomyGuard`

## Methods

### checkHumanAction()

> **checkHumanAction**(`actionType`, `details?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/provenance/enforcement/AutonomyGuard.ts:35](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/enforcement/AutonomyGuard.ts#L35)

Check if a human action is allowed under the current autonomy config.
Throws ProvenanceViolationError if the action is blocked.

#### Parameters

##### actionType

`string`

Type of human action (e.g., 'prompt', 'edit_config', 'add_tool', 'pause', 'stop')

##### details?

`Record`\<`string`, `unknown`\>

Optional details about the action

#### Returns

`Promise`\<`void`\>

***

### isSealed()

> **isSealed**(): `boolean`

Defined in: [packages/agentos/src/provenance/enforcement/AutonomyGuard.ts:123](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/enforcement/AutonomyGuard.ts#L123)

Check if genesis has been recorded.

#### Returns

`boolean`

***

### recordGenesis()

> **recordGenesis**(`genesisEventId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/provenance/enforcement/AutonomyGuard.ts:115](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/enforcement/AutonomyGuard.ts#L115)

Record the genesis event, marking the start of sealed autonomous operation.

#### Parameters

##### genesisEventId

`string`

#### Returns

`Promise`\<`void`\>

***

### wouldAllow()

> **wouldAllow**(`actionType`): `boolean`

Defined in: [packages/agentos/src/provenance/enforcement/AutonomyGuard.ts:131](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/enforcement/AutonomyGuard.ts#L131)

Check whether a specific action type would be blocked.
Returns true if the action is allowed, false if it would be blocked.

#### Parameters

##### actionType

`string`

#### Returns

`boolean`
