---
title: "Extension Loading"
sidebar_position: 7
---

> Deep dive into the extension pack lifecycle, manifest resolution, and dynamic import system. For the full system overview, see [System Architecture](./system-architecture.md).

## Overview

The extension system is built on three core pieces:

1. **ExtensionPack / ExtensionManifest** -- declarative loading via pack descriptors.
2. **ExtensionManager** -- coordinates discovery, activation, and runtime access.
3. **SharedServiceRegistry** -- lazy singleton reuse across packs.

Source: `packages/agentos/src/extensions/ExtensionManager.ts`

## ExtensionPack Interface

```typescript
interface ExtensionPack {
  name: string;
  version?: string;
  descriptors: ExtensionDescriptor[];
  onActivate?: (context: ExtensionLifecycleContext) => Promise<void> | void;
  onDeactivate?: (context: ExtensionLifecycleContext) => Promise<void> | void;
}
```

Each pack emits `ExtensionDescriptor` objects that are registered into kind-specific registries. The lifecycle context provides:

```typescript
interface ExtensionLifecycleContext {
  logger?: ILogger;
  getSecret?: (secretId: string) => string | undefined;
  services?: ISharedServiceRegistry;
}
```

## Extension Kinds

The manager maintains registries for 15 extension kinds:

| Kind                 | Description                     |
| -------------------- | ------------------------------- |
| `tool`               | Agent-callable tools            |
| `guardrail`          | Input/output guardrails         |
| `response-processor` | Post-processing hooks           |
| `workflow`           | Workflow definitions            |
| `workflow-executor`  | Workflow execution engines      |
| `planning-strategy`  | Planning algorithms             |
| `hitl-handler`       | Human-in-the-loop handlers      |
| `comm-channel`       | Agent communication channels    |
| `memory-provider`    | Memory storage backends         |
| `messaging-channel`  | External human-facing platforms |
| `provenance`         | Provenance and audit            |
| `stt-provider`       | Speech-to-text                  |
| `tts-provider`       | Text-to-speech                  |
| `vad-provider`       | Voice activity detection        |
| `wake-word-provider` | Wake word detection             |

## Manifest Resolution

Pack entries in the manifest can be specified three ways:

### Factory Function

```typescript
{
  factory: async () => myExtensionPack,
  identifier: 'my-pack',
}
```

### NPM Package

```typescript
{
  package: '@framers/agentos-ext-web-search',
  identifier: 'web-search',
  options: { maxResults: 10 },
}
```

### Local Module

```typescript
{
  module: './extensions/custom-tool.js',
  identifier: 'custom-tool',
}
```

The manager resolves packs by looking for a `createExtensionPack()` export (preferred), a default export that is itself a pack, or a `default.createExtensionPack()` function.

## Pack Loading Flow

```
loadPackEntry(entry)
  |
  +-- Check entry.enabled !== false
  +-- Check not already loaded (dedup by key)
  |
  +-- hydrateSecretsFromPackEntry()
  |     - Extract entry.options.secrets and merge into secret store
  |
  +-- resolvePack(entry)
  |     - Factory? Call entry.factory()
  |     - Package? import(entry.package)
  |     - Module? import(normalizeModuleSpecifier(entry.module))
  |     - Resolve createExtensionPack() or default ExtensionPack export
  |
  +-- registerPack(pack)
  |     - Call pack.onActivate(context)
  |     - For each descriptor:
  |         - Check override (enabled/priority)
  |         - Check requiredSecrets (skip if missing non-optional secrets)
  |         - Register into kind-specific ExtensionRegistry
  |         - Emit 'descriptor:activated' event
  |     - Push to loadedPacks
  |
  +-- Emit 'pack:loaded' event
```

## Deduplication

Packs are keyed by priority: `identifier > package name > module path > pack.name`. Once a key is loaded, subsequent entries with the same key are skipped with `reason: 'already_loaded'`.

## Secret Resolution

Secrets are resolved in order:

1. Explicit secrets passed to `ExtensionManager` constructor.
2. Per-pack secrets from `entry.options.secrets`.
3. Environment variables mapped via `getSecretDefinition(id)`.

## Overrides

Descriptors can be overridden via manifest-level or constructor-level config:

```typescript
const manager = new ExtensionManager({
  overrides: {
    tools: {
      'web-search': { enabled: false },
      'file-reader': { priority: 10 },
    },
    guardrails: {
      'pii-redaction': { priority: 100 },
    },
  },
});
```

Setting `enabled: false` skips registration entirely. Priority overrides control ordering in the registry.

## createCuratedManifest()

The `@framers/agentos-extensions-registry` package provides `createCuratedManifest()` -- a high-level API that builds an `ExtensionManifest` from the curated catalog of channels, providers, and tools:

```typescript
import { createCuratedManifest } from '@framers/agentos-extensions-registry';

const manifest = await createCuratedManifest({
  channels: ['telegram', 'discord', 'slack'],
  tools: ['web-search', 'giphy'],
  secrets: { TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_TOKEN },
});
```

The catalog contains 37 channel entries, 21 LLM provider entries, and 23+ tool entries. `createCuratedManifest()` checks which packages are actually installed via `import.meta.resolve()` and only includes available ones in the manifest.

## Runtime Loading

Packs can be loaded after initialization:

```typescript
// From factory
await manager.loadPackFromFactory(myPack, 'my-identifier');

// From npm package
await manager.loadPackFromPackage('@framers/agentos-ext-slack');

// From local module
await manager.loadPackFromModule('./extensions/custom.js');
```

All three methods use the same `loadPackEntry()` pipeline with deduplication and error handling.

## Shutdown

`shutdown()` is best-effort: one failing deactivation does not prevent other packs from shutting down.

```
shutdown()
  +-- Clear all kind-specific registries
  +-- Call pack.onDeactivate() for each pack (reverse order)
  +-- Release all shared services
```

## Key Source Files

| File                                                           | Purpose                            |
| -------------------------------------------------------------- | ---------------------------------- |
| `packages/agentos/src/extensions/ExtensionManager.ts`          | Manager lifecycle                  |
| `packages/agentos/src/extensions/ExtensionRegistry.ts`         | Kind-specific descriptor storage   |
| `packages/agentos/src/extensions/SharedServiceRegistry.ts`     | Lazy singleton service sharing     |
| `packages/agentos/src/extensions/types.ts`                     | ExtensionDescriptor, ExtensionKind |
| `packages/agentos/src/extensions/manifest.ts`                  | Manifest and pack types            |
| `packages/agentos-extensions-registry/src/manifest-builder.ts` | `createCuratedManifest()`          |

## See Also

- [Tool Permissions](/architecture/tool-permissions) -- how security tiers interact with extensions
- [Skills Engine](/architecture/skills-engine) -- skill loading (parallel system to extensions)
- [System Architecture](./system-architecture.md) -- full system overview
