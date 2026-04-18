# Interface: CompiledStrategy

Defined in: [packages/agentos/src/api/types.ts:1335](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types.ts#L1335)

**`Internal`**

Compiled strategy interface used internally by the agency orchestrator.

## Methods

### execute()

> **execute**(`prompt`, `opts?`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/api/types.ts:1342](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types.ts#L1342)

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

Defined in: [packages/agentos/src/api/types.ts:1351](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types.ts#L1351)

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
