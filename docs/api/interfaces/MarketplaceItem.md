# Interface: MarketplaceItem

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:32](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L32)

Represents a marketplace item (agent, persona, workflow, etc.)

## Properties

### agentosVersion

> **agentosVersion**: `string`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:76](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L76)

Required AgentOS version

***

### bannerUrl?

> `optional` **bannerUrl**: `string`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:58](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L58)

Banner image URL

***

### categories

> **categories**: `string`[]

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:52](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L52)

Category tags

***

### configSchema?

> `optional` **configSchema**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:78](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L78)

Item configuration schema

***

### createdAt

> **createdAt**: `string`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:82](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L82)

When the item was created

***

### defaultConfig?

> `optional` **defaultConfig**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:80](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L80)

Default configuration

***

### dependencies?

> `optional` **dependencies**: [`ItemDependency`](ItemDependency.md)[]

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:74](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L74)

Dependencies on other items

***

### description

> **description**: `string`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:40](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L40)

Short description

***

### homepageUrl?

> `optional` **homepageUrl**: `string`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:66](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L66)

Homepage URL

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:56](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L56)

Icon URL

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:34](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L34)

Unique item ID

***

### license

> **license**: `string`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:62](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L62)

License identifier (e.g., MIT, Apache-2.0)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:88](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L88)

Additional metadata

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:38](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L38)

Human-readable name

***

### pricing

> **pricing**: [`PricingInfo`](PricingInfo.md)

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:68](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L68)

Pricing info

***

### publishedAt?

> `optional` **publishedAt**: `string`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:86](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L86)

When the item was published

***

### publisher

> **publisher**: [`PublisherInfo`](PublisherInfo.md)

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:46](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L46)

Publisher/author info

***

### ratings

> **ratings**: [`RatingSummary`](RatingSummary.md)

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:72](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L72)

Ratings and reviews summary

***

### readme?

> `optional` **readme**: `string`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:42](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L42)

Detailed README/documentation (markdown)

***

### repositoryUrl?

> `optional` **repositoryUrl**: `string`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:64](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L64)

Repository URL

***

### screenshots?

> `optional` **screenshots**: `string`[]

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:60](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L60)

Screenshots/preview images

***

### stats

> **stats**: [`ItemStats`](ItemStats.md)

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:70](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L70)

Statistics

***

### status

> **status**: [`ItemStatus`](../type-aliases/ItemStatus.md)

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:50](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L50)

Current status

***

### tags

> **tags**: `string`[]

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:54](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L54)

Search tags

***

### type

> **type**: [`MarketplaceItemType`](../type-aliases/MarketplaceItemType.md)

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:36](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L36)

Item type

***

### updatedAt

> **updatedAt**: `string`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:84](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L84)

When the item was last updated

***

### version

> **version**: `string`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:44](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L44)

Version string (semver)

***

### visibility

> **visibility**: [`ItemVisibility`](../type-aliases/ItemVisibility.md)

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:48](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L48)

Visibility level
