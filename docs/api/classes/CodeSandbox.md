# Class: CodeSandbox

Defined in: [packages/agentos/src/safety/sandbox/executor/CodeSandbox.ts:132](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/CodeSandbox.ts#L132)

Code Execution Sandbox implementation.

Provides isolated code execution with security controls.

## Implements

- [`ICodeSandbox`](../interfaces/ICodeSandbox.md)

## Constructors

### Constructor

> **new CodeSandbox**(`defaultConfig?`): `CodeSandbox`

Defined in: [packages/agentos/src/safety/sandbox/executor/CodeSandbox.ts:139](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/CodeSandbox.ts#L139)

#### Parameters

##### defaultConfig?

`Partial`\<[`SandboxConfig`](../interfaces/SandboxConfig.md)\>

#### Returns

`CodeSandbox`

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/safety/sandbox/executor/CodeSandbox.ts:667](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/CodeSandbox.ts#L667)

Disposes of the sandbox.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ICodeSandbox`](../interfaces/ICodeSandbox.md).[`dispose`](../interfaces/ICodeSandbox.md#dispose)

***

### execute()

> **execute**(`request`): `Promise`\<[`ExecutionResult`](../interfaces/ExecutionResult.md)\>

Defined in: [packages/agentos/src/safety/sandbox/executor/CodeSandbox.ts:158](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/CodeSandbox.ts#L158)

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

Defined in: [packages/agentos/src/safety/sandbox/executor/CodeSandbox.ts:601](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/CodeSandbox.ts#L601)

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

Defined in: [packages/agentos/src/safety/sandbox/executor/CodeSandbox.ts:631](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/CodeSandbox.ts#L631)

Gets sandbox statistics.

#### Returns

[`SandboxStats`](../interfaces/SandboxStats.md)

#### Implementation of

[`ICodeSandbox`](../interfaces/ICodeSandbox.md).[`getStats`](../interfaces/ICodeSandbox.md#getstats)

***

### getSupportedLanguages()

> **getSupportedLanguages**(): [`SandboxLanguage`](../type-aliases/SandboxLanguage.md)[]

Defined in: [packages/agentos/src/safety/sandbox/executor/CodeSandbox.ts:624](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/CodeSandbox.ts#L624)

Gets supported languages.

#### Returns

[`SandboxLanguage`](../type-aliases/SandboxLanguage.md)[]

#### Implementation of

[`ICodeSandbox`](../interfaces/ICodeSandbox.md).[`getSupportedLanguages`](../interfaces/ICodeSandbox.md#getsupportedlanguages)

***

### initialize()

> **initialize**(`logger?`, `defaultConfig?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/safety/sandbox/executor/CodeSandbox.ts:147](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/CodeSandbox.ts#L147)

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

Defined in: [packages/agentos/src/safety/sandbox/executor/CodeSandbox.ts:617](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/CodeSandbox.ts#L617)

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

Defined in: [packages/agentos/src/safety/sandbox/executor/CodeSandbox.ts:584](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/CodeSandbox.ts#L584)

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

Defined in: [packages/agentos/src/safety/sandbox/executor/CodeSandbox.ts:608](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/CodeSandbox.ts#L608)

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

Defined in: [packages/agentos/src/safety/sandbox/executor/CodeSandbox.ts:638](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/CodeSandbox.ts#L638)

Resets statistics.

#### Returns

`void`

#### Implementation of

[`ICodeSandbox`](../interfaces/ICodeSandbox.md).[`resetStats`](../interfaces/ICodeSandbox.md#resetstats)

***

### validateCode()

> **validateCode**(`language`, `code`): [`SecurityEvent`](../interfaces/SecurityEvent.md)[]

Defined in: [packages/agentos/src/safety/sandbox/executor/CodeSandbox.ts:645](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/CodeSandbox.ts#L645)

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
