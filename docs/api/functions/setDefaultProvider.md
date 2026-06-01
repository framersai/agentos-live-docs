# Function: setDefaultProvider()

> **setDefaultProvider**(`config?`): `void`

Defined in: [packages/agentos/src/api/runtime/global-default.ts:56](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/runtime/global-default.ts#L56)

Set the module-level default provider configuration.

Call once at application boot. Pass `undefined` to clear.

## Parameters

### config?

[`GlobalDefaultProvider`](../interfaces/GlobalDefaultProvider.md)

## Returns

`void`

## Example

```ts
import { setDefaultProvider, generateText } from '@framers/agentos';

setDefaultProvider({ provider: 'openai', apiKey: process.env.MY_OWN_KEY });

// Every subsequent call inherits these defaults:
const { text } = await generateText({ prompt: 'hello' });
```
