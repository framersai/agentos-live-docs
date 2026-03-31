# Interface: GMIManagerConfig

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:51](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/GMIManager.ts#L51)

Configuration options for the GMIManager.

## Properties

### cognitiveMemoryFactory?

> `optional` **cognitiveMemoryFactory**: [`GMICognitiveMemoryFactory`](../type-aliases/GMICognitiveMemoryFactory.md)

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:59](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/GMIManager.ts#L59)

Optional per-GMI cognitive memory factory used by devtools and advanced runtimes.

***

### defaultGMIBaseConfigDefaults?

> `optional` **defaultGMIBaseConfigDefaults**: `Partial`\<`Pick`\<[`GMIBaseConfig`](GMIBaseConfig.md), `"defaultLlmProviderId"` \| `"defaultLlmModelId"` \| `"customSettings"`\>\>

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:55](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/GMIManager.ts#L55)

***

### defaultGMIInactivityCleanupMinutes?

> `optional` **defaultGMIInactivityCleanupMinutes**: `number`

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:53](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/GMIManager.ts#L53)

***

### defaultWorkingMemoryType?

> `optional` **defaultWorkingMemoryType**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:54](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/GMIManager.ts#L54)

***

### personaLoaderConfig

> **personaLoaderConfig**: `PersonaLoaderConfig`

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:52](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/GMIManager.ts#L52)

***

### personaValidationStrict?

> `optional` **personaValidationStrict**: `PersonaValidationStrictConfig`

Defined in: [packages/agentos/src/cognitive\_substrate/GMIManager.ts:57](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/GMIManager.ts#L57)

Strict validation enforcement configuration (optional, defaults to permissive).
