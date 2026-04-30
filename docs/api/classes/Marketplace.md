# Class: Marketplace

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:61](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L61)

In-memory Marketplace implementation

## Implements

- [`IMarketplace`](../interfaces/IMarketplace.md)

## Constructors

### Constructor

> **new Marketplace**(`config?`): `Marketplace`

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:71](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L71)

#### Parameters

##### config?

[`MarketplaceConfig`](../interfaces/MarketplaceConfig.md) = `{}`

#### Returns

`Marketplace`

## Methods

### checkUpdates()

> **checkUpdates**(): `Promise`\<`object`[]\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:386](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L386)

Check for updates

#### Returns

`Promise`\<`object`[]\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`checkUpdates`](../interfaces/IMarketplace.md#checkupdates)

***

### deleteReview()

> **deleteReview**(`reviewId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:511](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L511)

Delete a review

#### Parameters

##### reviewId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`deleteReview`](../interfaces/IMarketplace.md#deletereview)

***

### deprecate()

> **deprecate**(`itemId`, `reason`, `alternativeId?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:450](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L450)

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

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`deprecate`](../interfaces/IMarketplace.md#deprecate)

***

### getByPublisher()

> **getByPublisher**(`publisherId`, `options?`): `Promise`\<[`MarketplaceSearchResult`](../interfaces/MarketplaceSearchResult.md)\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:228](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L228)

Get items by publisher

#### Parameters

##### publisherId

`string`

##### options?

[`MarketplaceSearchOptions`](../interfaces/MarketplaceSearchOptions.md)

#### Returns

`Promise`\<[`MarketplaceSearchResult`](../interfaces/MarketplaceSearchResult.md)\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`getByPublisher`](../interfaces/IMarketplace.md#getbypublisher)

***

### getDependencyTree()

> **getDependencyTree**(`itemId`): `Promise`\<\{ `dependencies`: [`MarketplaceItem`](../interfaces/MarketplaceItem.md)[]; `item`: [`MarketplaceItem`](../interfaces/MarketplaceItem.md); \}\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:272](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L272)

Get item dependencies tree

#### Parameters

##### itemId

`string`

#### Returns

`Promise`\<\{ `dependencies`: [`MarketplaceItem`](../interfaces/MarketplaceItem.md)[]; `item`: [`MarketplaceItem`](../interfaces/MarketplaceItem.md); \}\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`getDependencyTree`](../interfaces/IMarketplace.md#getdependencytree)

***

### getFeatured()

> **getFeatured**(`type?`, `limit?`): `Promise`\<[`MarketplaceItem`](../interfaces/MarketplaceItem.md)[]\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:198](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L198)

Get featured items

#### Parameters

##### type?

[`MarketplaceItemType`](../type-aliases/MarketplaceItemType.md)

##### limit?

`number` = `10`

#### Returns

`Promise`\<[`MarketplaceItem`](../interfaces/MarketplaceItem.md)[]\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`getFeatured`](../interfaces/IMarketplace.md#getfeatured)

***

### getInstallation()

> **getInstallation**(`installationId`): `Promise`\<[`InstalledItem`](../interfaces/InstalledItem.md) \| `undefined`\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:382](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L382)

Get installation by ID

#### Parameters

##### installationId

`string`

#### Returns

`Promise`\<[`InstalledItem`](../interfaces/InstalledItem.md) \| `undefined`\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`getInstallation`](../interfaces/IMarketplace.md#getinstallation)

***

### getInstalled()

> **getInstalled**(`options?`): `Promise`\<[`InstalledItem`](../interfaces/InstalledItem.md)[]\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:365](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L365)

Get installed items

#### Parameters

##### options?

###### status?

[`InstallationStatus`](../type-aliases/InstallationStatus.md)

###### type?

[`MarketplaceItemType`](../type-aliases/MarketplaceItemType.md)

#### Returns

`Promise`\<[`InstalledItem`](../interfaces/InstalledItem.md)[]\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`getInstalled`](../interfaces/IMarketplace.md#getinstalled)

***

### getItem()

> **getItem**(`itemId`): `Promise`\<[`MarketplaceItem`](../interfaces/MarketplaceItem.md) \| `undefined`\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:190](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L190)

