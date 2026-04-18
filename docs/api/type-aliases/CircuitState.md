# Type Alias: CircuitState

> **CircuitState** = `"closed"` \| `"open"` \| `"half-open"`

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:8](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/runtime/CircuitBreaker.ts#L8)

## File

CircuitBreaker.ts

## Description

Classic three-state circuit breaker (closed → open → half-open → closed)
that wraps any async operation. When failures exceed a threshold within a window,
the circuit opens and rejects calls immediately for a cooldown period.
