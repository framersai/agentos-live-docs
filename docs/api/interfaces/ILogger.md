# Interface: ILogger

Defined in: [packages/agentos/src/core/logging/ILogger.ts:1](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/logging/ILogger.ts#L1)

## Methods

### child()?

> `optional` **child**(`bindings`): `ILogger`

Defined in: [packages/agentos/src/core/logging/ILogger.ts:1](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/logging/ILogger.ts#L1)

#### Parameters

##### bindings

`Record`\<`string`, `any`\>

#### Returns

`ILogger`

***

### debug()?

> `optional` **debug**(`message`, `meta?`): `void`

Defined in: [packages/agentos/src/core/logging/ILogger.ts:1](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/logging/ILogger.ts#L1)

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

Defined in: [packages/agentos/src/core/logging/ILogger.ts:1](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/logging/ILogger.ts#L1)

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

Defined in: [packages/agentos/src/core/logging/ILogger.ts:1](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/logging/ILogger.ts#L1)

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

Defined in: [packages/agentos/src/core/logging/ILogger.ts:1](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/logging/ILogger.ts#L1)

#### Parameters

##### message

`string`

##### meta?

`Record`\<`string`, `any`\>

#### Returns

`void`
