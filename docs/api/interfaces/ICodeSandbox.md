# Interface: ICodeSandbox

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:211](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L211)

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

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:282](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L282)

Disposes of the sandbox and cleans up resources.

#### Returns

`Promise`\<`void`\>

***

### execute()

> **execute**(`request`): `Promise`\<[`ExecutionResult`](ExecutionResult.md)\>

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:224](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L224)

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

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:238](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L238)

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

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:264](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L264)

Gets sandbox statistics.

#### Returns

[`SandboxStats`](SandboxStats.md)

Current statistics

***

### getSupportedLanguages()

> **getSupportedLanguages**(): [`SandboxLanguage`](../type-aliases/SandboxLanguage.md)[]

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:258](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L258)

Gets supported languages.

#### Returns

[`SandboxLanguage`](../type-aliases/SandboxLanguage.md)[]

Array of supported languages

***

### initialize()

> **initialize**(`logger?`, `defaultConfig?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:217](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L217)

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

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:252](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L252)

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

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:231](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L231)

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

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:245](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L245)

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

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:269](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L269)

Resets statistics.

#### Returns

`void`

***

### validateCode()

> **validateCode**(`language`, `code`): [`SecurityEvent`](SecurityEvent.md)[]

Defined in: [packages/agentos/src/safety/sandbox/executor/ICodeSandbox.ts:277](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/sandbox/executor/ICodeSandbox.ts#L277)

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
