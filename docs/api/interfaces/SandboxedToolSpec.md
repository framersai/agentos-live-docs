# Interface: SandboxedToolSpec

Defined in: [packages/agentos/src/emergent/types.ts:134](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L134)

Implementation specification for a tool whose logic is arbitrary code
executed in a memory/time-bounded sandbox.

The sandboxed function signature must be:
```ts
async function run(input: unknown): Promise<unknown>
```
The engine calls `run(input)` and returns its resolved value as the tool output.

## Properties

### allowlist

> **allowlist**: [`SandboxAPI`](../type-aliases/SandboxAPI.md)[]

Defined in: [packages/agentos/src/emergent/types.ts:156](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L156)

Explicit allowlist of sandbox APIs the code may invoke.
Any call to an API not in this list will throw at runtime.

***

### code

> **code**: `string`

Defined in: [packages/agentos/src/emergent/types.ts:150](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L150)

The full source code of the sandboxed module.
Must export or define an async `run` function as its entry point.

#### Example

```ts
async function run(input) {
  const res = await fetch(`https://api.example.com?q=${input.query}`);
  return res.json();
}
```

***

### mode

> **mode**: `"sandbox"`

Defined in: [packages/agentos/src/emergent/types.ts:136](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L136)

Discriminant: always `'sandbox'` for sandboxed specs.
