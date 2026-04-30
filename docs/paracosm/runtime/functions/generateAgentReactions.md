# Function: generateAgentReactions()

> **generateAgentReactions**(`agents`, `ctx`, `options?`): `Promise`\<`AgentReaction`[]\>

Defined in: [apps/paracosm/src/runtime/agent-reactions.ts:194](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/agent-reactions.ts#L194)

Generate reactions from all alive agents in parallel.
Uses cheap model (gpt-4o-mini / haiku) for cost efficiency.

## Parameters

### agents

[`Agent`](../../engine/interfaces/Agent.md)[]

### ctx

`ReactionContext`

### options?

#### batchSize?

`number`

Number of agents to pack into a single LLM call. Default 10.
Set to 1 to disable batching entirely (one call per agent, legacy
path). 10 is the sweet spot on haiku/mini: small enough that a
single bad batch only loses 10 reactions, large enough to make
the shared crisis context (~250 tok) pay off against the per-
agent block (~200 tok each).

Cost math, 100 agents one turn on haiku:
  batchSize=1:  100 calls × (1500 in + 150 out) ≈ $0.18
  batchSize=10:  10 calls × (2500 in + 1500 out) ≈ $0.08
  batchSize=20:   5 calls × (4500 in + 3000 out) ≈ $0.06  (but
    output-token ceiling risks truncating the JSON array, and a
    single bad batch loses 20 reactions)

#### maxConcurrent?

`number`

#### model?

`string`

#### onProviderError?

(`err`) => `void`

Called with the raw caught error when a reaction LLM call throws.
Invoked AT MOST ONCE per batch even if every reaction throws: 100
identical quota errors in one turn would otherwise spam the
classifier. The orchestrator's provider-error flag is idempotent,
but keeping the log output manageable matters too.

#### onSchemaAttempt?

(`attempts`, `fellBack`) => `void`

Fires once per batched call with attempts + fallback flag so the
orchestrator can track schema retry rates on ReactionBatch. One
call per batch (roughly N_agents / batchSize calls per turn).

#### onUsage?

(`result`) => `void`

Optional callback invoked after every reaction LLM
       call. Lets the orchestrator fold agent-reaction spend (~100 calls
       per turn × however many turns) into the run-wide cost telemetry.
       Without this, reaction costs on Anthropic haiku (~$0.004/call)
       silently disappeared from `runSimulation().cost` even though the
       real API bill was accumulating.

#### provider?

`string`

#### reactionContextHook?

(`agent`, `ctx`) => `string`

## Returns

`Promise`\<`AgentReaction`[]\>
