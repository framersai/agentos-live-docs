# Class: DockerDetector

Defined in: [packages/agentos/src/rag/setup/DockerDetector.ts:12](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/setup/DockerDetector.ts#L12)

## Constructors

### Constructor

> **new DockerDetector**(): `DockerDetector`

#### Returns

`DockerDetector`

## Methods

### getContainerState()

> `static` **getContainerState**(`name`): `"running"` \| `"stopped"` \| `"not_found"`

Defined in: [packages/agentos/src/rag/setup/DockerDetector.ts:35](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/setup/DockerDetector.ts#L35)

Check the state of a named Docker container.

#### Parameters

##### name

`string`

Container name to inspect.

#### Returns

`"running"` \| `"stopped"` \| `"not_found"`

'running' if active, 'stopped' if exists but not running,
         'not_found' if the container doesn't exist.

***

### getHostPort()

> `static` **getHostPort**(`name`, `internalPort`): `number` \| `null`

Defined in: [packages/agentos/src/rag/setup/DockerDetector.ts:127](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/setup/DockerDetector.ts#L127)

Get the mapped host port for a container's internal port.
Useful when the host port was dynamically assigned.

#### Parameters

##### name

`string`

Container name.

##### internalPort

`number`

The container-internal port to look up.

#### Returns

`number` \| `null`

The host port number, or null if not found.

***

### isDockerAvailable()

> `static` **isDockerAvailable**(): `boolean`

Defined in: [packages/agentos/src/rag/setup/DockerDetector.ts:19](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/setup/DockerDetector.ts#L19)

Check if Docker is installed and the daemon is running.
Runs `docker info` with a 5-second timeout.

#### Returns

`boolean`

True if Docker is available and responsive.

***

### pullAndRun()

> `static` **pullAndRun**(`opts`): `void`

Defined in: [packages/agentos/src/rag/setup/DockerDetector.ts:68](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/setup/DockerDetector.ts#L68)

Pull a Docker image and run a new container.

#### Parameters

##### opts

###### env?

`Record`\<`string`, `string`\>

Environment variables (e.g. { POSTGRES_PASSWORD: 'pw' }).

###### image

`string`

Docker image (e.g. 'qdrant/qdrant:latest').

###### name

`string`

Container name.

###### ports

`string`[]

Port mappings (e.g. ['6333:6333', '6334:6334']).

###### volumes

`string`[]

Volume mounts (e.g. ['data-vol:/data']).

#### Returns

`void`

***

### startContainer()

> `static` **startContainer**(`name`): `void`

Defined in: [packages/agentos/src/rag/setup/DockerDetector.ts:55](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/setup/DockerDetector.ts#L55)

Start a stopped container by name.

#### Parameters

##### name

`string`

Container name to start.

#### Returns

`void`

#### Throws

If the container cannot be started.

***

### waitForHealthy()

> `static` **waitForHealthy**(`url`, `timeoutMs?`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/rag/setup/DockerDetector.ts:105](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/setup/DockerDetector.ts#L105)

Poll a health check URL until it returns 200 or timeout is reached.
Checks every 500ms.

#### Parameters

##### url

`string`

Health check endpoint (e.g. 'http://localhost:6333/healthz').

##### timeoutMs?

`number` = `15000`

Maximum time to wait in milliseconds.

#### Returns

`Promise`\<`boolean`\>

True if the endpoint became healthy within the timeout.

#### Default

```ts
15000
```
