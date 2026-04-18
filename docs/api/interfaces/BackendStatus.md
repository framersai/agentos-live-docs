# Interface: BackendStatus

Defined in: [packages/agentos/src/rag/setup/types.ts:12](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/setup/types.ts#L12)

Result of detecting a backend's availability.

## Properties

### containerName?

> `optional` **containerName**: `string`

Defined in: [packages/agentos/src/rag/setup/types.ts:18](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/setup/types.ts#L18)

Docker container name if running via Docker.

***

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/rag/setup/types.ts:22](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/setup/types.ts#L22)

Error message if status is 'error' or 'no_docker'.

***

### source?

> `optional` **source**: `"manual"` \| `"docker-local"` \| `"env-var"` \| `"cloud"`

Defined in: [packages/agentos/src/rag/setup/types.ts:20](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/setup/types.ts#L20)

How the backend was discovered.

***

### status

> **status**: [`SetupStatus`](../type-aliases/SetupStatus.md)

Defined in: [packages/agentos/src/rag/setup/types.ts:14](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/setup/types.ts#L14)

Current status of the backend.

***

### url?

> `optional` **url**: `string`

Defined in: [packages/agentos/src/rag/setup/types.ts:16](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/setup/types.ts#L16)

URL/connection string if the backend is reachable.
