# Interface: RateLimitBannerThresholds

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:51](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/rate-limiting/types.ts#L51)

Banner threshold configuration for rate limit warnings.

## Properties

### criticalThreshold

> **criticalThreshold**: `number`

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:62](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/rate-limiting/types.ts#L62)

Show critical banner when remaining requests drop below this percentage.

#### Default

```ts
10
```

***

### warningThreshold

> **warningThreshold**: `number`

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:56](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/rate-limiting/types.ts#L56)

Show warning banner when remaining requests drop below this percentage.

#### Default

```ts
25
```
