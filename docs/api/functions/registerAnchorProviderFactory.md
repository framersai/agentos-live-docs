# Function: registerAnchorProviderFactory()

> **registerAnchorProviderFactory**(`type`, `factory`): `void`

Defined in: [packages/agentos/src/provenance/anchoring/providers/createAnchorProvider.ts:33](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/anchoring/providers/createAnchorProvider.ts#L33)

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
