# Function: compileScenario()

> **compileScenario**(`scenarioJson`, `options?`): `Promise`\<[`ScenarioPackage`](../../interfaces/ScenarioPackage.md)\>

Defined in: [engine/compiler/index.ts:128](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/index.ts#L128)

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
