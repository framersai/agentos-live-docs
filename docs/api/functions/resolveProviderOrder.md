# Function: resolveProviderOrder()

> **resolveProviderOrder**(`available`, `preferences?`): `string`[]

Defined in: [packages/agentos/src/media/ProviderPreferences.ts:129](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/ProviderPreferences.ts#L129)

Filter and reorder an "available" provider list according to user
preferences.

Resolution rules (applied in order):

1. If `preferences` is `undefined` or empty, return `available` unchanged.
2. If `preferred` is set, keep only providers that appear in **both**
   `available` and `preferred`, preserving the order of `preferred`.
3. If `blocked` is set, remove any provider whose ID appears in `blocked`.

The result is never longer than `available` and never contains duplicates.

## Parameters

### available

`string`[]

Provider IDs currently available in the system.

### preferences?

[`MediaProviderPreference`](../interfaces/MediaProviderPreference.md)

Optional preference configuration.

## Returns

`string`[]

Filtered and reordered provider ID list.

## Example

```ts
resolveProviderOrder(['a', 'b', 'c'], { preferred: ['c', 'a'] });
// => ['c', 'a']

resolveProviderOrder(['a', 'b', 'c'], { blocked: ['b'] });
// => ['a', 'c']
```
