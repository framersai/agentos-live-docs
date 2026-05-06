# paracosm/compiler

Paracosm Scenario Compiler.

Takes a canonical scenario JSON draft (the data portion of a ScenarioPackage)
and generates all runtime hooks via LLM calls. Natural-language prompts,
briefs, and URLs enter today through CompileOptions.seedText / seedUrl,
which ground the draft before hook generation. A prompt-only authoring API
should be a wrapper that first emits this same JSON contract, then calls this
compiler.

## Example

```typescript
import { compileScenario } from 'paracosm/compiler';
import { run } from 'paracosm';

// Defaults to OpenAI (gpt-5.4-mini). Pass provider: 'anthropic' to switch.
const scenario = await compileScenario(submarineJson);

const result = await run('Mars colony at year 2043', { scenario });
console.log(result.totalTurns, result.cost.totalCostUSD);
```

## Interfaces

- [CompileOptions](interfaces/CompileOptions.md)
- [SeedIngestionOptions](interfaces/SeedIngestionOptions.md)

## Type Aliases

- [GenerateTextFn](type-aliases/GenerateTextFn.md)

## Functions

- [compileScenario](functions/compileScenario.md)

## References

### ingestFromUrl

Re-exports [ingestFromUrl](../functions/ingestFromUrl.md)

***

### ingestSeed

Re-exports [ingestSeed](../functions/ingestSeed.md)
