# Interface: PricingInfo

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:114](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/marketplace/store/IMarketplace.ts#L114)

Pricing information

## Properties

### billingPeriod?

> `optional` **billingPeriod**: `"monthly"` \| `"yearly"`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:122](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/marketplace/store/IMarketplace.ts#L122)

Billing period for subscriptions

***

### currency?

> `optional` **currency**: `string`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:120](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/marketplace/store/IMarketplace.ts#L120)

Currency code

***

### freeTierLimits?

> `optional` **freeTierLimits**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:130](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/marketplace/store/IMarketplace.ts#L130)

Free tier limits

***

### model

> **model**: `"free"` \| `"one_time"` \| `"subscription"` \| `"usage_based"` \| `"freemium"`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:116](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/marketplace/store/IMarketplace.ts#L116)

Pricing model

***

### priceInCents?

> `optional` **priceInCents**: `number`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:118](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/marketplace/store/IMarketplace.ts#L118)

Price in cents (for one_time or subscription)

***

### usageTiers?

> `optional` **usageTiers**: `object`[]

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:124](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/marketplace/store/IMarketplace.ts#L124)

Usage pricing tiers

#### pricePerUnit

> **pricePerUnit**: `number`

#### unit

> **unit**: `string`

#### upTo

> **upTo**: `number`
