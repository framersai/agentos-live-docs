# Interface: VectorStoreManagerHealthReport

Defined in: [packages/agentos/src/core/vector-store/IVectorStoreManager.ts:25](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStoreManager.ts#L25)

Represents the health status of managed vector store providers.

## Interface

VectorStoreManagerHealthReport

## Properties

### isOverallHealthy

> **isOverallHealthy**: `boolean`

Defined in: [packages/agentos/src/core/vector-store/IVectorStoreManager.ts:26](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStoreManager.ts#L26)

True if all critical providers are healthy or if the manager itself is operational.

***

### managerDetails?

> `optional` **managerDetails**: `any`

Defined in: [packages/agentos/src/core/vector-store/IVectorStoreManager.ts:28](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStoreManager.ts#L28)

Additional details about the manager's operational status.

***

### providerStatus?

> `optional` **providerStatus**: `Record`\<`string`, \{ `details?`: `any`; `isHealthy`: `boolean`; \}\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStoreManager.ts:27](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/vector-store/IVectorStoreManager.ts#L27)

An object detailing the health status of each individual managed provider, keyed by provider ID.
