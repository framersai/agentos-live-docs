# Interface: SandboxedToolForgeConfig

Defined in: [packages/agentos/src/emergent/SandboxedToolForge.ts:44](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/SandboxedToolForge.ts#L44)

Configuration options for the [SandboxedToolForge](../classes/SandboxedToolForge.md).

All fields are optional and fall back to sensible defaults.

## Properties

### fetchDomainAllowlist?

> `optional` **fetchDomainAllowlist**: `string`[]

Defined in: [packages/agentos/src/emergent/SandboxedToolForge.ts:64](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/SandboxedToolForge.ts#L64)

When `fetch` is in the allowlist, only requests to these domains are
permitted. An empty array means all domains are allowed.
Domain matching is case-insensitive and checks exact host equality.

#### Default

```ts
[]
```

***

### fsReadRoots?

> `optional` **fsReadRoots**: `string`[]

Defined in: [packages/agentos/src/emergent/SandboxedToolForge.ts:71](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/SandboxedToolForge.ts#L71)

Filesystem roots sandboxed `fs.readFile` calls may access.
Relative paths are resolved from the current working directory.
Defaults to the current working directory only.

***

### memoryMB?

> `optional` **memoryMB**: `number`

Defined in: [packages/agentos/src/emergent/SandboxedToolForge.ts:50](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/SandboxedToolForge.ts#L50)

Maximum heap memory in megabytes for the sandbox process.
Used with `isolated-vm`; the `vm` fallback cannot enforce memory limits.

#### Default

```ts
128
```

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/emergent/SandboxedToolForge.ts:56](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/SandboxedToolForge.ts#L56)

Maximum wall-clock execution time in milliseconds.

#### Default

```ts
5000
```
