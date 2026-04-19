# Class: EmergentCapabilityEngine

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:186](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentCapabilityEngine.ts#L186)

Orchestrates runtime tool creation for agents with emergent capabilities.

Pipeline: forge request → build tool → run tests → judge review → register.

Supports two creation modes:
- **Compose**: chains existing tools via [ComposableToolBuilder](ComposableToolBuilder.md) (safe by construction).
- **Sandbox**: runs agent-written code via [SandboxedToolForge](SandboxedToolForge.md) (judge-gated).

## Example

```ts
const engine = new EmergentCapabilityEngine({
  config: { ...DEFAULT_EMERGENT_CONFIG, enabled: true },
  composableBuilder,
  sandboxForge,
  judge,
  registry,
});

const result = await engine.forge(request, { agentId: 'gmi-1', sessionId: 'sess-1' });
if (result.success) {
  console.log('Registered tool:', result.toolId);
}
```

## Constructors

### Constructor

> **new EmergentCapabilityEngine**(`deps`): `EmergentCapabilityEngine`

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:208](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentCapabilityEngine.ts#L208)

Create a new EmergentCapabilityEngine.

#### Parameters

##### deps

[`EmergentCapabilityEngineDeps`](../interfaces/EmergentCapabilityEngineDeps.md)

All collaborator dependencies. See [EmergentCapabilityEngineDeps](../interfaces/EmergentCapabilityEngineDeps.md).

#### Returns

`EmergentCapabilityEngine`

## Methods

### checkPromotion()

> **checkPromotion**(`toolId`): `Promise`\<[`PromotionResult`](../interfaces/PromotionResult.md) \| `null`\>

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:440](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentCapabilityEngine.ts#L440)

Check if a tool is eligible for promotion and auto-promote if the threshold
is met.

A tool qualifies for promotion when:
1. It is at the `'session'` tier.
2. Its usage stats meet `EmergentConfig.promotionThreshold`:
   - `totalUses >= threshold.uses`
   - `confidenceScore >= threshold.confidence`

When eligible, the engine submits the tool to the judge's promotion panel.
If both reviewers approve, the tool is promoted to `'agent'` tier.

#### Parameters

##### toolId

`string`

The ID of the tool to check.

#### Returns

`Promise`\<[`PromotionResult`](../interfaces/PromotionResult.md) \| `null`\>

A [PromotionResult](../interfaces/PromotionResult.md) if promotion was attempted, or `null` if
  the tool is not eligible or does not exist.

***

### cleanupSession()

> **cleanupSession**(`sessionId`): [`EmergentTool`](../interfaces/EmergentTool.md)[]

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:535](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentCapabilityEngine.ts#L535)

Clean up all session tools for a given session.

Delegates to the registry's `EmergentToolRegistry.cleanupSession()`
method and clears the local session index.

#### Parameters

##### sessionId

`string`

The session identifier to clean up.

#### Returns

[`EmergentTool`](../interfaces/EmergentTool.md)[]

***

### createExecutableTool()

> **createExecutableTool**(`tool`): [`ITool`](../interfaces/ITool.md)\<`Record`\<`string`, `unknown`\>, `unknown`\>

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:701](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentCapabilityEngine.ts#L701)

Create an executable ITool wrapper for a forged emergent tool.

The wrapper performs runtime output validation, usage tracking, and
promotion checks after each successful execution.

#### Parameters

##### tool

[`EmergentTool`](../interfaces/EmergentTool.md)

#### Returns

[`ITool`](../interfaces/ITool.md)\<`Record`\<`string`, `unknown`\>, `unknown`\>

***

### createSelfImprovementTools()

> **createSelfImprovementTools**(`deps`): `Promise`\<[`ITool`](../interfaces/ITool.md)\<`any`, `any`\>[]\>

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:604](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentCapabilityEngine.ts#L604)

Factory method that creates the four self-improvement tools when
`config.selfImprovement?.enabled` is `true`.

Returns an array containing:
1. **AdaptPersonalityTool** — bounded HEXACO trait mutation.
2. **ManageSkillsTool** — runtime skill enable/disable/search.
3. **CreateWorkflowTool** — multi-step tool composition.
4. **SelfEvaluateTool** — self-scoring with parameter adjustment.

Returns an empty array when self-improvement is disabled or the
config is absent. Uses dynamic imports to avoid hard compile-time
coupling to tool modules that may not yet exist.

#### Parameters

##### deps

[`SelfImprovementToolDeps`](../interfaces/SelfImprovementToolDeps.md)

Runtime hooks for personality, skills, tools, and memory.

#### Returns

`Promise`\<[`ITool`](../interfaces/ITool.md)\<`any`, `any`\>[]\>

Array of 0 or 4 [ITool](../interfaces/ITool.md) instances.

***

### forge()

> **forge**(`request`, `context`): `Promise`\<[`ForgeResult`](../interfaces/ForgeResult.md)\>

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:242](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentCapabilityEngine.ts#L242)

Forge a new tool from a request.

Runs test cases, submits the candidate to the LLM judge, and registers the
tool at the `'session'` tier if approved. Returns a [ForgeResult](../interfaces/ForgeResult.md) with
the tool ID on success, or an error / rejection verdict on failure.

Pipeline:
1. Generate unique tool ID.
2. Build or validate implementation (compose vs. sandbox).
3. Execute all declared test cases and collect results.
4. Submit candidate to the judge for creation review.
5. If approved: create [EmergentTool](../interfaces/EmergentTool.md), register at session tier, index.
6. If rejected: return failure with the judge's reasoning.

#### Parameters

##### request

[`ForgeToolRequest`](../interfaces/ForgeToolRequest.md)

The forge request describing the desired tool.

##### context

Caller context containing the agent and session IDs.

###### agentId

`string`

###### sessionId

`string`

#### Returns

`Promise`\<[`ForgeResult`](../interfaces/ForgeResult.md)\>

A [ForgeResult](../interfaces/ForgeResult.md) indicating success or failure.

***

### getAgentTools()

> **getAgentTools**(`agentId`): [`EmergentTool`](../interfaces/EmergentTool.md)[]

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:519](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentCapabilityEngine.ts#L519)

Get all agent-tier tools for a given agent ID.

#### Parameters

##### agentId

`string`

The agent identifier.

#### Returns

[`EmergentTool`](../interfaces/EmergentTool.md)[]

An array of [EmergentTool](../interfaces/EmergentTool.md) objects created by the agent.

***

### getSessionTools()

> **getSessionTools**(`sessionId`): [`EmergentTool`](../interfaces/EmergentTool.md)[]

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:493](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentCapabilityEngine.ts#L493)

Get all session-scoped tools for a given session ID.

#### Parameters

##### sessionId

`string`

The session identifier.

#### Returns

[`EmergentTool`](../interfaces/EmergentTool.md)[]

An array of [EmergentTool](../interfaces/EmergentTool.md) objects belonging to the session.

***

### removeTool()

> **removeTool**(`toolId`): `Promise`\<[`EmergentTool`](../interfaces/EmergentTool.md) \| `undefined`\>

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:569](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentCapabilityEngine.ts#L569)

Remove a previously synced tool from the live runtime and registry.

#### Parameters

##### toolId

`string`

#### Returns

`Promise`\<[`EmergentTool`](../interfaces/EmergentTool.md) \| `undefined`\>

***

### syncPersistedTool()

> **syncPersistedTool**(`tool`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:548](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentCapabilityEngine.ts#L548)

Hydrate a persisted tool back into a live runtime and make it executable.

This is used by backend/admin control planes to sync shared tools from
durable storage into a running ToolOrchestrator after promotion or restart.

#### Parameters

##### tool

[`EmergentTool`](../interfaces/EmergentTool.md)

#### Returns

`Promise`\<`void`\>
