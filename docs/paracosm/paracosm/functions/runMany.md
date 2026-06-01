# Function: runMany()

> **runMany**(`prompt`, `opts?`): `Promise`\<[`RunManyResult`](../interfaces/RunManyResult.md)\>

Defined in: [apps/paracosm/src/api/run.ts:41](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/api/run.ts#L41)

Run N parallel simulations from a prompt, URL, or pre-compiled
scenario. Returns the WorldModel handle (so callers can fork after),
the compiled scenario (so callers don't recompile), and one
`{ actor, artifact }` per run.

## Parameters

### prompt

`string` | [`ScenarioPackage`](../interfaces/ScenarioPackage.md) | `URL`

### opts?

[`RunManyOptions`](../interfaces/RunManyOptions.md) = `{}`

## Returns

`Promise`\<[`RunManyResult`](../interfaces/RunManyResult.md)\>
