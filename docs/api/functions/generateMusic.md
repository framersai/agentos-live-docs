# Function: generateMusic()

> **generateMusic**(`opts`): `Promise`\<[`GenerateMusicResult`](../interfaces/GenerateMusicResult.md)\>

Defined in: [packages/agentos/src/api/generateMusic.ts:314](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateMusic.ts#L314)

Generates music using a provider-agnostic interface.

Resolves provider credentials via explicit options or environment variable
auto-detection, initialises the matching audio provider (optionally wrapped
in a fallback chain), and returns a normalised [GenerateMusicResult](../interfaces/GenerateMusicResult.md).

## Parameters

### opts

[`GenerateMusicOptions`](../interfaces/GenerateMusicOptions.md)

Music generation options.

## Returns

`Promise`\<[`GenerateMusicResult`](../interfaces/GenerateMusicResult.md)\>

A promise resolving to the generation result with audio data and metadata.

## Example

```ts
const result = await generateMusic({
  prompt: 'Upbeat lo-fi hip hop beat with vinyl crackle and mellow piano',
  durationSec: 60,
});
console.log(result.audio[0].url);
```
