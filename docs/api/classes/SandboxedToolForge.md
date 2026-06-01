# Class: SandboxedToolForge

Defined in: [packages/agentos/src/cognition/emergent/SandboxedToolForge.ts:146](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/SandboxedToolForge.ts#L146)

Runs agent-generated code in a hardened node:vm sandbox via [CodeSandbox](CodeSandbox.md).

Runtime bounds:
- Memory: observed as a heap delta, not preemptively capped
- Execution time: configurable wall-clock timeout, default 5000 ms
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

Defined in: [packages/agentos/src/cognition/emergent/SandboxedToolForge.ts:172](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/SandboxedToolForge.ts#L172)

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

Defined in: [packages/agentos/src/cognition/emergent/SandboxedToolForge.ts:324](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/SandboxedToolForge.ts#L324)

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

Defined in: [packages/agentos/src/cognition/emergent/SandboxedToolForge.ts:252](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/SandboxedToolForge.ts#L252)

#### Parameters

##### code

`string`

##### allowlist

[`SandboxAPI`](../type-aliases/SandboxAPI.md)[]

#### Returns

`object`

##### valid

> **valid**: `boolean`

##### violations

> **violations**: `string`[]
