# Class: QdrantSetup

Defined in: [packages/agentos/src/rag/setup/QdrantSetup.ts:24](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/setup/QdrantSetup.ts#L24)

## Constructors

### Constructor

> **new QdrantSetup**(): `QdrantSetup`

#### Returns

`QdrantSetup`

## Methods

### detect()

> `static` **detect**(`config?`): `Promise`\<[`BackendStatus`](../interfaces/BackendStatus.md)\>

Defined in: [packages/agentos/src/rag/setup/QdrantSetup.ts:36](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/setup/QdrantSetup.ts#L36)

Detect and optionally provision a Qdrant instance.

Priority order:
1. Explicit URL or QDRANT_URL env var → direct health check
2. Docker container named 'wunderland-qdrant' → start if stopped
3. Pull and run a new Docker container

#### Parameters

##### config?

[`SetupConfig`](../interfaces/SetupConfig.md)

Optional setup overrides (port, image tag, URL, API key).

#### Returns

`Promise`\<[`BackendStatus`](../interfaces/BackendStatus.md)\>

Backend status with URL and connection details.
