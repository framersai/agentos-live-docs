# Type Alias: SandboxAPI

> **SandboxAPI** = `"fetch"` \| `"fs.readFile"` \| `"crypto"`

Defined in: [packages/agentos/src/emergent/types.ts:51](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L51)

Named APIs that sandboxed tool code is permitted to invoke.

All other I/O is forbidden by default. The allowlist is declared per-tool in
[SandboxedToolSpec](../interfaces/SandboxedToolSpec.md) and enforced by the sandbox runtime at execution time.

- `'fetch'`         — Outbound HTTP/HTTPS requests via the global `fetch` API.
- `'fs.readFile'`   — Synchronous read of files in a pre-approved path whitelist.
- `'crypto'`        — Access to the Node.js `crypto` module for hashing / HMAC.
