# Function: createParacosmClient()

> **createParacosmClient**(`options?`): [`ParacosmClient`](../interfaces/ParacosmClient.md)

Defined in: [apps/paracosm/src/runtime/client.ts:186](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/client.ts#L186)

Create a Paracosm client with pinned defaults. Env vars are read once
at construction; subsequent `process.env` mutations won't retrigger.

## Parameters

### options?

[`ParacosmClientOptions`](../interfaces/ParacosmClientOptions.md) = `{}`

## Returns

[`ParacosmClient`](../interfaces/ParacosmClient.md)

## Examples

```typescript
import { createParacosmClient } from 'paracosm/runtime';

const client = createParacosmClient({
  provider: 'openai',
  costPreset: 'economy',
  models: { departments: 'gpt-5.4' },  // pin only departments to flagship
});

const scenario = await client.compileScenario(worldJson);
const out = await client.runSimulation(leader, [], { maxTurns: 6, seed: 42 });

// Per-call override wins over client defaults:
const quality = await client.runSimulation(leader, [], {
  maxTurns: 8, seed: 42,
  costPreset: 'quality',  // promote this one run to flagship
});
```

```bash
PARACOSM_PROVIDER=anthropic \
PARACOSM_COST_PRESET=economy \
PARACOSM_MODEL_DEPARTMENTS=claude-sonnet-4-6 \
  node my-runner.js
```
```typescript
const client = createParacosmClient();  // no args — reads from env
```
