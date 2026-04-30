# Type Alias: CircuitState

> **CircuitState** = `"closed"` \| `"open"` \| `"half-open"`

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:8](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/runtime/CircuitBreaker.ts#L8)

## File

CircuitBreaker.ts

## Description

Classic three-state circuit breaker (closed → open → half-open → closed)
that wraps any async operation. When failures exceed a threshold within a window,
the circuit opens and rejects calls immediately for a cooldown period.
