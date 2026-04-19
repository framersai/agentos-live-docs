# Function: resolveModelOption()

> **resolveModelOption**(`opts`, `task?`): `ParsedModel`

Defined in: [packages/agentos/src/api/model.ts:258](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/model.ts#L258)

Resolves a `{ providerId, modelId }` pair from flexible caller-supplied options.

Resolution priority:
1. **Explicit `model` string** — if it contains `":"` it is split directly
   (backwards-compatible `provider:model` format).  If it is a plain name and
   `provider` is set, the pair is used as-is.  If neither, auto-detection
   from env vars is attempted.
2. **`provider` only** — default model for the requested `task` is looked up
   in [PROVIDER\_DEFAULTS](../variables/PROVIDER_DEFAULTS.md).
3. **Neither** — auto-detect the first provider with a set API key/URL env
   var and use its default model for the requested `task`.

## Parameters

### opts

[`ModelOption`](../interfaces/ModelOption.md)

Caller options containing optional `provider` and/or `model`.

### task?

[`TaskType`](../type-aliases/TaskType.md) = `'text'`

Task type used to select the correct default model. Defaults to `"text"`.

## Returns

`ParsedModel`

A `ParsedModel` with `providerId` and `modelId`.

## Throws

When no provider can be determined, the provider is unknown,
  or the provider has no default model for the requested task.
