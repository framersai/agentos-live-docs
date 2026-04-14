# Type Alias: CircuitState

> **CircuitState** = `"closed"` \| `"open"` \| `"half-open"`

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:8](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/runtime/CircuitBreaker.ts#L8)

## File

CircuitBreaker.ts

## Description

Classic three-state circuit breaker (closed → open → half-open → closed)
that wraps any async operation. When failures exceed a threshold within a window,
the circuit opens and rejects calls immediately for a cooldown period.
