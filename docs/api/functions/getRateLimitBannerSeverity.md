# Function: getRateLimitBannerSeverity()

> **getRateLimitBannerSeverity**(`info`, `thresholds?`): `"critical"` \| `"warning"` \| `"none"`

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:89](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/rate-limiting/types.ts#L89)

Determine banner severity based on remaining percentage and thresholds.

## Parameters

### info

[`RateLimitInfo`](../type-aliases/RateLimitInfo.md)

Rate limit information

### thresholds?

[`RateLimitBannerThresholds`](../interfaces/RateLimitBannerThresholds.md) = `DEFAULT_RATE_LIMIT_BANNER_THRESHOLDS`

Banner threshold configuration (optional, uses defaults)

## Returns

`"critical"` \| `"warning"` \| `"none"`

'none' | 'warning' | 'critical'
