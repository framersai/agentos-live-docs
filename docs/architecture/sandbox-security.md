---
title: "Sandbox Security"
sidebar_position: 4
displayed_sidebar: guideSidebar
description: 'How AgentOS isolates code execution: the two-gate pipeline (static pattern matching + runtime isolation), what the defaults actually enforce, and what they only nominally suggest.'
---

When an agent forges a tool, runs user-supplied code, or executes shell commands on behalf of a model, the runtime needs to assume the code is hostile until proven otherwise. Models hallucinate. Prompt injection happens. A tool spec that looked safe in a review can fire a child process if you blink. The `CodeSandbox` ([`packages/agentos/src/sandbox/executor/CodeSandbox.ts`](https://github.com/framersai/agentos/blob/master/src/sandbox/executor/CodeSandbox.ts)) is the boundary. Every execution passes through two gates — a static analyzer that rejects known-dangerous patterns before any process spawns, and a runtime isolation layer specific to the language being executed. The defaults are conservative on purpose. Network and filesystem access are off, and turning them on requires the host application to do it explicitly.

This page documents what each gate actually enforces. Some of the defaults are tighter than the obvious read of the config object suggests; one of them — the memory cap — is nominal rather than enforced, and you should know which is which.

## Default configuration

```typescript
const DEFAULT_CONFIG: SandboxConfig = {
  timeoutMs: 30000,                       // 30 seconds wall-clock
  maxMemoryBytes: 128 * 1024 * 1024,      // 128 MB — nominal only (see below)
  maxOutputBytes: 1024 * 1024,            // 1 MB stdout/stderr cap
  allowNetwork: false,
  allowFilesystem: false,
  blockedModules: [
    'fs', 'child_process', 'cluster', 'dgram',
    'dns', 'http', 'https', 'net', 'tls', 'vm',
  ],
  maxCpuTimeMs: 10000,                    // 10 seconds CPU budget
};
```

**A note on memory.** The `maxMemoryBytes` field is a nominal budget, not an enforced limit. The JavaScript path runs inside a `node:vm` context, and Node's VM module exposes a heap-delta read but does not provide a hard memory ceiling for arbitrary scripts. The number is recorded in stats and can inform alerting; it does not stop a runaway allocation. If you need an enforced cap, run the sandbox in a process with `--max-old-space-size` and let the OS kill it.

## Gate 1 — static pattern detection

Before any process or VM context is created, [`validateCode()`](https://github.com/framersai/agentos/blob/master/src/sandbox/executor/CodeSandbox.ts) scans the source against language-specific regex tables in `DANGEROUS_PATTERNS`. The patterns are categorized by severity, and `critical` or `high` matches reject the request immediately — no execution, no expensive process spawn.

| Language | Example blocked patterns |
|---|---|
| **JavaScript** | `require('child_process')`, `process.exit`, `eval()`, `new Function`, `__proto__` chain manipulation |
| **Python** | `import subprocess`, `__import__()`, `exec()`, `eval()`, raw `open()` |
| **Shell** | `rm -rf /`, `dd if=`, fork bombs `:(){ :\|:& };:`, `curl \| sh` |
| **SQL** | `DROP TABLE`, `TRUNCATE`, `DELETE` without `WHERE`, chained injection `; DROP` |

Severity is a property of the matching pattern, not the input:

- **Critical** — destructive shell commands (`rm -rf /`, `dd if=`, fork bombs)
- **High** — `child_process`, `subprocess`, `exec()`, `eval()`, SQL `DROP`/`DELETE`/`TRUNCATE`
- **Medium** — `fs`, `net`, `http`, `os`, `socket` access
- **Low** — everything else

Medium and low severity matches don't reject; they record `SecurityEvent`s on the result so the caller can decide whether to flag, log, or proceed. The pattern set is intentionally conservative — false positives are acceptable, false negatives at this layer are not, because Gate 1 is the cheap pre-filter that runs before anything expensive happens.

## Gate 2 — runtime isolation per language

### JavaScript: hardened `node:vm`

JavaScript runs in-process via Node's `vm` module with several layers of hardening on top:

**1. Context isolation.** Only an explicit allowlist of safe built-ins is exposed. Everything else — including the entire host runtime — is set to `undefined` inside the context:

```typescript
const contextObj = {
  console: sandboxConsole,    // frozen, captures to local buffers
  JSON, Math, Date, Array, Object, String, Number, Boolean,
  // ... other safe built-ins

  process:     undefined,
  global:      undefined,
  globalThis:  undefined,
  require:     undefined,
  fetch:       undefined,
  setTimeout:  undefined,
  // ... all timer functions blocked
};
```

**2. The dangerous-globals deny list goes further than the obvious set.** `DANGEROUS_GLOBAL_KEYS` blocks not just the host-escape primitives (`process`, `global`, `require`) and the code-generation reflection ones (`eval`, `Function`), but also:

- `Reflect` and `Proxy` — realm-reflection and introspection surfaces that can be used to escape the sandboxed object graph
- `WebAssembly` — the native-compilation surface
- `SharedArrayBuffer` and `Atomics` — the memory side-channels exploited by the [Spectre family of attacks](https://meltdownattack.com/) (Kocher et al., 2018)

Any of these names that arrive through `extraGlobals` are silently filtered out at merge time, so a host that accidentally includes one still gets a hardened sandbox rather than a broken one.

**3. Code generation blocked at the VM level.** `codeGeneration: { strings: false, wasm: false }` disables `eval()` and `new Function()` from working *inside* the VM context, even if Gate 1's static check missed an obfuscated reference. The static gate catches the easy cases; the VM flag catches what the static gate misses.

**4. Dual timeout.** `vm.Script.runInContext` enforces a synchronous CPU timeout on the script itself, and a `Promise.race` covers the async case where the script schedules work that the sync timer can't see.

**5. Frozen console.** `Object.freeze(sandboxConsole)` prevents prototype-chain attacks routed through the only logging surface the sandboxed code can reach.

### Python: subprocess with poisoned imports

Python code spawns a `python3` subprocess via `execa`, with a security preamble injected before the user code runs:

- **Network disabled** (`allowNetwork: false`): poisons `socket`, `urllib`, `http`, `requests`, `aiohttp`, `httpx` by setting `sys.modules[mod] = None`. Subsequent `import` of any of those raises `ModuleNotFoundError` immediately.
- **Filesystem disabled** (`allowFilesystem: false`): monkey-patches `builtins.open` to raise `PermissionError`, and poisons `os`, `shutil`, `pathlib`, `glob` the same way as the network modules.

Temp files for execution are written into the OS temp directory and unconditionally cleaned up in a `finally` block, regardless of whether the subprocess exited cleanly or was killed.

### Shell: environment-level restrictions

Shell commands spawn `bash` (or `cmd` on Windows) via `execa`:

- **Network disabled**: sets `http_proxy` and `https_proxy` to `http://0.0.0.0:0`, which drops most HTTP-based traffic at the system layer. Tools that bypass system proxies (raw sockets, DNS-over-HTTPS) won't be caught by this alone.
- **Pattern validation handled upstream**: fork bombs, `rm -rf /`, and other catastrophic commands are caught at Gate 1 before bash is ever spawned.
- `timeoutMs`, `cwd`, and `envVars` from the config are forwarded to the subprocess.

## The execution lifecycle

```
execute(request)
  │
  ├─ validateCode()  →  SecurityEvent[]
  │     │
  │     ├─ critical/high severity? → REJECT immediately
  │     └─ medium/low?              → attach as warnings, proceed
  │
  ├─ AbortController + setTimeout for the wall-clock cap
  │
  ├─ Language dispatch:
  │     ├─ javascript  →  node:vm sandbox
  │     ├─ python      →  python3 subprocess
  │     └─ shell       →  bash subprocess
  │
  └─ Result: ExecutionResult { status, output, durationMs, securityEvents }
```

Every execution is addressable by `executionId`. `kill(executionId)` aborts the underlying `AbortController`, which terminates the VM script or sends `SIGTERM` to the subprocess. The API is synchronous: a kill request returns once the abort has been signalled, not once the process has confirmed it's dead.

## What the sandbox tracks

Per-session statistics are surfaced on the sandbox instance:

- `totalExecutions`, `successfulExecutions`, `failedExecutions`
- `timedOutExecutions`, `killedExecutions`
- Per-language counts (`byLanguage`)
- Average duration and observed memory delta
- Security event counts (cumulative across executions)

These feed the observability layer (`agentos.sandbox.*` metrics when OpenTelemetry is configured) and can drive circuit breakers in the calling host.

## Honest limits

The sandbox blocks the obvious attack surface and the common Spectre-class side channels. It is not a substitute for OS-level isolation if your threat model includes nation-state-grade exploitation of V8 itself. For that, run the sandbox process inside a [gVisor](https://gvisor.dev/) or Firecracker microVM, give it its own UID with no filesystem mount, and treat the in-process JavaScript boundary as defense-in-depth, not the perimeter.

For deployments where untrusted code must execute alongside trusted user data in the same Node process, the recommended posture is: enable AgentOS's sandbox, keep `allowNetwork` and `allowFilesystem` off, run the host process under a dedicated UID with no access to anything sensitive, and add an OS-level isolation boundary on top.

## Key source files

| File | Purpose |
|---|---|
| [`src/sandbox/executor/CodeSandbox.ts`](https://github.com/framersai/agentos/blob/master/src/sandbox/executor/CodeSandbox.ts) | Main sandbox implementation |
| [`src/sandbox/executor/ICodeSandbox.ts`](https://github.com/framersai/agentos/blob/master/src/sandbox/executor/ICodeSandbox.ts) | Interface and type definitions |
| [`src/sandbox/executor/tests/CodeSandbox.spec.ts`](https://github.com/framersai/agentos/blob/master/src/sandbox/executor/tests/CodeSandbox.spec.ts) | Test suite |

## See also

- [CLI Subprocess Bridge](/architecture/cli-subprocess) — subprocess management for external CLI binaries (a separate, more permissive lane intended for trusted CLIs the host explicitly registers)
- [Tool Permissions](/architecture/tool-permissions) — security tier filtering that decides which tools an agent is even allowed to attempt
- [System Architecture](./system-architecture.md) — full system overview

---

## References

### Speculative-execution side channels

- Kocher, P., Horn, J., Fogh, A., Genkin, D., Gruss, D., Haas, W., Hamburg, M., Lipp, M., Mangard, S., Prescher, T., Schwarz, M., & Yarom, Y. (2018). *Spectre attacks: Exploiting speculative execution.* IEEE Symposium on Security and Privacy 2019. — The Spectre family this sandbox's `SharedArrayBuffer` / `Atomics` / `WebAssembly` / `Reflect` / `Proxy` deny-list defends against. [Project page](https://meltdownattack.com/) · [arXiv:1801.01203](https://arxiv.org/abs/1801.01203)
- Lipp, M., Schwarz, M., Gruss, D., Prescher, T., Haas, W., Fogh, A., Horn, J., Mangard, S., Kocher, P., Genkin, D., Yarom, Y., & Hamburg, M. (2018). *Meltdown: Reading kernel memory from user space.* USENIX Security 2018. — Companion to Spectre; same memory-side-channel class. [Project page](https://meltdownattack.com/) · [arXiv:1801.01207](https://arxiv.org/abs/1801.01207)

### V8 / Node sandbox limits

- Node.js project. *Documentation: `vm` module — Compiling and running code in V8 Virtual Machine contexts.* — The primitive AgentOS's `CodeSandbox` builds on; documents the heap-delta-only memory observability that motivates the "nominal not enforced" `maxMemoryBytes` note. [nodejs.org/api/vm.html](https://nodejs.org/api/vm.html)
- Google V8 team. *V8 isolates and contexts.* — Background on why context isolation is not the same as process isolation; informs the "honest limits" section recommending OS-level boundaries (gVisor / Firecracker) on top. [v8.dev/docs/embed](https://v8.dev/docs/embed)

### OS-level isolation alternatives

- Google. *gVisor: Application Kernel for Containers.* — Recommended OS-level boundary for high-stakes deployments. [gvisor.dev](https://gvisor.dev/)
- Amazon Web Services. *Firecracker microVMs.* — Alternative microVM approach for tighter isolation than gVisor. [firecracker-microvm.github.io](https://firecracker-microvm.github.io/)

### Implementation references

- [`src/sandbox/executor/CodeSandbox.ts`](https://github.com/framersai/agentos/blob/master/src/sandbox/executor/CodeSandbox.ts) — main sandbox implementation
- [`src/sandbox/executor/ICodeSandbox.ts`](https://github.com/framersai/agentos/blob/master/src/sandbox/executor/ICodeSandbox.ts) — interface + type definitions
- [`src/sandbox/executor/tests/CodeSandbox.spec.ts`](https://github.com/framersai/agentos/blob/master/src/sandbox/executor/tests/CodeSandbox.spec.ts) — test suite
