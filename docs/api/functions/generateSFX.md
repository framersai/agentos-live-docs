# Function: generateSFX()

> **generateSFX**(`opts`): `Promise`\<[`GenerateSFXResult`](../interfaces/GenerateSFXResult.md)\>

Defined in: [packages/agentos/src/api/generateSFX.ts:310](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateSFX.ts#L310)

Generates a sound effect using a provider-agnostic interface.

Resolves provider credentials via explicit options or environment variable
auto-detection, initialises the matching audio provider (optionally wrapped
in a fallback chain), and returns a normalised [GenerateSFXResult](../interfaces/GenerateSFXResult.md).

## Parameters

### opts

[`GenerateSFXOptions`](../interfaces/GenerateSFXOptions.md)

SFX generation options.

## Returns

`Promise`\<[`GenerateSFXResult`](../interfaces/GenerateSFXResult.md)\>

A promise resolving to the generation result with audio data and metadata.

## Example

```ts
const result = await generateSFX({
  prompt: 'Thunder crack followed by heavy rain on a tin roof',
  durationSec: 5,
});
console.log(result.audio[0].url);
```
