# Interface: EmergentCapabilityEngineDeps

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:115](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L115)

Dependencies injected into the [EmergentCapabilityEngine](../classes/EmergentCapabilityEngine.md) constructor.

All collaborators are provided externally so the engine is trivially testable
with mocks — no real LLM calls, no real sandbox execution.

## Properties

### composableBuilder

> **composableBuilder**: [`ComposableToolBuilder`](../classes/ComposableToolBuilder.md)

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:120](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L120)

Builder for composable (tool-chaining) implementations.

***

### config

> **config**: [`EmergentConfig`](EmergentConfig.md)

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:117](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L117)

Resolved emergent capability configuration.

***

### judge

> **judge**: [`EmergentJudge`](../classes/EmergentJudge.md)

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:126](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L126)

LLM-as-judge evaluator for creation and promotion reviews.

***

### onToolForged()?

> `optional` **onToolForged**: (`tool`, `executable`) => `Promise`\<`void`\>

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:132](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L132)

Optional callback used to activate a newly forged tool immediately.

#### Parameters

##### tool

[`EmergentTool`](EmergentTool.md)

##### executable

[`ITool`](ITool.md)

#### Returns

`Promise`\<`void`\>

***

### onToolPromoted()?

> `optional` **onToolPromoted**: (`tool`) => `Promise`\<`void`\>

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:135](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L135)

Optional callback used when a tool is promoted to a persisted tier.

#### Parameters

##### tool

[`EmergentTool`](EmergentTool.md)

#### Returns

`Promise`\<`void`\>

***

### onToolRemoved()?

> `optional` **onToolRemoved**: (`tool`) => `Promise`\<`void`\>

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:138](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L138)

Optional callback used when a tool is removed from the live runtime.

#### Parameters

##### tool

[`EmergentTool`](EmergentTool.md)

#### Returns

`Promise`\<`void`\>

***

### registry

> **registry**: [`EmergentToolRegistry`](../classes/EmergentToolRegistry.md)

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:129](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L129)

Tiered registry for storing and querying emergent tools.

***

### sandboxForge

> **sandboxForge**: [`SandboxedToolForge`](../classes/SandboxedToolForge.md)

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:123](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L123)

Sandboxed code executor for arbitrary-code implementations.
