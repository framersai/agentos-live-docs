# Interface: RateLimitInfoPublic

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:18](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/rate-limiting/types.ts#L18)

Rate limit information for public (unauthenticated) users with IP-based limits.

## Properties

### ip

> **ip**: `string` \| `null`

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:20](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/rate-limiting/types.ts#L20)

***

### limit

> **limit**: `number`

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:22](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/rate-limiting/types.ts#L22)

***

### message?

> `optional` **message**: `string`

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:26](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/rate-limiting/types.ts#L26)

***

### remaining

> **remaining**: `number`

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:23](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/rate-limiting/types.ts#L23)

***

### resetAt

> **resetAt**: `string` \| `Date` \| `null`

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:24](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/rate-limiting/types.ts#L24)

***

### storeType?

> `optional` **storeType**: `string`

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:25](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/rate-limiting/types.ts#L25)

***

### tier

> **tier**: `"public"`

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:19](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/rate-limiting/types.ts#L19)

***

### used

> **used**: `number`

Defined in: [packages/agentos/src/core/rate-limiting/types.ts:21](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/rate-limiting/types.ts#L21)