Get item by ID

#### Parameters

##### itemId

`string`

#### Returns

`Promise`\<[`MarketplaceItem`](../interfaces/MarketplaceItem.md) \| `undefined`\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`getItem`](../interfaces/IMarketplace.md#getitem)

***

### getItemAnalytics()

> **getItemAnalytics**(`itemId`, `_period?`): `Promise`\<\{ `activeInstalls`: `number`; `downloads`: `object`[]; `ratings`: `object`[]; `uninstalls`: `number`; `views`: `object`[]; \}\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:585](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L585)

Get item analytics (for publishers)

#### Parameters

##### itemId

`string`

##### \_period?

`"day"` | `"week"` | `"month"` | `"year"`

#### Returns

`Promise`\<\{ `activeInstalls`: `number`; `downloads`: `object`[]; `ratings`: `object`[]; `uninstalls`: `number`; `views`: `object`[]; \}\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`getItemAnalytics`](../interfaces/IMarketplace.md#getitemanalytics)

***

### getItems()

> **getItems**(`itemIds`): `Promise`\<[`MarketplaceItem`](../interfaces/MarketplaceItem.md)[]\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:194](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L194)

Get multiple items by ID

#### Parameters

##### itemIds

`string`[]

#### Returns

`Promise`\<[`MarketplaceItem`](../interfaces/MarketplaceItem.md)[]\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`getItems`](../interfaces/IMarketplace.md#getitems)

***

### getRecent()

> **getRecent**(`type?`, `limit?`): `Promise`\<[`MarketplaceItem`](../interfaces/MarketplaceItem.md)[]\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:219](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L219)

Get recently added items

#### Parameters

##### type?

[`MarketplaceItemType`](../type-aliases/MarketplaceItemType.md)

##### limit?

`number` = `10`

#### Returns

`Promise`\<[`MarketplaceItem`](../interfaces/MarketplaceItem.md)[]\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`getRecent`](../interfaces/IMarketplace.md#getrecent)

***

### getReviews()

> **getReviews**(`itemId`, `options?`): `Promise`\<\{ `reviews`: [`Review`](../interfaces/Review.md)[]; `total`: `number`; \}\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:236](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L236)

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

`Promise`\<\{ `reviews`: [`Review`](../interfaces/Review.md)[]; `total`: `number`; \}\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`getReviews`](../interfaces/IMarketplace.md#getreviews)

***

### getStats()

> **getStats**(): `Promise`\<[`MarketplaceStats`](../interfaces/MarketplaceStats.md)\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:541](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L541)

Get marketplace statistics

#### Returns

`Promise`\<[`MarketplaceStats`](../interfaces/MarketplaceStats.md)\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`getStats`](../interfaces/IMarketplace.md#getstats)

***

### getTrending()

> **getTrending**(`type?`, `_period?`, `limit?`): `Promise`\<[`MarketplaceItem`](../interfaces/MarketplaceItem.md)[]\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:209](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L209)

Get trending items

#### Parameters

##### type?

[`MarketplaceItemType`](../type-aliases/MarketplaceItemType.md)

##### \_period?

`"day"` | `"week"` | `"month"`

##### limit?

`number` = `10`

#### Returns

`Promise`\<[`MarketplaceItem`](../interfaces/MarketplaceItem.md)[]\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`getTrending`](../interfaces/IMarketplace.md#gettrending)

***

### getVersions()

> **getVersions**(`itemId`): `Promise`\<`object`[]\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:262](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L262)

Get item versions

#### Parameters

##### itemId

`string`

#### Returns

`Promise`\<`object`[]\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`getVersions`](../interfaces/IMarketplace.md#getversions)

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:76](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L76)

Initialize the marketplace

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`initialize`](../interfaces/IMarketplace.md#initialize)

***

### install()

> **install**(`itemId`, `options?`): `Promise`\<[`InstallationResult`](../interfaces/InstallationResult.md)\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:291](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L291)

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

