# Function: registerAnchorProviderFactory()

> **registerAnchorProviderFactory**(`type`, `factory`): `void`

Defined in: [packages/agentos/src/provenance/anchoring/providers/createAnchorProvider.ts:33](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/provenance/anchoring/providers/createAnchorProvider.ts#L33)

Register an external AnchorProvider factory for a given anchor target type.
Called by extension packages (e.g., @framers/agentos-ext-anchor-providers) at startup.

## Parameters

### type

`string`

### factory

`ProviderFactory`

## Returns

`void`

## Example

```typescript
import { registerAnchorProviderFactory } from '@framers/agentos';
import { RekorProvider } from '@framers/agentos-ext-anchor-providers';

registerAnchorProviderFactory('rekor', (opts) => new RekorProvider(opts));
```
