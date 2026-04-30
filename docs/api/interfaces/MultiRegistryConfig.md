# Interface: MultiRegistryConfig

Defined in: [packages/agentos/src/extensions/RegistryConfig.ts:44](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/RegistryConfig.ts#L44)

Multi-registry configuration

## Properties

### cacheSettings?

> `optional` **cacheSettings**: `object`

Defined in: [packages/agentos/src/extensions/RegistryConfig.ts:72](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/RegistryConfig.ts#L72)

Global cache settings

#### directory?

> `optional` **directory**: `string`

#### enabled?

> `optional` **enabled**: `boolean`

#### maxAge?

> `optional` **maxAge**: `number`

***

### defaultRegistries?

> `optional` **defaultRegistries**: `object`

Defined in: [packages/agentos/src/extensions/RegistryConfig.ts:55](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/RegistryConfig.ts#L55)

Default registry names for each extension kind
If not specified, uses 'default' registry

#### Index Signature

\[`key`: `string`\]: `string` \| `undefined`

#### guardrail?

> `optional` **guardrail**: `string`

#### persona?

> `optional` **persona**: `string`

#### tool?

> `optional` **tool**: `string`

#### workflow?

> `optional` **workflow**: `string`

***

### registries

> **registries**: `Record`\<`string`, [`RegistrySource`](RegistrySource.md)\>

Defined in: [packages/agentos/src/extensions/RegistryConfig.ts:49](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/RegistryConfig.ts#L49)

Named registries that can be referenced
Key is the registry name, value is the source config

***

### resolver()?

> `optional` **resolver**: (`kind`) => `string` \| `null`

Defined in: [packages/agentos/src/extensions/RegistryConfig.ts:67](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/RegistryConfig.ts#L67)

Resolver function to determine which registry to use for a given kind
Overrides defaultRegistries if provided

#### Parameters

##### kind

`string`

#### Returns

`string` \| `null`