`Promise`\<[`InstallationResult`](../interfaces/InstallationResult.md)\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`install`](../interfaces/IMarketplace.md#install)

***

### markReviewHelpful()

> **markReviewHelpful**(`reviewId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:520](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L520)

Mark review as helpful

#### Parameters

##### reviewId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`markReviewHelpful`](../interfaces/IMarketplace.md#markreviewhelpful)

***

### publish()

> **publish**(`itemInput`): `Promise`\<[`MarketplaceItem`](../interfaces/MarketplaceItem.md)\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:407](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L407)

Publish a new item

#### Parameters

##### itemInput

`Omit`\<[`MarketplaceItem`](../interfaces/MarketplaceItem.md), `"id"` \| `"stats"` \| `"ratings"` \| `"createdAt"` \| `"updatedAt"` \| `"publishedAt"`\>

#### Returns

`Promise`\<[`MarketplaceItem`](../interfaces/MarketplaceItem.md)\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`publish`](../interfaces/IMarketplace.md#publish)

***

### publishVersion()

> **publishVersion**(`itemId`, `version`, `_options?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:440](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L440)

Publish a new version

#### Parameters

##### itemId

`string`

##### version

`string`

##### \_options?

###### breaking?

`boolean`

###### changelog?

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`publishVersion`](../interfaces/IMarketplace.md#publishversion)

***

### recordView()

> **recordView**(`itemId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:577](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L577)

Record item view (for analytics)

#### Parameters

##### itemId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`recordView`](../interfaces/IMarketplace.md#recordview)

***

### respondToReview()

> **respondToReview**(`reviewId`, `response`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:527](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L527)

Respond to a review (as publisher)

#### Parameters

##### reviewId

`string`

##### response

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`respondToReview`](../interfaces/IMarketplace.md#respondtoreview)

***

### search()

> **search**(`options?`): `Promise`\<[`MarketplaceSearchResult`](../interfaces/MarketplaceSearchResult.md)\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:86](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L86)

Search marketplace items

#### Parameters

##### options?

[`MarketplaceSearchOptions`](../interfaces/MarketplaceSearchOptions.md)

#### Returns

`Promise`\<[`MarketplaceSearchResult`](../interfaces/MarketplaceSearchResult.md)\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`search`](../interfaces/IMarketplace.md#search)

***

### submitReview()

> **submitReview**(`itemId`, `review`): `Promise`\<[`Review`](../interfaces/Review.md)\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:465](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L465)

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

`Promise`\<[`Review`](../interfaces/Review.md)\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`submitReview`](../interfaces/IMarketplace.md#submitreview)

***

### uninstall()

> **uninstall**(`installationId`): `Promise`\<\{ `error?`: `string`; `success`: `boolean`; \}\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:348](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L348)

Uninstall an item

#### Parameters

##### installationId

`string`

#### Returns

`Promise`\<\{ `error?`: `string`; `success`: `boolean`; \}\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`uninstall`](../interfaces/IMarketplace.md#uninstall)

***

### update()

> **update**(`installationId`, `options?`): `Promise`\<[`InstallationResult`](../interfaces/InstallationResult.md)\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:326](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L326)

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

`Promise`\<[`InstallationResult`](../interfaces/InstallationResult.md)\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`update`](../interfaces/IMarketplace.md#update)

***

### updateItem()

> **updateItem**(`itemId`, `updates`): `Promise`\<[`MarketplaceItem`](../interfaces/MarketplaceItem.md)\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:426](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L426)

Update a published item

#### Parameters

##### itemId

`string`

##### updates

`Partial`\<[`MarketplaceItem`](../interfaces/MarketplaceItem.md)\>

#### Returns

`Promise`\<[`MarketplaceItem`](../interfaces/MarketplaceItem.md)\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`updateItem`](../interfaces/IMarketplace.md#updateitem)

***

### updateReview()

> **updateReview**(`reviewId`, `updates`): `Promise`\<[`Review`](../interfaces/Review.md)\>

Defined in: [packages/agentos/src/marketplace/store/Marketplace.ts:498](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/store/Marketplace.ts#L498)

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

`Promise`\<[`Review`](../interfaces/Review.md)\>

#### Implementation of

[`IMarketplace`](../interfaces/IMarketplace.md).[`updateReview`](../interfaces/IMarketplace.md#updatereview)
