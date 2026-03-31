# Interface: ILogger

Defined in: [packages/agentos/src/core/logging/ILogger.ts:1](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/logging/ILogger.ts#L1)

## Methods

### child()?

> `optional` **child**(`bindings`): `ILogger`

Defined in: [packages/agentos/src/core/logging/ILogger.ts:1](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/logging/ILogger.ts#L1)

#### Parameters

##### bindings

`Record`\<`string`, `any`\>

#### Returns

`ILogger`

***

### debug()?

> `optional` **debug**(`message`, `meta?`): `void`

Defined in: [packages/agentos/src/core/logging/ILogger.ts:1](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/logging/ILogger.ts#L1)

#### Parameters

##### message

`string`

##### meta?

`Record`\<`string`, `any`\>

#### Returns

`void`

***

### error()

> **error**(`message`, `meta?`): `void`

Defined in: [packages/agentos/src/core/logging/ILogger.ts:1](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/logging/ILogger.ts#L1)

#### Parameters

##### message

`string`

##### meta?

`Record`\<`string`, `any`\>

#### Returns

`void`

***

### info()

> **info**(`message`, `meta?`): `void`

Defined in: [packages/agentos/src/core/logging/ILogger.ts:1](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/logging/ILogger.ts#L1)

#### Parameters

##### message

`string`

##### meta?

`Record`\<`string`, `any`\>

#### Returns

`void`

***

### warn()

> **warn**(`message`, `meta?`): `void`

Defined in: [packages/agentos/src/core/logging/ILogger.ts:1](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/logging/ILogger.ts#L1)

#### Parameters

##### message

`string`

##### meta?

`Record`\<`string`, `any`\>

#### Returns

`void`
