# Function: compileScenario()

> **compileScenario**(`scenarioJson`, `options?`): `Promise`\<[`ScenarioPackage`](../../interfaces/ScenarioPackage.md)\>

Defined in: [apps/paracosm/src/engine/compiler/index.ts:142](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/index.ts#L142)

Compile a scenario JSON draft into a complete ScenarioPackage with generated hooks.

## Parameters

### scenarioJson

`Record`\<`string`, `unknown`\>

Canonical world draft (labels, departments, metrics, effects, etc.)

### options?

[`CompileOptions`](../interfaces/CompileOptions.md) = `{}`

Compiler options (provider, model, cache settings, seed text / URL grounding)

## Returns

`Promise`\<[`ScenarioPackage`](../../interfaces/ScenarioPackage.md)\>

A complete ScenarioPackage ready for runSimulation()
