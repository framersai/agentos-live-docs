# Function: compileScenario()

> **compileScenario**(`scenarioJson`, `options?`): `Promise`\<[`ScenarioPackage`](../../interfaces/ScenarioPackage.md)\>

Defined in: [apps/paracosm/src/engine/compiler/index.ts:163](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/compiler/index.ts#L163)

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

A complete ScenarioPackage ready for `WorldModel.fromScenario(...).simulate()`
