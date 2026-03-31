# Interface: ICodeSandbox

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:196](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/ICodeSandbox.ts#L196)

Interface for the Code Execution Sandbox.

## Example

```typescript
const sandbox = new CodeSandbox();

const result = await sandbox.execute({
  language: 'python',
  code: `
    import json
    data = {"result": 42}
    print(json.dumps(data))
  `,
});

console.log(result.output?.stdout); // '{"result": 42}'
```

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:267](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/ICodeSandbox.ts#L267)

Disposes of the sandbox and cleans up resources.

#### Returns

`Promise`\<`void`\>

***

### execute()

> **execute**(`request`): `Promise`\<[`ExecutionResult`](ExecutionResult.md)\>

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:209](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/ICodeSandbox.ts#L209)

Executes code in the sandbox.

#### Parameters

##### request

[`ExecutionRequest`](ExecutionRequest.md)

Execution request

#### Returns

`Promise`\<[`ExecutionResult`](ExecutionResult.md)\>

Execution result

***

### getExecution()

> **getExecution**(`executionId`): `Promise`\<[`ExecutionResult`](ExecutionResult.md) \| `undefined`\>

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:223](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/ICodeSandbox.ts#L223)

Gets the status of an execution.

#### Parameters

##### executionId

`string`

ID of the execution

#### Returns

`Promise`\<[`ExecutionResult`](ExecutionResult.md) \| `undefined`\>

Current execution result or undefined

***

### getStats()

> **getStats**(): [`SandboxStats`](SandboxStats.md)

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:249](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/ICodeSandbox.ts#L249)

Gets sandbox statistics.

#### Returns

[`SandboxStats`](SandboxStats.md)

Current statistics

***

### getSupportedLanguages()

> **getSupportedLanguages**(): [`SandboxLanguage`](../type-aliases/SandboxLanguage.md)[]

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:243](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/ICodeSandbox.ts#L243)

Gets supported languages.

#### Returns

[`SandboxLanguage`](../type-aliases/SandboxLanguage.md)[]

Array of supported languages

***

### initialize()

> **initialize**(`logger?`, `defaultConfig?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:202](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/ICodeSandbox.ts#L202)

Initializes the sandbox.

#### Parameters

##### logger?

[`ILogger`](ILogger.md)

Logger instance

##### defaultConfig?

[`SandboxConfig`](SandboxConfig.md)

Default configuration

#### Returns

`Promise`\<`void`\>

***

### isLanguageSupported()

> **isLanguageSupported**(`language`): `boolean`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:237](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/ICodeSandbox.ts#L237)

Checks if a language is supported.

#### Parameters

##### language

`string`

Language to check

#### Returns

`boolean`

Whether the language is supported

***

### kill()

> **kill**(`executionId`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:216](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/ICodeSandbox.ts#L216)

Kills a running execution.

#### Parameters

##### executionId

`string`

ID of the execution to kill

#### Returns

`Promise`\<`boolean`\>

Whether the kill was successful

***

### listExecutions()

> **listExecutions**(`limit?`): `Promise`\<[`ExecutionResult`](ExecutionResult.md)[]\>

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:230](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/ICodeSandbox.ts#L230)

Lists recent executions.

#### Parameters

##### limit?

`number`

Maximum number to return

#### Returns

`Promise`\<[`ExecutionResult`](ExecutionResult.md)[]\>

Array of execution results

***

### resetStats()

> **resetStats**(): `void`

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:254](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/ICodeSandbox.ts#L254)

Resets statistics.

#### Returns

`void`

***

### validateCode()

> **validateCode**(`language`, `code`): [`SecurityEvent`](SecurityEvent.md)[]

Defined in: [packages/agentos/src/sandbox/executor/ICodeSandbox.ts:262](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/sandbox/executor/ICodeSandbox.ts#L262)

Validates code for obvious security issues.

#### Parameters

##### language

[`SandboxLanguage`](../type-aliases/SandboxLanguage.md)

Programming language

##### code

`string`

Code to validate

#### Returns

[`SecurityEvent`](SecurityEvent.md)[]

Array of security concerns
