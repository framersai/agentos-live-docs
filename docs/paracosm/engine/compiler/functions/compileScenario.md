# Function: compileScenario()

> **compileScenario**(`scenarioJson`, `options?`): `Promise`\<[`ScenarioPackage`](../../interfaces/ScenarioPackage.md)\>

Defined in: [apps/paracosm/src/engine/compiler/index.ts:127](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/compiler/index.ts#L127)

Compile a scenario JSON into a complete ScenarioPackage with generated hooks.

## Parameters

### scenarioJson

`Record`\<`string`, `unknown`\>

The data portion of a scenario (labels, departments, metrics, effects, etc.)

### options?

[`CompileOptions`](../interfaces/CompileOptions.md) = `{}`

Compiler options (provider, model, cache settings)

## Returns

`Promise`\<[`ScenarioPackage`](../../interfaces/ScenarioPackage.md)\>

A complete ScenarioPackage ready for runSimulation()
