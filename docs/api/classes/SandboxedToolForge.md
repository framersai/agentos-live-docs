# Class: SandboxedToolForge

Defined in: [packages/agentos/src/emergent/SandboxedToolForge.ts:134](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/emergent/SandboxedToolForge.ts#L134)

Runs agent-generated code in an isolated sandbox with strict resource limits.

Attempts to use `isolated-vm` for true V8 isolate sandboxing. Falls back to
Node.js `vm` module with timeout if `isolated-vm` is not installed.

Resource limits:
- Memory: configurable, default 128 MB
- Execution time: configurable, default 5000 ms
- Blocked APIs: eval, Function, process, require, import, child_process, fs.write*

Allowlisted APIs (each requires explicit opt-in):
- `fetch`: HTTP requests (domain-restricted)
- `fs.readFile`: Read-only file access (path-restricted, max 1 MB)
- `crypto`: Hashing and HMAC only

## Example

```ts
const forge = new SandboxedToolForge({ timeoutMs: 3000 });

const result = await forge.execute({
  code: 'function execute(input) { return input.a + input.b; }',
  input: { a: 2, b: 3 },
  allowlist: [],
  memoryMB: 128,
  timeoutMs: 3000,
});

console.log(result.output); // 5
```

## Constructors

### Constructor

> **new SandboxedToolForge**(`config?`): `SandboxedToolForge`

Defined in: [packages/agentos/src/emergent/SandboxedToolForge.ts:153](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/emergent/SandboxedToolForge.ts#L153)

Create a new SandboxedToolForge instance.

#### Parameters

##### config?

[`SandboxedToolForgeConfig`](../interfaces/SandboxedToolForgeConfig.md)

Optional configuration overrides. All fields have sensible
  defaults (128 MB memory, 5000 ms timeout, no domain restrictions).

#### Returns

`SandboxedToolForge`

## Methods

### execute()

> **execute**(`request`): `Promise`\<[`SandboxExecutionResult`](../interfaces/SandboxExecutionResult.md)\>

Defined in: [packages/agentos/src/emergent/SandboxedToolForge.ts:264](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/emergent/SandboxedToolForge.ts#L264)

Execute agent-generated code in the sandbox.

The code must define a function named `execute` that accepts a single
argument and returns the output:

```js
function execute(input) { return input.a + input.b; }
```

Execution flow:
1. Run `validateCode()` — reject immediately if violations are found.
2. Wrap the agent's code into a self-contained expression that calls `execute`.
3. Run in a Node.js `vm` sandbox with a restricted global context.
4. Parse the output, measure execution time, and return the result.

#### Parameters

##### request

[`SandboxExecutionRequest`](../interfaces/SandboxExecutionRequest.md)

The execution request containing code, input, allowlist,
  and resource limits.

#### Returns

`Promise`\<[`SandboxExecutionResult`](../interfaces/SandboxExecutionResult.md)\>

A [SandboxExecutionResult](../interfaces/SandboxExecutionResult.md) with the output (on success) or
  error description (on failure), plus execution time telemetry.

#### Example

```ts
const result = await forge.execute({
  code: 'function execute(input) { return { sum: input.a + input.b }; }',
  input: { a: 10, b: 20 },
  allowlist: [],
  memoryMB: 128,
  timeoutMs: 5000,
});
// result.success === true
// result.output === { sum: 30 }
```

***

### validateCode()

> **validateCode**(`code`, `allowlist`): `object`

Defined in: [packages/agentos/src/emergent/SandboxedToolForge.ts:192](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/emergent/SandboxedToolForge.ts#L192)

Static analysis of code — reject dangerous patterns before execution.

Scans the source string for banned API usage patterns using regex matching.
If an API is not present in the allowlist, references to it are also flagged.

Checked patterns (always banned):
- `eval()`, `new Function()`, `require()`, `import`, `process.*`
- `child_process`, `fs.write*`, `fs.unlink`, `fs.rm`, `fs.rmdir`

Conditionally banned (when not in allowlist):
- `fetch(` — when `'fetch'` is not in the allowlist
- `fs.*` — when `'fs.readFile'` is not in the allowlist
- `crypto.*` — when `'crypto'` is not in the allowlist

#### Parameters

##### code

`string`

The raw source code string to validate.

##### allowlist

[`SandboxAPI`](../type-aliases/SandboxAPI.md)[]

The set of APIs the code is permitted to use.

#### Returns

`object`

An object with `valid: true` if no violations were found, or
  `valid: false` with a `violations` array describing each flagged pattern.

##### valid

> **valid**: `boolean`

##### violations

> **violations**: `string`[]

#### Example

```ts
const forge = new SandboxedToolForge();
const result = forge.validateCode('eval("exploit")', []);
// result.valid === false
// result.violations === ['eval() is forbidden']
```
