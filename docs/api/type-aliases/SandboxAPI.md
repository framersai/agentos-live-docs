# Type Alias: SandboxAPI

> **SandboxAPI** = `"fetch"` \| `"fs.readFile"` \| `"crypto"`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:51](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L51)

Named APIs that sandboxed tool code is permitted to invoke.

All other I/O is forbidden by default. The allowlist is declared per-tool in
[SandboxedToolSpec](../interfaces/SandboxedToolSpec.md) and enforced by the sandbox runtime at execution time.

- `'fetch'`         — Outbound HTTP/HTTPS requests via the global `fetch` API.
- `'fs.readFile'`   — Synchronous read of files in a pre-approved path whitelist.
- `'crypto'`        — Access to the Node.js `crypto` module for hashing / HMAC.
