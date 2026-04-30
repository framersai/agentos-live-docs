# Interface: RateLimitBannerThresholds

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:51](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/rate-limiting/types.ts#L51)

Banner threshold configuration for rate limit warnings.

## Properties

### criticalThreshold

> **criticalThreshold**: `number`

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:62](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/rate-limiting/types.ts#L62)

Show critical banner when remaining requests drop below this percentage.

#### Default

```ts
10
```

***

### warningThreshold

> **warningThreshold**: `number`

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:56](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/rate-limiting/types.ts#L56)

Show warning banner when remaining requests drop below this percentage.

#### Default

```ts
25
```
