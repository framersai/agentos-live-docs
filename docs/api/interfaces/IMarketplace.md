# Interface: IMarketplace

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:343](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L343)

Interface for the Agent Marketplace

## Methods

### checkUpdates()

> **checkUpdates**(): `Promise`\<`object`[]\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:435](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L435)

Check for updates

#### Returns

`Promise`\<`object`[]\>

***

### deleteReview()

> **deleteReview**(`reviewId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:474](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L474)

Delete a review

#### Parameters

##### reviewId

`string`

#### Returns

`Promise`\<`void`\>

***

### deprecate()

> **deprecate**(`itemId`, `reason`, `alternativeId?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:457](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L457)

Deprecate an item

#### Parameters

##### itemId

`string`

##### reason

`string`

##### alternativeId?

`string`

#### Returns

`Promise`\<`void`\>

***

### getByPublisher()

> **getByPublisher**(`publisherId`, `options?`): `Promise`\<[`MarketplaceSearchResult`](MarketplaceSearchResult.md)\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:386](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L386)

Get items by publisher

#### Parameters

##### publisherId

`string`

##### options?

[`MarketplaceSearchOptions`](MarketplaceSearchOptions.md)

#### Returns

`Promise`\<[`MarketplaceSearchResult`](MarketplaceSearchResult.md)\>

***

### getDependencyTree()

> **getDependencyTree**(`itemId`): `Promise`\<\{ `dependencies`: [`MarketplaceItem`](MarketplaceItem.md)[]; `item`: [`MarketplaceItem`](MarketplaceItem.md); \}\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:403](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L403)

Get item dependencies tree

#### Parameters

##### itemId

`string`

#### Returns

`Promise`\<\{ `dependencies`: [`MarketplaceItem`](MarketplaceItem.md)[]; `item`: [`MarketplaceItem`](MarketplaceItem.md); \}\>

***

### getFeatured()

> **getFeatured**(`type?`, `limit?`): `Promise`\<[`MarketplaceItem`](MarketplaceItem.md)[]\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:371](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L371)

Get featured items

#### Parameters

##### type?

[`MarketplaceItemType`](../type-aliases/MarketplaceItemType.md)

##### limit?

`number`

#### Returns

`Promise`\<[`MarketplaceItem`](MarketplaceItem.md)[]\>

***

### getInstallation()

> **getInstallation**(`installationId`): `Promise`\<[`InstalledItem`](InstalledItem.md) \| `undefined`\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:430](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L430)

Get installation by ID

#### Parameters

##### installationId

`string`

#### Returns

`Promise`\<[`InstalledItem`](InstalledItem.md) \| `undefined`\>

***

### getInstalled()

> **getInstalled**(`options?`): `Promise`\<[`InstalledItem`](InstalledItem.md)[]\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:425](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L425)

Get installed items

#### Parameters

##### options?

###### status?

[`InstallationStatus`](../type-aliases/InstallationStatus.md)

###### type?

[`MarketplaceItemType`](../type-aliases/MarketplaceItemType.md)

#### Returns

`Promise`\<[`InstalledItem`](InstalledItem.md)[]\>

***

### getItem()

> **getItem**(`itemId`): `Promise`\<[`MarketplaceItem`](MarketplaceItem.md) \| `undefined`\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:361](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L361)

Get item by ID

#### Parameters

##### itemId

`string`

#### Returns

`Promise`\<[`MarketplaceItem`](MarketplaceItem.md) \| `undefined`\>

***

### getItemAnalytics()

> **getItemAnalytics**(`itemId`, `period?`): `Promise`\<\{ `activeInstalls`: `number`; `downloads`: `object`[]; `ratings`: `object`[]; `uninstalls`: `number`; `views`: `object`[]; \}\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:501](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L501)

Get item analytics (for publishers)

#### Parameters

##### itemId

`string`

##### period?

`"day"` | `"week"` | `"month"` | `"year"`

#### Returns

`Promise`\<\{ `activeInstalls`: `number`; `downloads`: `object`[]; `ratings`: `object`[]; `uninstalls`: `number`; `views`: `object`[]; \}\>

***

### getItems()

> **getItems**(`itemIds`): `Promise`\<[`MarketplaceItem`](MarketplaceItem.md)[]\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:366](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L366)

Get multiple items by ID

#### Parameters

##### itemIds

`string`[]

#### Returns

`Promise`\<[`MarketplaceItem`](MarketplaceItem.md)[]\>

***

### getRecent()

> **getRecent**(`type?`, `limit?`): `Promise`\<[`MarketplaceItem`](MarketplaceItem.md)[]\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:381](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L381)

Get recently added items

#### Parameters

##### type?

[`MarketplaceItemType`](../type-aliases/MarketplaceItemType.md)

##### limit?

`number`

#### Returns

`Promise`\<[`MarketplaceItem`](MarketplaceItem.md)[]\>

***

### getReviews()

> **getReviews**(`itemId`, `options?`): `Promise`\<\{ `reviews`: [`Review`](Review.md)[]; `total`: `number`; \}\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:393](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L393)

Get item reviews

#### Parameters

##### itemId

`string`

##### options?

###### limit?

`number`

###### offset?

`number`

###### sortBy?

`"rating"` \| `"newest"` \| `"helpful"`

#### Returns

`Promise`\<\{ `reviews`: [`Review`](Review.md)[]; `total`: `number`; \}\>

