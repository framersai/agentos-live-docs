# Variable: profiles

> `const` **profiles**: `object`

Defined in: [packages/agentos/src/provenance/config/PolicyProfiles.ts:28](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/provenance/config/PolicyProfiles.ts#L28)

Policy profiles for quick configuration.

## Type Declaration

### custom()

> **custom**(`base`, `overrides`): [`ProvenanceSystemConfig`](../interfaces/ProvenanceSystemConfig.md)

Create a custom profile by merging overrides onto a base.

#### Parameters

##### base

[`ProvenanceSystemConfig`](../interfaces/ProvenanceSystemConfig.md)

##### overrides

`Partial`\<[`ProvenanceSystemConfig`](../interfaces/ProvenanceSystemConfig.md)\>

#### Returns

[`ProvenanceSystemConfig`](../interfaces/ProvenanceSystemConfig.md)

### mutableDev()

> **mutableDev**(): [`ProvenanceSystemConfig`](../interfaces/ProvenanceSystemConfig.md)

Mutable (development) mode.
No enforcement, no signing, no restrictions.
Standard app semantics with optional ledger.

#### Returns

[`ProvenanceSystemConfig`](../interfaces/ProvenanceSystemConfig.md)

### revisionedVerified()

> **revisionedVerified**(): [`ProvenanceSystemConfig`](../interfaces/ProvenanceSystemConfig.md)

Revisioned (verifiable) mode.
Edits become revisions. Deletes become tombstones.
Full signed event ledger with periodic anchoring.
Humans can still interact, but all changes are tracked.

#### Returns

[`ProvenanceSystemConfig`](../interfaces/ProvenanceSystemConfig.md)

### sealedAuditable()

> **sealedAuditable**(`rekorEndpoint?`): [`ProvenanceSystemConfig`](../interfaces/ProvenanceSystemConfig.md)

Sealed mode with Rekor transparency log anchoring.
Suitable for publicly auditable autonomous agents.

Requires `@framers/agentos-ext-anchor-providers` extension
with `registerExtensionProviders()` called at startup.

#### Parameters

##### rekorEndpoint?

`string`

#### Returns

[`ProvenanceSystemConfig`](../interfaces/ProvenanceSystemConfig.md)

### sealedAutonomous()

> **sealedAutonomous**(): [`ProvenanceSystemConfig`](../interfaces/ProvenanceSystemConfig.md)

Sealed (autonomous) mode.
Append-only storage. No human prompting after genesis.
Signed event ledger with frequent anchoring.
Required for "Verified Autonomous" badge.

#### Returns

[`ProvenanceSystemConfig`](../interfaces/ProvenanceSystemConfig.md)

## Example

```typescript
import { profiles } from '@framers/agentos/provenance';

// For development:
const config = profiles.mutableDev();

// For production with audit trail:
const config = profiles.revisionedVerified();

// For autonomous agents:
const config = profiles.sealedAutonomous();
```
