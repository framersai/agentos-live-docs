---
title: "Turn Planner"
sidebar_position: 5
---

The Turn Planner sits before GMI execution on every turn and determines three things:

1. **Execution policy** for tool failures (fail-open vs fail-closed)
2. **Tool selection scope** (all registered tools vs discovery-selected tools)
3. **Capability discovery payload** (optional per-turn semantic retrieval)

## Architecture

```
User Message
  → TurnPlanner.planTurn()
    ├── Resolve execution policy (fail mode, tool selection mode)
    ├── Run CapabilityDiscoveryEngine.discover() if enabled
    ├── Extract discovered tool names from Tier 1 + Tier 2 results
    └── Return TurnPlan (policy + capability + diagnostics)
  → GMI processes with scoped tool set
```

The planner integrates directly with the [Capability Discovery Engine](/features/capability-discovery). When discovery is enabled, the planner queries it with the user's message, extracts tool names from the discovery results, and scopes the GMI's tool set to only those tools. If discovery fails or returns no matches, the planner falls back to the full tool set.

## Quick Start

```typescript
import { AgentOS } from '@framers/agentos';

const agent = new AgentOS();
await agent.initialize({
  provider: 'anthropic',
  turnPlanner: {
    enabled: true,
    defaultToolFailureMode: 'fail_open',
    allowRequestOverrides: true,
    discovery: {
      enabled: true,
      defaultToolSelectionMode: 'discovered',
      includePromptContext: true,
    },
  },
});
```

## Configuration

### TurnPlannerConfig

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Master switch for the planner |
| `defaultToolFailureMode` | `'fail_open' \| 'fail_closed'` | `'fail_open'` | What happens when discovery or tool execution fails |
| `allowRequestOverrides` | `boolean` | `true` | Whether per-request `customFlags` can override defaults |
| `discovery` | `TurnPlannerDiscoveryConfig` | See below | Discovery-specific settings |

### TurnPlannerDiscoveryConfig

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Whether to run capability discovery per turn |
| `onlyAvailable` | `boolean` | `true` | Only return capabilities that are currently available |
| `defaultKind` | `CapabilityKind \| 'any'` | `'any'` | Filter discovery to a specific capability kind |
| `includePromptContext` | `boolean` | `true` | Inject discovery context into the GMI prompt |
| `defaultToolSelectionMode` | `'all' \| 'discovered'` | `'discovered'` | Whether GMI sees all tools or only discovery-selected ones |
| `maxRetries` | `number` | `1` | Retry attempts after initial discovery failure |
| `retryBackoffMs` | `number` | `150` | Delay between retries in milliseconds |

## Execution Policy

### Fail-Open vs Fail-Closed

| Mode | Behavior |
|------|----------|
| `fail_open` | Discovery failures or tool errors are logged and execution continues with the full tool set. The agent degrades gracefully. |
| `fail_closed` | Discovery failures throw a `GMIError` with code `PROCESSING_ERROR`. The turn is aborted. Use for high-stakes operations where partial execution is worse than no execution. |

### Tool Selection Modes

| Mode | Behavior |
|------|----------|
| `all` | GMI sees every registered tool (traditional behavior) |
| `discovered` | GMI only sees tools that capability discovery selected for this turn. Reduces token usage and improves focus. Falls back to `all` if discovery returns no tool matches. |

## Per-Request Overrides

When `allowRequestOverrides` is `true`, callers can override planner behavior via `customFlags` on the processing options:

```typescript
await agent.process({
  userId: 'user-1',
  message: 'Search for recent AI papers',
  options: {
    customFlags: {
      toolFailureMode: 'fail_closed',
      toolSelectionMode: 'all',
      enableCapabilityDiscovery: true,
      capabilityDiscoveryKind: 'tool',
      capabilityCategory: 'research',
    },
  },
});
```

Supported flags:
- `toolFailureMode` / `tool_failure_mode` / `failureMode` / `failMode`
- `toolSelectionMode` / `tool_selection_mode` / `capabilityToolSelectionMode`
- `enableCapabilityDiscovery` / `capabilityDiscovery`
- `capabilityDiscoveryKind` / `capability_kind`
- `capabilityCategory` / `capability_category`

## TurnPlan Output

Each call to `planTurn()` returns a `TurnPlan` with three sections:

```typescript
interface TurnPlan {
  policy: {
    plannerVersion: string;          // 'agentos-turn-planner-v1'
    toolFailureMode: ToolFailureMode;
    toolSelectionMode: ToolSelectionMode;
  };
  capability: {
    enabled: boolean;
    query: string;                   // the user message used for discovery
    kind: CapabilityKind | 'any';
    selectedToolNames: string[];     // tools the GMI will see
    promptContext?: string;          // discovery context for the prompt
    fallbackApplied?: boolean;
    fallbackReason?: string;
  };
  diagnostics: {
    planningLatencyMs: number;
    discoveryAttempted: boolean;
    discoveryApplied: boolean;
    discoveryAttempts: number;
    usedFallback: boolean;
  };
}
```

## Fallback Behavior

The planner applies fallbacks in two scenarios:

1. **Discovery returns no tool matches:** Selection mode falls back from `discovered` to `all` so the GMI has the full tool set. `fallbackReason` explains why.
2. **Discovery throws an error:** In `fail_open` mode, the planner logs a warning and falls back to `all`. In `fail_closed` mode, it throws immediately.

## Related

- [Capability Discovery](/features/capability-discovery) -- the semantic discovery engine the planner delegates to
- [Capability Discovery Guide](/features/discovery-guide) -- integration patterns and CAPABILITY.yaml format
- [Query Router](/features/query-routing) -- a separate pipeline that routes queries to knowledge retrieval
- **API Reference:** [`AgentOSTurnPlanner`](/api/classes/AgentOSTurnPlanner) | [`TurnPlannerConfig`](/api/interfaces/TurnPlannerConfig)
