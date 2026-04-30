# Interface: MarketplaceSearchOptions

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:221](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L221)

Search options for marketplace items

## Properties

### categories?

> `optional` **categories**: `string`[]

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:227](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L227)

Filter by categories

***

### includeDeprecated?

> `optional` **includeDeprecated**: `boolean`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:247](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L247)

Include deprecated items

***

### licenses?

> `optional` **licenses**: `string`[]

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:237](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L237)

Filter by license

***

### limit?

> `optional` **limit**: `number`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:245](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L245)

Results per page

***

### minRating?

> `optional` **minRating**: `number`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:235](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L235)

Minimum rating

***

### offset?

> `optional` **offset**: `number`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:243](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L243)

Pagination offset

***

### pricingModel?

> `optional` **pricingModel**: (`"free"` \| `"one_time"` \| `"subscription"` \| `"usage_based"` \| `"freemium"`)[]

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:233](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L233)

Filter by pricing model

***

### publisherId?

> `optional` **publisherId**: `string`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:231](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L231)

Filter by publisher

***

### query?

> `optional` **query**: `string`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:223](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L223)

Search query text

***

### sortBy?

> `optional` **sortBy**: `"name"` \| `"relevance"` \| `"downloads"` \| `"rating"` \| `"newest"` \| `"updated"`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:239](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L239)

Sort by

***

### sortDirection?

> `optional` **sortDirection**: `"asc"` \| `"desc"`

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:241](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L241)

Sort direction

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:229](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L229)

Filter by tags

***

### types?

> `optional` **types**: [`MarketplaceItemType`](../type-aliases/MarketplaceItemType.md)[]

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:225](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L225)

Filter by item types
