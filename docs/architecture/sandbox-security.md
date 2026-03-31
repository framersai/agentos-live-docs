---
title: "Sandbox Security"
sidebar_position: 3
---

> Deep dive into AgentOS code execution isolation. For the full system overview, see [System Architecture](./system-architecture.md).

## Overview

The `CodeSandbox` class (`packages/agentos/src/sandbox/executor/CodeSandbox.ts`) provides isolated code execution across three languages with configurable security controls. Every execution goes through a two-gate pipeline: **static pattern analysis** first, then **runtime isolation**.

## Default Security Configuration

```typescript
const DEFAULT_CONFIG: SandboxConfig = {
  timeoutMs: 30000, // 30 seconds
  maxMemoryBytes: 128 * 1024 * 1024, // 128 MB
  maxOutputBytes: 1024 * 1024, // 1 MB
  allowNetwork: false,
  allowFilesystem: false,
  blockedModules: [
    'fs',
    'child_process',
    'cluster',
    'dgram',
    'dns',
    'http',
    'https',
    'net',
    'tls',
    'vm',
  ],
  maxCpuTimeMs: 10000, // 10 seconds
};
```

Network and filesystem access are **off by default**. Both must be explicitly opted in.

## Gate 1: Dangerous Pattern Detection

Before any code runs, `validateCode()` scans the source against language-specific regex arrays in `DANGEROUS_PATTERNS`. Patterns with `critical` or `high` severity short-circuit execution immediately.

| Language   | Example blocked patterns                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------- |
| JavaScript | `require('child_process')`, `process.exit`, `eval()`, `new Function`, `__proto__` manipulation |
| Python     | `import subprocess`, `__import__()`, `exec()`, `eval()`, `open()`                              |
| Shell      | `rm -rf /`, `dd if=`, fork bombs `:(){ :\|:& };:`, `curl \| sh`                                |
| SQL        | `DROP TABLE`, `TRUNCATE`, `DELETE` without `WHERE`, chained injection `; DROP`                 |

Severity is determined by the pattern source string content:

- **Critical** -- destructive shell commands (`rm -rf /`, `dd if=`, fork bombs)
- **High** -- `child_process`, `subprocess`, `exec()`, `eval()`, SQL `DROP`/`DELETE`/`TRUNCATE`
- **Medium** -- `fs`, `net`, `http`, `os`, `socket` access
- **Low** -- everything else

## Gate 2: Runtime Isolation by Language

### JavaScript -- `node:vm` Hardening

JavaScript runs **in-process** via `node:vm` with multiple hardening layers:

1. **Context isolation** -- only safe globals are exposed (`JSON`, `Math`, `Date`, `Array`, `Object`, `String`, etc.). Dangerous globals are explicitly set to `undefined`:

```typescript
const contextObj = {
  console: sandboxConsole, // frozen, captures to local buffers
  JSON,
  Math,
  Date,
  Array,
  Object,
  String,
  Number,
  Boolean,
  // ... other safe built-ins
  process: undefined,
  global: undefined,
  globalThis: undefined,
  require: undefined,
  fetch: undefined,
  setTimeout: undefined,
  // ... all timer functions blocked
};
```

2. **Code generation blocked** -- `codeGeneration: { strings: false, wasm: false }` prevents `eval()` and `new Function()` from working inside the VM, even if the static check missed them.

3. **Dual timeout** -- `vm.Script.runInContext` has a sync CPU timeout, and a `Promise.race` covers async code paths.

4. **Frozen console** -- `Object.freeze(sandboxConsole)` prevents prototype chain attacks through the console object.

### Python -- Subprocess Sandboxing

Python code spawns a `python3` subprocess via `execa` with security preambles injected before user code:

- **Network disabled** (`allowNetwork: false`): poisons `socket`, `urllib`, `http`, `requests`, `aiohttp`, `httpx` modules by setting `sys.modules[mod] = None`.
- **Filesystem disabled** (`allowFilesystem: false`): monkey-patches `builtins.open` to raise `PermissionError` and poisons `os`, `shutil`, `pathlib`, `glob`.

Temp files are written for execution and unconditionally cleaned up in a `finally` block.

### Shell -- Environment-Level Restrictions

Shell commands spawn `bash` (or `cmd` on Windows) via `execa`:

- **Network disabled**: sets `http_proxy` and `https_proxy` to `http://0.0.0.0:0`, which blocks most HTTP-based network access.
- Dangerous pattern validation (fork bombs, `rm -rf /`, etc.) is handled by Gate 1 before the shell process is spawned.
- Timeout, `cwd`, and `envVars` from config are forwarded to the subprocess.

## Execution Lifecycle

```
execute(request)
  |
  +-- validateCode() -> SecurityEvent[]
  |     |
  |     +-- critical/high severity? -> REJECT immediately
  |     +-- medium/low? -> attach as warnings, proceed
  |
  +-- AbortController + setTimeout for timeout
  |
  +-- Language dispatch:
  |     |-- javascript -> node:vm sandbox
  |     |-- python     -> python3 subprocess
  |     +-- shell      -> bash subprocess
  |
  +-- Result: ExecutionResult { status, output, durationMs, securityEvents }
```

## Execution Tracking and Statistics

The sandbox tracks per-session statistics:

- `totalExecutions`, `successfulExecutions`, `failedExecutions`
- `timedOutExecutions`, `killedExecutions`
- Per-language counts (`byLanguage`)
- Average duration and memory usage
- Security event counts

Running executions can be killed at any time via `kill(executionId)`, which aborts the underlying `AbortController`.

## Key Source Files

| File                                                              | Purpose                        |
| ----------------------------------------------------------------- | ------------------------------ |
| `packages/agentos/src/sandbox/executor/CodeSandbox.ts`            | Main sandbox implementation    |
| `packages/agentos/src/sandbox/executor/ICodeSandbox.ts`           | Interface and type definitions |
| `packages/agentos/src/sandbox/executor/tests/CodeSandbox.spec.ts` | Test suite                     |

## See Also

- [CLI Subprocess Bridge](/architecture/cli-subprocess) -- subprocess management for external CLI binaries
- [Tool Permissions](/architecture/tool-permissions) -- security tier filtering for tool execution
- [System Architecture](./system-architecture.md) -- full system overview
