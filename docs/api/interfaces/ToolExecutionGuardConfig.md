# Interface: ToolExecutionGuardConfig

Defined in: [packages/agentos/src/safety/runtime/ToolExecutionGuard.ts:10](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/runtime/ToolExecutionGuard.ts#L10)

## Properties

### circuitBreakerConfig?

> `optional` **circuitBreakerConfig**: `Partial`\<`Omit`\<[`CircuitBreakerConfig`](CircuitBreakerConfig.md), `"name"`\>\>

Defined in: [packages/agentos/src/safety/runtime/ToolExecutionGuard.ts:18](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/runtime/ToolExecutionGuard.ts#L18)

Circuit breaker config applied to each tool.

***

### defaultTimeoutMs

> **defaultTimeoutMs**: `number`

Defined in: [packages/agentos/src/safety/runtime/ToolExecutionGuard.ts:12](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/runtime/ToolExecutionGuard.ts#L12)

Default timeout per tool execution in ms.

#### Default

```ts
30000
```

***

### enableCircuitBreaker

> **enableCircuitBreaker**: `boolean`

Defined in: [packages/agentos/src/safety/runtime/ToolExecutionGuard.ts:16](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/runtime/ToolExecutionGuard.ts#L16)

Whether to enable per-tool circuit breakers.

#### Default

```ts
true
```

***

### toolTimeouts?

> `optional` **toolTimeouts**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/safety/runtime/ToolExecutionGuard.ts:14](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/runtime/ToolExecutionGuard.ts#L14)

Per-tool timeout overrides.
