# Function: selectWeightedProvider()

> **selectWeightedProvider**(`providers`, `weights?`): `string`

Defined in: [packages/agentos/src/media/ProviderPreferences.ts:215](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/ProviderPreferences.ts#L215)

Select a single provider from a list using optional per-provider weights.

Selection rules:

- If `providers` is empty, throws an `Error`.
- If `weights` is `undefined` or `providers` has exactly one entry, the
  first provider is returned deterministically.
- Otherwise a weighted random selection is performed: each provider's
  weight is looked up in `weights` (defaulting to `1` for unlisted
  providers), weights are summed, and a random value in `[0, sum)` picks
  the winner proportionally.

## Parameters

### providers

`string`[]

Non-empty list of provider IDs to choose from.

### weights?

`Record`\<`string`, `number`\>

Optional weight map. Providers not listed get weight `1`.

## Returns

`string`

The selected provider ID.

## Throws

When `providers` is empty.

## Example

```ts
// 90% suno, 10% udio (approximately)
selectWeightedProvider(['suno', 'udio'], { suno: 9, udio: 1 });
```
