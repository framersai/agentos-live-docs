# Interface: CompiledStrategy

Defined in: [packages/agentos/src/api/types.ts:1061](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L1061)

**`Internal`**

Compiled strategy interface used internally by the agency orchestrator.

## Methods

### execute()

> **execute**(`prompt`, `opts?`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/api/types.ts:1068](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L1068)

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

Defined in: [packages/agentos/src/api/types.ts:1077](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L1077)

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
