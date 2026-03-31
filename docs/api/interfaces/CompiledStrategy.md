# Interface: CompiledStrategy

Defined in: [packages/agentos/src/api/types.ts:1136](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1136)

**`Internal`**

Compiled strategy interface used internally by the agency orchestrator.

## Methods

### execute()

> **execute**(`prompt`, `opts?`): `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/api/types.ts:1143](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1143)

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

Defined in: [packages/agentos/src/api/types.ts:1152](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L1152)

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
