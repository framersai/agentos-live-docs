---
title: "Tool Permissions & Security Tiers"
sidebar_position: 6
---

> Deep dive into the tool permission system, security tiers, and guardrail dispatch model. For the full system overview, see [System Architecture](./system-architecture.md).

## Overview

AgentOS enforces tool access through three cooperating subsystems:

1. **SecurityTier** -- a 5-level named tier controlling what tools and capabilities an agent can invoke.
2. **ToolPermissionManager** -- evaluates permission requests against persona capabilities, subscription features, and policy rules.
3. **ToolExecutionGuard** -- wraps tool execution with timeouts, failure tracking, and circuit breakers.

## Security Tiers

Defined in `packages/agentos/src/api/types.ts`:

```typescript
type SecurityTier = 'dangerous' | 'permissive' | 'balanced' | 'strict' | 'paranoid';
```

| Tier         | Description                                                  | Use case                       |
| ------------ | ------------------------------------------------------------ | ------------------------------ |
| `dangerous`  | No restrictions                                              | Trusted internal contexts only |
| `permissive` | Most capabilities enabled; network + filesystem allowed      | Developer workstations         |
| `balanced`   | Sensible defaults; destructive actions require approval      | Production default             |
| `strict`     | Read-only filesystem, no shell spawn, narrow tool allow-list | Multi-tenant SaaS              |
| `paranoid`   | Minimal surface; all side-effecting tools blocked            | Untrusted user input           |

Security tiers are set per-agent via `BaseAgentConfig`:

```typescript
const config: BaseAgentConfig = {
  security: { tier: 'balanced' },
  permissions: {
    tools: ['web_search', 'memory_read'], // explicit allow-list
  },
  guardrails: {
    input: ['pii-redaction'],
    output: ['toxicity-classifier'],
    tier: 'strict',
  },
};
```

## ToolPermissionManager

Located at `packages/agentos/src/core/tools/permissions/ToolPermissionManager.ts`.

### Permission Check Pipeline

`isExecutionAllowed()` runs checks in order:

```
PermissionCheckContext { tool, personaId, personaCapabilities, userContext }
  |
  +-- 1. Persona capability check (if strictCapabilityChecking enabled)
  |     - Does the persona have all tool.requiredCapabilities?
  |     - Missing capabilities -> DENY with list of missing caps
  |
  +-- 2. Subscription feature check
  |     - Does toolToSubscriptionFeatures map this tool to features?
  |     - Does ISubscriptionService confirm the user's tier grants them?
  |     - Missing features -> DENY with missing feature flags
  |
  +-- 3. All checks passed -> ALLOW
```

### Configuration

```typescript
interface ToolPermissionManagerConfig {
  /** Enforce persona capability matching. @default true */
  strictCapabilityChecking?: boolean;
  /** Map tool IDs to required subscription features. */
  toolToSubscriptionFeatures?: Record<string, FeatureFlag[]>;
  /** Log all permission check results. @default false */
  logToolCalls?: boolean;
}
```

### Dependency Injection

The manager accepts optional `IAuthService` and `ISubscriptionService` at initialization. When `toolToSubscriptionFeatures` entries exist but no subscription service is injected, access **defaults to ALLOW** with a warning -- preventing accidental lockout during development.

## ToolExecutionGuard

Located at `packages/agentos/src/safety/runtime/ToolExecutionGuard.ts`.

Wraps tool execution with operational safety controls:

```typescript
const guard = new ToolExecutionGuard({
  defaultTimeoutMs: 30_000,
  toolTimeouts: { web_search: 60_000 },
  enableCircuitBreaker: true,
  circuitBreakerConfig: {
    failureThreshold: 5,
    failureWindowMs: 60_000,
    cooldownMs: 30_000,
  },
});

const result = await guard.execute('web_search', async () => {
  return await searchTool.run(query);
});
// result: { success, result?, error?, durationMs, timedOut, toolName }
```

### Circuit Breaker

Each tool gets an independent circuit breaker with three states:

- **Closed** -- normal operation, tracking failures.
- **Open** -- tool has exceeded `failureThreshold` failures within `failureWindowMs`. All calls immediately return a circuit-open error for `cooldownMs`.
- **Half-Open** -- after cooldown, allows `halfOpenSuccessThreshold` test calls. If they succeed, circuit closes. If they fail, circuit re-opens.

### Health Reporting

```typescript
const health = guard.getToolHealth('web_search');
// { toolName, totalCalls, failures, timeouts, avgDurationMs, circuitState }

const allHealth = guard.getAllToolHealth();
// Array of ToolHealthReport for every tool that has been called
```

## ParallelGuardrailDispatcher

Located at `packages/agentos/src/safety/guardrails/ParallelGuardrailDispatcher.ts`.

Executes guardrails in two phases with worst-action aggregation:

### Phase 1: Sequential Sanitizers

Guardrails with `config.canSanitize === true` run one-at-a-time in registration order. Each sanitizer receives the cumulative output of all preceding sanitizers. A `BLOCK` result short-circuits the entire pipeline.

### Phase 2: Parallel Classifiers

Remaining guardrails run concurrently via `Promise.allSettled`. They receive the fully-sanitized text from Phase 1. Any `SANITIZE` result in Phase 2 is **downgraded to FLAG** because concurrent sanitization would produce non-deterministic results.

### Outcome Aggregation

Uses severity-based worst-wins: `BLOCK (3) > FLAG (2) > SANITIZE (1) > ALLOW (0)`.

```typescript
const outcome = await ParallelGuardrailDispatcher.evaluateInput(
  [piiRedactor, toxicityClassifier, policyGuard],
  userInput,
  guardrailContext
);
```

### RAG-Aware Guardrails

`GuardrailOutputPayload.ragSources` carries `RagRetrievedChunk[]` so grounding-aware guardrails can verify claims against retrieved evidence during output evaluation.

## Built-in Guardrail Packs

AgentOS exports five built-in guardrail packs from `@framers/agentos/extensions/packs/*`:

| Pack              | Purpose                                               |
| ----------------- | ----------------------------------------------------- |
| `pii-redaction`   | Detect and redact personally identifiable information |
| `ml-classifiers`  | ML-based content classification (toxicity, sentiment) |
| `topicality`      | Topic relevance filtering                             |
| `code-safety`     | Static analysis of generated code                     |
| `grounding-guard` | Verify claims against RAG-retrieved evidence          |

These are implemented inside the main AgentOS package and do not depend on Wunderland.

## Key Source Files

| File                                                                    | Purpose                         |
| ----------------------------------------------------------------------- | ------------------------------- |
| `packages/agentos/src/api/types.ts`                                     | `SecurityTier` type definition  |
| `packages/agentos/src/core/tools/permissions/ToolPermissionManager.ts`  | Permission check implementation |
| `packages/agentos/src/safety/runtime/ToolExecutionGuard.ts`             | Timeout + circuit breaker guard |
| `packages/agentos/src/safety/runtime/CircuitBreaker.ts`                 | Circuit breaker state machine   |
| `packages/agentos/src/safety/guardrails/ParallelGuardrailDispatcher.ts` | Two-phase guardrail dispatch    |

## See Also

- [Sandbox Security](/architecture/sandbox-security) -- code execution isolation
- [Extension Loading](/architecture/extension-loading) -- how guardrail packs are loaded
- [System Architecture](./system-architecture.md) -- full system overview
