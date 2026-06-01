# Function: compileScenario()

> **compileScenario**(`scenarioJson`, `options?`): `Promise`\<[`ScenarioPackage`](../../interfaces/ScenarioPackage.md)\>

Defined in: [apps/paracosm/src/engine/compiler/index.ts:163](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/compiler/index.ts#L163)

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
