# Function: calculateRemainingPercentage()

> **calculateRemainingPercentage**(`info`): `number` \| `null`

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:78](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/rate-limiting/types.ts#L78)

Calculate remaining percentage from rate limit info.

## Parameters

### info

[`RateLimitInfo`](../type-aliases/RateLimitInfo.md)

Rate limit information (must be public tier)

## Returns

`number` \| `null`

Percentage of remaining requests (0-100), or null if not applicable