***

### getStats()

> **getStats**(): `Promise`\<[`MarketplaceStats`](MarketplaceStats.md)\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:491](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L491)

Get marketplace statistics

#### Returns

`Promise`\<[`MarketplaceStats`](MarketplaceStats.md)\>

***

### getTrending()

> **getTrending**(`type?`, `period?`, `limit?`): `Promise`\<[`MarketplaceItem`](MarketplaceItem.md)[]\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:376](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L376)

Get trending items

#### Parameters

##### type?

[`MarketplaceItemType`](../type-aliases/MarketplaceItemType.md)

##### period?

`"day"` | `"week"` | `"month"`

##### limit?

`number`

#### Returns

`Promise`\<[`MarketplaceItem`](MarketplaceItem.md)[]\>

***

### getVersions()

> **getVersions**(`itemId`): `Promise`\<`object`[]\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:398](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L398)

Get item versions

#### Parameters

##### itemId

`string`

#### Returns

`Promise`\<`object`[]\>

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:349](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L349)

Initialize the marketplace

#### Returns

`Promise`\<`void`\>

***

### install()

> **install**(`itemId`, `options?`): `Promise`\<[`InstallationResult`](InstallationResult.md)\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:410](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L410)

Install an item

#### Parameters

##### itemId

`string`

##### options?

###### autoUpdate?

`boolean`

###### config?

`Record`\<`string`, `unknown`\>

###### version?

`string`

#### Returns

`Promise`\<[`InstallationResult`](InstallationResult.md)\>

***

### markReviewHelpful()

> **markReviewHelpful**(`reviewId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:479](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L479)

Mark review as helpful

#### Parameters

##### reviewId

`string`

#### Returns

`Promise`\<`void`\>

***

### publish()

> **publish**(`item`): `Promise`\<[`MarketplaceItem`](MarketplaceItem.md)\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:442](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L442)

Publish a new item

#### Parameters

##### item

`Omit`\<[`MarketplaceItem`](MarketplaceItem.md), `"id"` \| `"stats"` \| `"ratings"` \| `"createdAt"` \| `"updatedAt"` \| `"publishedAt"`\>

#### Returns

`Promise`\<[`MarketplaceItem`](MarketplaceItem.md)\>

***

### publishVersion()

> **publishVersion**(`itemId`, `version`, `options?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:452](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L452)

Publish a new version

#### Parameters

##### itemId

`string`

##### version

`string`

##### options?

###### breaking?

`boolean`

###### changelog?

`string`

#### Returns

`Promise`\<`void`\>

***

### recordView()

> **recordView**(`itemId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:496](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L496)

Record item view (for analytics)

#### Parameters

##### itemId

`string`

#### Returns

`Promise`\<`void`\>

***

### respondToReview()

> **respondToReview**(`reviewId`, `response`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:484](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L484)

Respond to a review (as publisher)

#### Parameters

##### reviewId

`string`

##### response

`string`

#### Returns

`Promise`\<`void`\>

***

### search()

> **search**(`options?`): `Promise`\<[`MarketplaceSearchResult`](MarketplaceSearchResult.md)\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:356](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L356)

Search marketplace items

#### Parameters

##### options?

[`MarketplaceSearchOptions`](MarketplaceSearchOptions.md)

#### Returns

`Promise`\<[`MarketplaceSearchResult`](MarketplaceSearchResult.md)\>

***

### submitReview()

> **submitReview**(`itemId`, `review`): `Promise`\<[`Review`](Review.md)\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:464](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L464)

Submit a review

#### Parameters

##### itemId

`string`

##### review

###### body

`string`

###### rating

`number`

###### title?

`string`

#### Returns

`Promise`\<[`Review`](Review.md)\>

***

### uninstall()

> **uninstall**(`installationId`): `Promise`\<\{ `error?`: `string`; `success`: `boolean`; \}\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:420](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L420)

Uninstall an item

#### Parameters

##### installationId

`string`

#### Returns

`Promise`\<\{ `error?`: `string`; `success`: `boolean`; \}\>

***

### update()

> **update**(`installationId`, `options?`): `Promise`\<[`InstallationResult`](InstallationResult.md)\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:415](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L415)

Update an installed item

#### Parameters

##### installationId

`string`

##### options?

###### config?

`Record`\<`string`, `unknown`\>

###### version?

`string`

#### Returns

`Promise`\<[`InstallationResult`](InstallationResult.md)\>

***

### updateItem()

> **updateItem**(`itemId`, `updates`): `Promise`\<[`MarketplaceItem`](MarketplaceItem.md)\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:447](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L447)

Update a published item

#### Parameters

##### itemId

`string`

##### updates

`Partial`\<[`MarketplaceItem`](MarketplaceItem.md)\>

#### Returns

`Promise`\<[`MarketplaceItem`](MarketplaceItem.md)\>

***

### updateReview()

> **updateReview**(`reviewId`, `updates`): `Promise`\<[`Review`](Review.md)\>

Defined in: [packages/agentos/src/marketplace/store/IMarketplace.ts:469](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/IMarketplace.ts#L469)

Update a review

#### Parameters

##### reviewId

`string`

##### updates

###### body?

`string`

###### rating?

`number`

###### title?

`string`

#### Returns

`Promise`\<[`Review`](Review.md)\>
