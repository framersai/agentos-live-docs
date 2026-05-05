# Interface: SandboxedToolForgeConfig

Defined in: [packages/agentos/src/emergent/SandboxedToolForge.ts:58](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/SandboxedToolForge.ts#L58)

Configuration options for the [SandboxedToolForge](../classes/SandboxedToolForge.md).

All fields are optional and fall back to sensible defaults.

## Properties

### fetchDomainAllowlist?

> `optional` **fetchDomainAllowlist**: `string`[]

Defined in: [packages/agentos/src/emergent/SandboxedToolForge.ts:79](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/SandboxedToolForge.ts#L79)

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

Defined in: [packages/agentos/src/emergent/SandboxedToolForge.ts:86](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/SandboxedToolForge.ts#L86)

Filesystem roots sandboxed `fs.readFile` calls may access.
Relative paths are resolved from the current working directory.
Defaults to the current working directory only.

***

### memoryMB?

> `optional` **memoryMB**: `number`

Defined in: [packages/agentos/src/emergent/SandboxedToolForge.ts:65](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/SandboxedToolForge.ts#L65)

Nominal heap budget in megabytes for telemetry and future isolate-backed
execution. The current node:vm implementation cannot preemptively enforce
memory limits.

#### Default

```ts
128
```

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/emergent/SandboxedToolForge.ts:71](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/SandboxedToolForge.ts#L71)

Maximum wall-clock execution time in milliseconds.

#### Default

```ts
5000
```
