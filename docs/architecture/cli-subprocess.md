---
title: "CLI Subprocess Bridge"
sidebar_position: 5
---

> Deep dive into the CLIRegistry and CLISubprocessBridge subsystem. For the full system overview, see [System Architecture](./system-architecture.md).

## Overview

AgentOS provides a two-layer system for working with external CLI binaries:

1. **CLIRegistry** -- discovers and catalogs CLI tools installed on the host machine.
2. **CLISubprocessBridge** -- abstract base class that manages subprocess lifecycle for any CLI binary.

Both live under `packages/agentos/src/sandbox/subprocess/`.

## CLIRegistry

### JSON-Driven Discovery

CLI descriptors are loaded from JSON files in `./registry/`, organized by category. Currently **54 CLIs** across **8 categories**:

| Category         | File                    | Count | Examples                                           |
| ---------------- | ----------------------- | ----- | -------------------------------------------------- |
| LLM              | `llm.json`              | 5     | Claude Code, Gemini CLI, Ollama, LM Studio, AIChat |
| Dev Tools        | `devtools.json`         | 10    | git, gh, docker, terraform                         |
| Runtimes         | `runtimes.json`         | 8     | node, python3, ruby, go, rustc                     |
| Cloud            | `cloud.json`            | 9     | aws, gcloud, az, flyctl                            |
| Databases        | `databases.json`        | 5     | psql, mysql, redis-cli, sqlite3                    |
| Media            | `media.json`            | 5     | ffmpeg, imagemagick                                |
| Networking       | `networking.json`       | 5     | curl, wget, httpie                                 |
| Package Managers | `package-managers.json` | 7     | npm, pnpm, yarn, pip, cargo, brew                  |

Each JSON file is an array of `CLIDescriptor` objects:

```typescript
interface CLIDescriptor {
  binaryName: string; // e.g. "claude"
  displayName: string; // e.g. "Claude Code"
  description: string; // Human-readable purpose
  category: string; // "llm", "devtools", etc.
  installGuidance: string; // How to install
  versionFlag?: string; // Default: "--version"
  versionPattern?: RegExp; // Default: /(\d+\.\d+\.\d+)/
}
```

### Adding New CLIs

Community contributions add new CLIs by editing JSON -- no TypeScript changes required:

```json
[
  {
    "binaryName": "my-tool",
    "displayName": "My Tool",
    "description": "Custom internal CLI",
    "category": "devtools",
    "installGuidance": "brew install my-tool"
  }
]
```

Extensions can also register CLIs at runtime:

```typescript
const registry = new CLIRegistry();
registry.register({
  binaryName: 'my-tool',
  displayName: 'My Tool',
  description: 'Custom CLI',
  category: 'devtools',
  installGuidance: 'brew install my-tool',
});
```

### PATH Scanning

`scan()` runs `which` + `--version` for every registered descriptor in parallel and returns `CLIScanResult[]` with installation status, binary path, and parsed version. This feeds into `wunderland doctor`, capability discovery, and provider auto-detection.

## CLISubprocessBridge

### Template Method Pattern

The abstract `CLISubprocessBridge` class owns the subprocess lifecycle while subclasses implement CLI-specific behavior:

```typescript
abstract class CLISubprocessBridge {
  // Subclasses implement these four methods:
  protected abstract readonly binaryName: string;
  protected abstract buildArgs(opts: BridgeOptions, fmt: OutputFormat): string[];
  protected abstract classifyError(error: any): CLISubprocessError;
  protected abstract parseStreamEvent(raw: any): StreamEvent | null;

  // Base class provides these capabilities:
  async checkBinaryInstalled(): Promise<InstallCheckResult>;
  async checkAuthenticated(): Promise<boolean>;
  async execute(options: BridgeOptions): Promise<BridgeResult>;
  async *stream(options: BridgeOptions): AsyncGenerator<StreamEvent>;
}
```

### Non-Streaming Execution

`execute()` spawns the binary with JSON output format, pipes input via stdin, and returns a parsed `BridgeResult`:

```typescript
const result = await bridge.execute({
  prompt: 'Explain quantum computing',
  systemPrompt: 'Be concise',
  timeout: 60_000,
});
// result: { result: string, sessionId?, usage?, isError, durationMs }
```

### Streaming Execution

`stream()` spawns with `stream-json` output format and yields typed `StreamEvent`s parsed from newline-delimited JSON on stdout:

```typescript
for await (const event of bridge.stream({ prompt: 'Write a story' })) {
  if (event.type === 'text_delta') process.stdout.write(event.text);
}
```

NDJSON lines are split from a rolling buffer. Unparseable lines (progress spinners, etc.) are silently skipped.

### Error Classification

`CLISubprocessError` carries actionable guidance and a recoverability flag:

```typescript
class CLISubprocessError extends Error {
  readonly code: string; // e.g. "BINARY_NOT_FOUND"
  readonly binaryName: string; // e.g. "claude"
  readonly guidance: string; // Human-readable fix instructions
  readonly recoverable: boolean;
}
```

Standard error codes in `CLI_ERROR`:

| Code                | Meaning                     |
| ------------------- | --------------------------- |
| `BINARY_NOT_FOUND`  | Not on PATH                 |
| `NOT_AUTHENTICATED` | Installed but not logged in |
| `VERSION_OUTDATED`  | Version too old             |
| `SPAWN_FAILED`      | Permissions or missing deps |
| `TIMEOUT`           | Exceeded timeout            |
| `CRASHED`           | Non-zero exit code          |
| `RATE_LIMITED`      | Quota exceeded              |
| `PERMISSION_DENIED` | EACCES                      |
| `CONTEXT_TOO_LONG`  | Input exceeds CLI limits    |

### Default Timeout

All subprocess calls default to `120_000 ms` (2 minutes), overridable per-call via `options.timeout`.

## Key Source Files

| File                                                             | Purpose                           |
| ---------------------------------------------------------------- | --------------------------------- |
| `packages/agentos/src/sandbox/subprocess/CLIRegistry.ts`         | Registry implementation           |
| `packages/agentos/src/sandbox/subprocess/CLISubprocessBridge.ts` | Abstract bridge base class        |
| `packages/agentos/src/sandbox/subprocess/errors.ts`              | Error class + standard codes      |
| `packages/agentos/src/sandbox/subprocess/types.ts`               | Shared type definitions           |
| `packages/agentos/src/sandbox/subprocess/registry/*.json`        | 8 JSON descriptor files (54 CLIs) |

## See Also

- [Sandbox Security](/architecture/sandbox-security) -- code execution sandboxing
- [Tool Permissions](/architecture/tool-permissions) -- security tier filtering
- [System Architecture](./system-architecture.md) -- full system overview
