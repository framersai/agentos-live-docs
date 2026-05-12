# Function: setProviderPriority()

> **setProviderPriority**(`providers?`): `void`

Defined in: [packages/agentos/src/api/runtime/provider-priority.ts:42](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/runtime/provider-priority.ts#L42)

Set a custom provider priority order for auto-detection. The first
provider in the list whose env var (or CLI binary) is available will
be picked. Providers not in the list are skipped entirely — pass the
full set you want considered.

Throws if any provider id is unknown to the runtime (typo guard).

## Parameters

### providers?

readonly `string`[]

## Returns

`void`

## Example

```ts
import { setProviderPriority, generateText } from '@framers/agentos';

// Prefer Anthropic over OpenAI even if both keys are set:
setProviderPriority(['anthropic', 'openai', 'ollama']);

const { text } = await generateText({ prompt: 'hi' });
```
