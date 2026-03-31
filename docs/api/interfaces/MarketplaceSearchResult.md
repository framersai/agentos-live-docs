# Interface: MarketplaceSearchResult

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:253](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L253)

Search results

## Properties

### facets

> **facets**: `object`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:259](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L259)

Facets for filtering

#### categories

> **categories**: `object`[]

#### pricingModels

> **pricingModels**: `object`[]

#### tags

> **tags**: `object`[]

#### types

> **types**: `object`[]

***

### items

> **items**: [`MarketplaceItem`](MarketplaceItem.md)[]

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:255](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L255)

Matching items

***

### searchMeta

> **searchMeta**: `object`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:266](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L266)

Search metadata

#### limit

> **limit**: `number`

#### offset

> **offset**: `number`

#### query?

> `optional` **query**: `string`

#### took

> **took**: `number`

***

### total

> **total**: `number`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:257](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/marketplace/store/IMarketplace.ts#L257)

Total count of matches
