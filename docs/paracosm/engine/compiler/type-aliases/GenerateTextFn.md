# Type Alias: GenerateTextFn()

> **GenerateTextFn** = (`promptOrOptions`) => `Promise`\<`string`\>

Defined in: [apps/paracosm/src/engine/compiler/types.ts:20](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/types.ts#L20)

Function signature for LLM text generation calls used by compile hooks.

Supports two call shapes:
- Legacy: pass a raw prompt string (no caching)
- Cache-aware: pass `{ system, prompt }` to route the stable prefix
  through cacheBreakpoint-tagged system blocks

Wrappers in llm-invocations/ always use the cache-aware form; direct
callers (CLI scripts, tests) can still use the string form.

## Parameters

### promptOrOptions

`string` |

\{ `maxTokens?`: `number`; `prompt`: `string`; `system?`: `object`[]; \}

#### maxTokens?

`number`

Upper bound on completion tokens for this call. Caps tail spend
when a model misbehaves and yaps beyond the intended output
size (provider defaults sit at 4-8k tokens). Use ~2× the
typical response size so well-behaved calls finish naturally
and only runaway generations hit the cap.

#### prompt

`string`

#### system?

`object`[]

## Returns

`Promise`\<`string`\>
