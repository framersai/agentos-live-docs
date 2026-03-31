# Class: CodeSandbox

Defined in: [packages/agentos/src/sandbox/executor/CodeSandbox.ts:104](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/CodeSandbox.ts#L104)

Code Execution Sandbox implementation.

Provides isolated code execution with security controls.

## Implements

- [`ICodeSandbox`](../interfaces/ICodeSandbox.md)

## Constructors

### Constructor

> **new CodeSandbox**(`defaultConfig?`): `CodeSandbox`

Defined in: [packages/agentos/src/sandbox/executor/CodeSandbox.ts:111](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/CodeSandbox.ts#L111)

#### Parameters

##### defaultConfig?

`Partial`\<[`SandboxConfig`](../interfaces/SandboxConfig.md)\>

#### Returns

`CodeSandbox`

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/sandbox/executor/CodeSandbox.ts:615](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/CodeSandbox.ts#L615)

Disposes of the sandbox.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ICodeSandbox`](../interfaces/ICodeSandbox.md).[`dispose`](../interfaces/ICodeSandbox.md#dispose)

***

### execute()

> **execute**(`request`): `Promise`\<[`ExecutionResult`](../interfaces/ExecutionResult.md)\>

Defined in: [packages/agentos/src/sandbox/executor/CodeSandbox.ts:130](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/CodeSandbox.ts#L130)

Executes code in the sandbox.

#### Parameters

##### request

[`ExecutionRequest`](../interfaces/ExecutionRequest.md)

#### Returns

`Promise`\<[`ExecutionResult`](../interfaces/ExecutionResult.md)\>

#### Implementation of

[`ICodeSandbox`](../interfaces/ICodeSandbox.md).[`execute`](../interfaces/ICodeSandbox.md#execute)

***

### getExecution()

> **getExecution**(`executionId`): `Promise`\<[`ExecutionResult`](../interfaces/ExecutionResult.md) \| `undefined`\>

Defined in: [packages/agentos/src/sandbox/executor/CodeSandbox.ts:549](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/CodeSandbox.ts#L549)

Gets the status of an execution.

#### Parameters

##### executionId

`string`

#### Returns

`Promise`\<[`ExecutionResult`](../interfaces/ExecutionResult.md) \| `undefined`\>

#### Implementation of

[`ICodeSandbox`](../interfaces/ICodeSandbox.md).[`getExecution`](../interfaces/ICodeSandbox.md#getexecution)

***

### getStats()

> **getStats**(): [`SandboxStats`](../interfaces/SandboxStats.md)

Defined in: [packages/agentos/src/sandbox/executor/CodeSandbox.ts:579](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/CodeSandbox.ts#L579)

Gets sandbox statistics.

#### Returns

[`SandboxStats`](../interfaces/SandboxStats.md)

#### Implementation of

[`ICodeSandbox`](../interfaces/ICodeSandbox.md).[`getStats`](../interfaces/ICodeSandbox.md#getstats)

***

### getSupportedLanguages()

> **getSupportedLanguages**(): [`SandboxLanguage`](../type-aliases/SandboxLanguage.md)[]

Defined in: [packages/agentos/src/sandbox/executor/CodeSandbox.ts:572](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/CodeSandbox.ts#L572)

Gets supported languages.

#### Returns

[`SandboxLanguage`](../type-aliases/SandboxLanguage.md)[]

#### Implementation of

[`ICodeSandbox`](../interfaces/ICodeSandbox.md).[`getSupportedLanguages`](../interfaces/ICodeSandbox.md#getsupportedlanguages)

***

### initialize()

> **initialize**(`logger?`, `defaultConfig?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/sandbox/executor/CodeSandbox.ts:119](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/CodeSandbox.ts#L119)

Initializes the sandbox.

#### Parameters

##### logger?

[`ILogger`](../interfaces/ILogger.md)

##### defaultConfig?

[`SandboxConfig`](../interfaces/SandboxConfig.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ICodeSandbox`](../interfaces/ICodeSandbox.md).[`initialize`](../interfaces/ICodeSandbox.md#initialize)

***

### isLanguageSupported()

> **isLanguageSupported**(`language`): `boolean`

Defined in: [packages/agentos/src/sandbox/executor/CodeSandbox.ts:565](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/CodeSandbox.ts#L565)

Checks if a language is supported.

#### Parameters

##### language

`string`

#### Returns

`boolean`

#### Implementation of

[`ICodeSandbox`](../interfaces/ICodeSandbox.md).[`isLanguageSupported`](../interfaces/ICodeSandbox.md#islanguagesupported)

***

### kill()

> **kill**(`executionId`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/sandbox/executor/CodeSandbox.ts:532](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/CodeSandbox.ts#L532)

Kills a running execution.

#### Parameters

##### executionId

`string`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`ICodeSandbox`](../interfaces/ICodeSandbox.md).[`kill`](../interfaces/ICodeSandbox.md#kill)

***

### listExecutions()

> **listExecutions**(`limit?`): `Promise`\<[`ExecutionResult`](../interfaces/ExecutionResult.md)[]\>

Defined in: [packages/agentos/src/sandbox/executor/CodeSandbox.ts:556](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/CodeSandbox.ts#L556)

Lists recent executions.

#### Parameters

##### limit?

`number` = `50`

#### Returns

`Promise`\<[`ExecutionResult`](../interfaces/ExecutionResult.md)[]\>

#### Implementation of

[`ICodeSandbox`](../interfaces/ICodeSandbox.md).[`listExecutions`](../interfaces/ICodeSandbox.md#listexecutions)

***

### resetStats()

> **resetStats**(): `void`

Defined in: [packages/agentos/src/sandbox/executor/CodeSandbox.ts:586](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/CodeSandbox.ts#L586)

Resets statistics.

#### Returns

`void`

#### Implementation of

[`ICodeSandbox`](../interfaces/ICodeSandbox.md).[`resetStats`](../interfaces/ICodeSandbox.md#resetstats)

***

### validateCode()

> **validateCode**(`language`, `code`): [`SecurityEvent`](../interfaces/SecurityEvent.md)[]

Defined in: [packages/agentos/src/sandbox/executor/CodeSandbox.ts:593](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/CodeSandbox.ts#L593)

Validates code for security issues.

#### Parameters

##### language

[`SandboxLanguage`](../type-aliases/SandboxLanguage.md)

##### code

`string`

#### Returns

[`SecurityEvent`](../interfaces/SecurityEvent.md)[]

#### Implementation of

[`ICodeSandbox`](../interfaces/ICodeSandbox.md).[`validateCode`](../interfaces/ICodeSandbox.md#validatecode)
