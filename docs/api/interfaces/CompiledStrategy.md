# Interface: CompiledStrategy

Defined in: [packages/agentos/src/api/types.ts:1563](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1563)

**`Internal`**

Compiled strategy interface used internally by the agency orchestrator.

## Methods

### execute()

> **execute**(`prompt`, `opts?`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/api/types.ts:1570](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1570)

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

Defined in: [packages/agentos/src/api/types.ts:1579](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L1579)

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
