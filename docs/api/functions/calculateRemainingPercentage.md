# Function: calculateRemainingPercentage()

> **calculateRemainingPercentage**(`info`): `number` \| `null`

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:78](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/rate-limiting/types.ts#L78)

Calculate remaining percentage from rate limit info.

## Parameters

### info

[`RateLimitInfo`](../type-aliases/RateLimitInfo.md)

Rate limit information (must be public tier)

## Returns

`number` \| `null`

Percentage of remaining requests (0-100), or null if not applicable
