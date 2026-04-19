# Interface: CompiledStrategy

Defined in: [packages/agentos/src/api/types.ts:1347](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types.ts#L1347)

**`Internal`**

Compiled strategy interface used internally by the agency orchestrator.

## Methods

### execute()

> **execute**(`prompt`, `opts?`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/api/types.ts:1354](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types.ts#L1354)

Execute the compiled strategy and return the aggregated result.

#### Parameters

##### prompt

`string`

User prompt.

##### opts?

`Record`\<`string`, `unknown`\>

Optional per-call overrides.

#### Returns

`Promise`\<`unknown`\>

***

### stream()

> **stream**(`prompt`, `opts?`): [`CompiledStrategyStreamResult`](CompiledStrategyStreamResult.md)

Defined in: [packages/agentos/src/api/types.ts:1363](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types.ts#L1363)

Stream the compiled strategy execution.

#### Parameters

##### prompt

`string`

User prompt.

##### opts?

`Record`\<`string`, `unknown`\>

Optional per-call overrides.

#### Returns

[`CompiledStrategyStreamResult`](CompiledStrategyStreamResult.md)

The internal strategy stream surface consumed by the outer
  `agency()` wrapper.
