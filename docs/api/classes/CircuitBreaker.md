# Class: CircuitBreaker

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:52](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/CircuitBreaker.ts#L52)

## Constructors

### Constructor

> **new CircuitBreaker**(`config`): `CircuitBreaker`

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:62](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/CircuitBreaker.ts#L62)

#### Parameters

##### config

`Partial`\<[`CircuitBreakerConfig`](../interfaces/CircuitBreakerConfig.md)\> & `object`

#### Returns

`CircuitBreaker`

## Methods

### execute()

> **execute**\<`T`\>(`fn`): `Promise`\<`T`\>

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:66](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/CircuitBreaker.ts#L66)

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>

***

### forceState()

> **forceState**(`state`): `void`

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:116](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/CircuitBreaker.ts#L116)

#### Parameters

##### state

[`CircuitState`](../type-aliases/CircuitState.md)

#### Returns

`void`

***

### getState()

> **getState**(): [`CircuitState`](../type-aliases/CircuitState.md)

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:128](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/CircuitBreaker.ts#L128)

#### Returns

[`CircuitState`](../type-aliases/CircuitState.md)

***

### getStats()

> **getStats**(): [`CircuitBreakerStats`](../interfaces/CircuitBreakerStats.md)

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:139](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/CircuitBreaker.ts#L139)

#### Returns

[`CircuitBreakerStats`](../interfaces/CircuitBreakerStats.md)

***

### recordFailure()

> **recordFailure**(): `void`

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:88](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/CircuitBreaker.ts#L88)

#### Returns

`void`

***

### recordSuccess()

> **recordSuccess**(): `void`

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:105](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/CircuitBreaker.ts#L105)

#### Returns

`void`

***

### reset()

> **reset**(): `void`

Defined in: [packages/agentos/src/safety/runtime/CircuitBreaker.ts:120](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/CircuitBreaker.ts#L120)

#### Returns

`void`
