# Interface: HostLLMPolicy

Defined in: [packages/agentos/src/api/runtime/hostPolicy.ts:3](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/runtime/hostPolicy.ts#L3)

## Properties

### allowedProviders?

> `optional` **allowedProviders**: `string`[]

Defined in: [packages/agentos/src/api/runtime/hostPolicy.ts:6](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/runtime/hostPolicy.ts#L6)

***

### cacheDiscipline?

> `optional` **cacheDiscipline**: `"none"` \| `"stable_prefix"` \| `"structured_blocks"`

Defined in: [packages/agentos/src/api/runtime/hostPolicy.ts:9](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/runtime/hostPolicy.ts#L9)

***

### fallbackProviders?

> `optional` **fallbackProviders**: `object`[]

Defined in: [packages/agentos/src/api/runtime/hostPolicy.ts:7](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/runtime/hostPolicy.ts#L7)

#### model?

> `optional` **model**: `string`

#### provider

> **provider**: `string`

***

### optimizationPreference?

> `optional` **optimizationPreference**: `"balanced"` \| `"cost"` \| `"speed"` \| `"quality"`

Defined in: [packages/agentos/src/api/runtime/hostPolicy.ts:4](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/runtime/hostPolicy.ts#L4)

***

### policyTier?

> `optional` **policyTier**: `"safe"` \| `"standard"` \| `"mature"` \| `"private-adult"`

Defined in: [packages/agentos/src/api/runtime/hostPolicy.ts:8](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/runtime/hostPolicy.ts#L8)

***

### requiredCapabilities?

> `optional` **requiredCapabilities**: `string`[]

Defined in: [packages/agentos/src/api/runtime/hostPolicy.ts:5](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/runtime/hostPolicy.ts#L5)
