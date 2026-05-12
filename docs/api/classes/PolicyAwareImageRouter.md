# Class: PolicyAwareImageRouter

Defined in: [packages/agentos/src/media/images/PolicyAwareImageRouter.ts:59](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/media/images/PolicyAwareImageRouter.ts#L59)

Policy-aware image provider router. Selects the preferred image generation
provider and model based on the session's content policy tier.

## Constructors

### Constructor

> **new PolicyAwareImageRouter**(`catalog`): `PolicyAwareImageRouter`

Defined in: [packages/agentos/src/media/images/PolicyAwareImageRouter.ts:65](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/media/images/PolicyAwareImageRouter.ts#L65)

#### Parameters

##### catalog

`UncensoredModelCatalog`

Uncensored model catalog for mature/private-adult lookup.

#### Returns

`PolicyAwareImageRouter`

## Methods

### getPreferredProvider()

> **getPreferredProvider**(`policyTier`, `capabilities?`): [`ImageProviderPreference`](../interfaces/ImageProviderPreference.md) \| `null`

Defined in: [packages/agentos/src/media/images/PolicyAwareImageRouter.ts:76](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/media/images/PolicyAwareImageRouter.ts#L76)

Get the preferred image provider and model for a given policy tier.

#### Parameters

##### policyTier

`PolicyTier`

Content policy tier.

##### capabilities?

`string`[]

Optional required capabilities (e.g. ['face-consistency']).

#### Returns

[`ImageProviderPreference`](../interfaces/ImageProviderPreference.md) \| `null`

Provider preference, or null for safe/standard tiers.

***

### getProviderChain()

> **getProviderChain**(`policyTier`, `capabilities?`): `string`[]

Defined in: [packages/agentos/src/media/images/PolicyAwareImageRouter.ts:113](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/media/images/PolicyAwareImageRouter.ts#L113)

Get the ordered provider chain for a given policy tier,
optionally filtered by required capabilities.

Safe/standard returns the default chain (OpenAI-first).
Mature/private-adult returns the uncensored chain (Replicate-first).

When `capabilities` is provided, only providers supporting ALL listed
capabilities are included. Known capabilities:
- `'character-consistency'` — Replicate (Pulid, IP-Adapter), Fal (IP-Adapter), SD-Local (ControlNet)
- `'controlnet'` — Replicate (Canny, Depth), SD-Local (ControlNet extensions)
- `'style-transfer'` — Replicate (Flux Redux)

#### Parameters

##### policyTier

`PolicyTier`

Content policy tier.

##### capabilities?

`string`[]

Optional required capabilities to filter the chain.

#### Returns

`string`[]

Ordered array of provider IDs to try in sequence.
