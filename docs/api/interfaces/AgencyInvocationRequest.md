# Interface: AgencyInvocationRequest

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:56](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types/AgentOSInput.ts#L56)

Describes a request to create or join an Agency (multi-GMI collective).

## Properties

### agencyId?

> `optional` **agencyId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:60](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types/AgentOSInput.ts#L60)

Existing agency identifier to join. If omitted, a new agency is instantiated.

***

### goal?

> `optional` **goal**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:68](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types/AgentOSInput.ts#L68)

High-level description of the shared objective.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:76](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types/AgentOSInput.ts#L76)

Arbitrary metadata for agency initialization.

***

### participants?

> `optional` **participants**: `object`[]

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:72](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types/AgentOSInput.ts#L72)

Desired seats within the agency along with their preferred personas.

#### personaId?

> `optional` **personaId**: `string`

#### roleId

> **roleId**: `string`

***

### workflowId?

> `optional` **workflowId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:64](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types/AgentOSInput.ts#L64)

Optional workflow identifier to bind the agency to.
