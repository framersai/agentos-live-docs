# Interface: CompiledStrategy

Defined in: [packages/agentos/src/api/types.ts:1330](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L1330)

**`Internal`**

Compiled strategy interface used internally by the agency orchestrator.

## Methods

### execute()

> **execute**(`prompt`, `opts?`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/api/types.ts:1337](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L1337)

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

Defined in: [packages/agentos/src/api/types.ts:1346](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L1346)

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
