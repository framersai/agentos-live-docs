# Interface: CircuitBreakerConfig

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:10](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/runtime/CircuitBreaker.ts#L10)

## Properties

### cooldownMs

> **cooldownMs**: `number`

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:18](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/runtime/CircuitBreaker.ts#L18)

How long to stay open before trying half-open.

#### Default

```ts
30000
```

***

### failureThreshold

> **failureThreshold**: `number`

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:14](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/runtime/CircuitBreaker.ts#L14)

Number of failures before opening the circuit.

#### Default

```ts
5
```

***

### failureWindowMs

> **failureWindowMs**: `number`

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:16](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/runtime/CircuitBreaker.ts#L16)

Time window in ms to count failures.

#### Default

```ts
60000
```

***

### halfOpenSuccessThreshold

> **halfOpenSuccessThreshold**: `number`

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:20](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/runtime/CircuitBreaker.ts#L20)

Number of successful probes in half-open before closing.

#### Default

```ts
2
```

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:12](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/runtime/CircuitBreaker.ts#L12)

Unique name for this breaker (for logging/metrics).

***

### onStateChange()?

> `optional` **onStateChange**: (`from`, `to`, `name`) => `void`

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:22](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/runtime/CircuitBreaker.ts#L22)

Optional callback when state transitions.

#### Parameters

##### from

[`CircuitState`](../type-aliases/CircuitState.md)

##### to

[`CircuitState`](../type-aliases/CircuitState.md)

##### name

`string`

#### Returns

`void`
