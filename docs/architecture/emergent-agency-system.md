---
title: "Emergent Agency System"
sidebar_position: 15
description: "How AgentOS coordinates multiple GMIs (the agency layer) and how it synthesises new specialist agents at runtime (the emergent layer). Verified against the agentos source — the previous version of this page documented application-layer code that does not live in the package."
---

A single GMI is a mind. Most agent runtimes stop there: one mind per request, one persona per session. AgentOS does too, when one mind is enough. But research that holds up has more than one author. A reviewer is not the same person as a writer. A planner who decomposes a goal benefits from not also being the executor who runs the steps. The runtime support for "more than one mind, on the same task, coordinating" is the **agency** layer. The runtime support for "the orchestrator decides at execution time that it needs a specialist mind it didn't have when the run started" is the **emergent** layer. They compose, but they're separate systems with separate config surfaces.

This page documents both. It deliberately replaces an earlier draft that described `EmergentAgencyCoordinator` and `MultiGMIAgencyExecutor` — those classes belong to a downstream wilds-ai backend, not to agentos core, and surfacing them here misled readers about what shipping with `@framers/agentos` actually gets you.

> **Scope note.** The agency layer described here is for **single-request multi-agent coordination** — one external request produces one coordinated multi-agent response. Long-running world simulations where a fixed roster of agents all run in parallel each turn against an evolving world state (e.g. paracosm, Mars Genesis) don't fit this shape and shouldn't be force-fitted; build your own turn loop with `agent()` + (optionally) `EmergentAgentForge` / `EmergentAgentJudge` directly. See the [scope table in AGENCY_API](/orchestration/agency-api#scope-when-to-reach-for-agency) for which patterns belong here vs in your own orchestrator.

## The agency layer

An **agency** is a named roster of GMIs (or a mix of GMIs and tools) coordinating on a shared goal. The configuration shape is [`AgencyOptions`](https://github.com/framersai/agentos/blob/master/src/api/types.ts) (extends `BaseAgentConfig`):

```typescript
import { agency } from '@framers/agentos';

const myAgency = agency({
  agents: {
    researcher: { instructions: 'Find relevant papers and pull verbatim quotes.' },
    writer:     { instructions: 'Compose a clear, well-cited summary.' },
    reviewer:   { instructions: 'Critique for accuracy and missing citations.' },
  },
  strategy: 'review-loop',
  maxRounds: 3,
});

const result = await myAgency.generate('Summarise advances in retrieval-augmented generation since 2023.');
```

`agents` is a `Record<string, BaseAgentConfig | Agent>` — each entry is either a config object the agency will instantiate, or a pre-built `Agent` you've already constructed. The latter is how you reuse a heavyweight agent (one with full memory + tool surface) across multiple agencies without rebuilding it.

### The six strategies

`AgencyStrategy` is defined in `src/api/types.ts`:

| Strategy | Behavior | Best for |
|---|---|---|
| `sequential` | Each agent runs after the previous one completes; each output feeds into the next agent's input | Pipelines where one phase clearly precedes the next (research → write → review) |
| `parallel` | All agents run concurrently against the same input; outputs are aggregated | Independent perspectives on the same question (multi-source research, ensemble opinions) |
| `debate` | Agents critique and refine each other's outputs across rounds, capped by `maxRounds` | Adversarial scrutiny — getting two strong views and forcing them to converge or surface real disagreement |
| `review-loop` | One agent produces, another reviews; loop continues until reviewer accepts or `maxRounds` hits | Quality-gated outputs where one agent is the author and another is the gatekeeper |
| `hierarchical` | A coordinator agent delegates to sub-agents and synthesises their results | Complex goals with clear decomposition (manager + ICs pattern) |
| `graph` | Explicit DAG via `dependsOn` on each sub-agent; runs roots first, then dependents | Workflows with explicit dependency structure that don't fit the linear strategies above |

The `adaptive: true` option lets the orchestrator override the configured strategy at runtime if the task complexity signals warrant it (currently a conservative override — most runs use the requested strategy).

### Agency runtime classes

Coordination state lives in [`src/agents/agency/`](https://github.com/framersai/agentos/tree/master/src/agents/agency):

| Class | Purpose |
|---|---|
| [`AgencyRegistry`](https://github.com/framersai/agentos/blob/master/src/agents/agency/AgencyRegistry.ts) | Tracks active agencies and the GMIs each contains. `agency()` registers; the orchestrator looks up GMIs by agency ID + role name during execution. |
| [`AgencyMemoryManager`](https://github.com/framersai/agentos/blob/master/src/agents/agency/AgencyMemoryManager.ts) | Shared memory across the agency's GMIs, separate from each GMI's private cognitive memory. The shared memory is what lets the writer see the researcher's findings without re-running retrieval. |
| [`AgentCommunicationBus`](https://github.com/framersai/agentos/blob/master/src/agents/agency/AgentCommunicationBus.ts) (`IAgentCommunicationBus`) | The structured messaging layer. Supports point-to-point send, broadcast, request/response, and handoff with state transfer. Message types include `task_delegation`, `status_update`, `question`, `answer`, `finding`, `decision`, `critique`, `handoff`. |

Each GMI in the agency keeps its own persona, traits, and cognitive memory. The agency adds coordination on top — it doesn't merge the GMIs into one entity.

### Communication patterns

The bus interface ([`IAgentCommunicationBus`](https://github.com/framersai/agentos/blob/master/src/agents/agency/IAgentCommunicationBus.ts)) supports four patterns:

```typescript
// Point-to-point: targeted message to a specific agent
await bus.sendToAgent('researcher-gmi', {
  type: 'question',
  content: 'What did you find about topic X?',
  priority: 'normal',
});

// Broadcast: all agents in the agency
await bus.broadcast({
  type: 'finding',
  content: 'New constraint discovered: deadline moved to Friday.',
});

// Request/response: send + wait for reply
const answer = await bus.request('researcher-gmi', {
  type: 'question',
  content: 'Does the source say anything about throughput?',
});

// Handoff: transfer state with the message
await bus.handoff('writer-gmi', {
  state: { findings, citations, openQuestions },
  message: { type: 'handoff', content: 'Research complete; writing phase begins.' },
});
```

Handoffs are the pattern most worth understanding. They aren't just messages — they bundle the transferring agent's findings and partial state. The receiving agent gets a snapshot of where the previous agent left off, which is what lets the writer pick up from the researcher's notes without having to re-derive them.

## The emergent layer

[`EmergentConfig`](https://github.com/framersai/agentos/blob/master/src/api/types.ts) is a separate concern. The agency layer is about coordinating GMIs you defined ahead of time. The emergent layer is about the orchestrator synthesising a *new* GMI at runtime when the existing roster doesn't cover a sub-task.

```typescript
const myAgency = agency({
  agents: {
    researcher: { instructions: '...' },
    writer:     { instructions: '...' },
  },
  strategy: 'hierarchical',
  emergent: {
    enabled: true,
    tier: 'session',  // 'session' | 'agent' | 'shared'
    judge: true,       // run a judge agent over the synthesised spec before activating
  },
});
```

When `emergent.enabled` is true, the orchestrator may decide — based on its decomposition of the goal — that it needs a specialist that wasn't in the roster (e.g., a "fact-checker" GMI for a research agency that didn't define one). It synthesises a config for the new GMI, optionally runs a judge agent over the spec, and activates the new specialist for the duration of the run.

The `tier` controls visibility:

- `session` — ephemeral; the synthesised GMI is discarded when the run completes
- `agent` — persisted for the lifetime of the parent agent instance
- `shared` — persisted globally across all agent instances created from this configuration

The tradeoff is straightforward: `session` is safest (no state escapes the run), `shared` is most efficient (the runtime amortises synthesis across many runs). Most production deployments use `session` unless they have a specific reason to persist.

The implementation lives in [`src/emergent/`](https://github.com/framersai/agentos/tree/master/src/emergent):

| Class | Role |
|---|---|
| `EmergentCapabilityEngine` | Decides when tool synthesis is warranted; constructs the spec |
| `EmergentJudge` | LLM-as-judge safety gate for synthesised **tools** (code review + test validation) |
| `EmergentAgentForge` | Stateless validator + config builder for synthesised **agents** (used by `spawn_specialist`) |
| `EmergentAgentJudge` | LLM-as-judge safety gate for synthesised **agents** (scope + safety review of the spec) |
| `EmergentToolRegistry` | Persists approved emergent tools (when tier is `agent` or `shared`) |
| `ComposableToolBuilder` | Declarative tool composition: chain existing tools into a new one without code |
| `AdaptPersonalityTool` | Bounded personality adaptation; lets a long-running GMI shift its HEXACO traits within configured ranges |
| `ForgeShapeValidator` / `ForgeRejectionClassifier` / `ForgeStatsAggregator` | The validation pipeline for the runtime tool forge |

## Hierarchical + emergent: agent spawning

The cleanest expression of "I want a manager that can decompose my goal AND spawn the specialists it needs" is the natural composition of the `'hierarchical'` strategy with `emergent.enabled`. When that combination is active, the manager agent gets one extra tool — `spawn_specialist` — that lets it grow the roster mid-run.

```typescript
import { agency } from '@framers/agentos';

const research = agency({
  agents: {
    researcher: { instructions: 'Find papers and pull verbatim quotes.' },
    writer:     { instructions: 'Write clear, well-cited prose.' },
  },
  strategy: 'hierarchical',
  emergent: {
    enabled: true,
    judge: true,
    planner: {
      maxSpecialists: 3,
      requireJustification: true,
    },
  },
});

const result = await research.generate(
  'Survey the post-2023 RAG literature, including evaluation methodology and known limitations.'
);
```

What happens at runtime when the manager hits a gap (the goal needs a fact-checker that wasn't in the static roster):

1. Manager LLM emits a `tool_call` to `spawn_specialist({ role, instructions, justification })`.
2. [`EmergentAgentForge`](https://github.com/framersai/agentos/blob/master/src/emergent/EmergentAgentForge.ts) validates the spec (reserved-name check, identifier rules, instruction-length cap) and produces a `BaseAgentConfig`.
3. If `emergent.judge === true`, [`EmergentAgentJudge`](https://github.com/framersai/agentos/blob/master/src/emergent/EmergentAgentJudge.ts) runs one LLM-as-judge call evaluating the spec on safety / scope / risk; rejection short-circuits with no roster mutation.
4. The new agent is added to the running roster, and `delegate_to_factChecker` becomes available on the manager's next turn.
5. A `ForgeEvent` fires through the existing `emergentForge` callback for audit + observability.
6. Manager calls `delegate_to_factChecker({ task: '...' })` and gets the result back.
7. On run completion, the synthesised agent's lifetime depends on `emergent.tier`.

The `planner` sub-config bounds the manager's freedom to grow the roster:

| Field | Default | Effect |
|---|---|---|
| `maxSpecialists` | `5` | Hard cap on **successful** synthesis count per run. Past the cap, `spawn_specialist` returns an error to the manager. |
| `requireJustification` | `false` | Forces the manager to explain why no static agent can handle the task. Surfaces on the `ForgeEvent` for audit. |
| `maxJudgeCalls` | `maxSpecialists * 2` | Bounds the judge LLM cost. Counts rejected spawns too (the judge already ran). No effect when `judge: false`. |
| `judgeModel` | provider-aware small-model default (`gpt-4o-mini`, `claude-haiku-4-5-20251001`, `gemini-2.5-flash`, `llama-3.3-70b-versatile`); falls back to agency model | Override when you want a more capable judge — defaults pick a cheap model so `judge: true` doesn't silently route every spawn through the agency's full model. |

Subscribe to synthesis events for observability:

```typescript
const research = agency({
  // ...same as above...
  on: {
    emergentForge: (event) => {
      logger.info('agent.synthesised', {
        agentName: event.agentName,
        approved: event.approved,
        timestamp: event.timestamp,
      });
    },
  },
});
```

Tested rejection paths (each short-circuits cleanly with a structured tool-result error the manager can recover from):

- Empty `instructions` — forge rejection
- Reserved role name (e.g. `spawn_specialist`, `final_answer`) — forge rejection
- Invalid identifier (spaces, leading digit) — forge rejection
- `requireJustification: true` with missing justification — pre-forge rejection
- `maxSpecialists` cap reached — pre-forge rejection
- `maxJudgeCalls` cap reached — pre-judge rejection
- Role collides with existing roster entry — pre-forge rejection
- HITL `beforeEmergent: true` handler returns `approved: false` — pre-forge rejection (no roster mutation, no event)
- Judge returns `approved: false` — post-forge rejection (no roster mutation, no event)
- Judge LLM error or malformed JSON — treated as rejection

For high-stakes deployments, combine `judge: true` with `hitl.approvals.beforeEmergent: true` — the judge filters automated rejections; the HITL handler gives a human final say on every spawn that survives the judge.

## How agency and emergent compose

The two systems are orthogonal but layer cleanly:

1. You define an agency with a static roster (`agency({ agents: {...} })`).
2. You enable `emergent: true` on the agency.
3. The orchestrator runs the goal through whichever strategy you picked.
4. If decomposition surfaces a sub-task no static agent covers, the emergent engine synthesises a specialist for it.
5. The new GMI participates in the strategy's coordination (added to the bus, registered with `AgencyRegistry`, given access to shared memory).
6. When the run completes, the synthesised GMI's lifetime depends on `emergent.tier`.

You can also use either layer alone:

- **Agency without emergent** — Static roster only. Predictable, deterministic, easier to debug. Use when you know the role decomposition ahead of time.
- **Emergent without agency** — A single agent with `emergent: true` and the `forge_tool` meta-tool can synthesise new tools mid-run within the [sandbox security boundary](/architecture/sandbox-security). No multi-agent coordination, but runtime tool creation. Use when the task surface is open-ended (research assistants, exploratory analysis).

## Honest limits

The agency layer is in active development. The strategies are real, the bus is real, the registry is real, and the simple cases (sequential pipeline, parallel ensemble, review-loop) work end-to-end with current test coverage. The hierarchical+emergent path documented above is newly landed — `spawn_specialist`, `EmergentAgentForge`, and the `EmergentAgentJudge` gate are integration-tested (11 tests covering the happy path plus every documented rejection mode), but the more elaborate scenarios (deep delegation chains across many synthesised specialists, debate strategy combined with emergent) are still settling.

The emergent layer's tool-forge path is hardened — it goes through the [`SandboxedToolForge`](https://github.com/framersai/agentos/blob/master/src/emergent/SandboxedToolForge.ts) into the [Code Sandbox](/architecture/sandbox-security) with the documented opt-in fetch / fs / crypto allowlist. The agent-synthesis path is more recent; review the synthesised spec before enabling `tier: 'shared'` in production. When `emergent.judge: true`, every spawn pays for one extra LLM call; budget accordingly via `controls.maxCostUSD` and the `planner.maxSpecialists` cap.

## Source map

- [`src/agents/agency/`](https://github.com/framersai/agentos/tree/master/src/agents/agency) — `AgencyRegistry`, `AgencyMemoryManager`, `AgentCommunicationBus`, `AgencyTypes`
- [`src/api/agency.ts`](https://github.com/framersai/agentos/blob/master/src/api/agency.ts) — the `agency()` factory
- [`src/api/types.ts`](https://github.com/framersai/agentos/blob/master/src/api/types.ts) — `AgencyOptions`, `AgencyStrategy`, `EmergentConfig`
- [`src/emergent/`](https://github.com/framersai/agentos/tree/master/src/emergent) — emergent engine, judge, tool forge, registry, validators

## See also

- [GMI](/architecture/gmi) — what a single mind looks like before you start composing them
- [Skills vs Tools vs Extensions](/architecture/skills-vs-tools-vs-extensions) — the capability layer each GMI in an agency can pull from
- [Sandbox Security](/architecture/sandbox-security) — the boundary the emergent layer's tool synthesis runs through
- [System Architecture](./system-architecture.md) — full request lifecycle including agency dispatch

---

## References

### Multi-agent coordination patterns

- Park, J. S., O'Brien, J. C., Cai, C. J., Morris, M. R., Liang, P., & Bernstein, M. S. (2023). *Generative agents: Interactive simulacra of human behavior.* arXiv preprint. — Smallville generative agents — the canonical "agents-with-memory-that-act-in-character" demo at small scale; the agency layer here ports that pattern into a production runtime. [arXiv:2304.03442](https://arxiv.org/abs/2304.03442)
- Wu, Q., Bansal, G., Zhang, J., Wu, Y., Li, B., Zhu, E., Jiang, L., Zhang, X., Zhang, S., Liu, J., Awadallah, A. H., White, R. W., Burger, D., & Wang, C. (2023). *AutoGen: Enabling next-gen LLM applications via multi-agent conversation.* arXiv preprint. — Reference architecture for the manager-with-delegation pattern that AgentOS's `hierarchical` strategy adopts. [arXiv:2308.08155](https://arxiv.org/abs/2308.08155)
- Sumers, T. R., Yao, S., Narasimhan, K., & Griffiths, T. L. (2023). *Cognitive architectures for language agents.* arXiv preprint. — CoALA framework; agency adds coordination on top of the per-GMI cognitive architecture defined here. [arXiv:2309.02427](https://arxiv.org/abs/2309.02427)

### Emergent agent / tool synthesis

- Hong, S., Zhuge, M., Chen, J., Zheng, X., Cheng, Y., Zhang, C., Wang, J., Wang, Z., Yau, S. K. S., Lin, Z., Zhou, L., Ran, C., Xiao, L., Wu, C., & Schmidhuber, J. (2023). *MetaGPT: Meta programming for a multi-agent collaborative framework.* arXiv preprint. — Reference for runtime role decomposition via LLM planner; informed `spawn_specialist`'s prompt + judgment design. [arXiv:2308.00352](https://arxiv.org/abs/2308.00352)
- Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan, K., & Cao, Y. (2023). *ReAct: Synergizing reasoning and acting in language models.* arXiv preprint. — Reasoning-and-acting loop the manager runs through when calling `spawn_specialist` + `delegate_to_<role>` in sequence. [arXiv:2210.03629](https://arxiv.org/abs/2210.03629)

### LLM-as-judge

- Zheng, L., Chiang, W.-L., Sheng, Y., Zhuang, S., Wu, Z., Zhuang, Y., Lin, Z., Li, Z., Li, D., Xing, E. P., Zhang, H., Gonzalez, J. E., & Stoica, I. (2023). *Judging LLM-as-a-judge with MT-Bench and chatbot arena.* arXiv preprint. — Methodology behind the `EmergentAgentJudge` design; documents reliability, bias, and confidence calibration of LLM judges. [arXiv:2306.05685](https://arxiv.org/abs/2306.05685)

### Implementation references

- [`src/agents/agency/`](https://github.com/framersai/agentos/tree/master/src/agents/agency) — `AgencyRegistry`, `AgencyMemoryManager`, `AgentCommunicationBus`, `AgencyTypes`
- [`src/api/agency.ts`](https://github.com/framersai/agentos/blob/master/src/api/agency.ts) — the `agency()` factory + `validateAgencyOptions`
- [`src/api/runtime/strategies/hierarchical.ts`](https://github.com/framersai/agentos/blob/master/src/api/runtime/strategies/hierarchical.ts) — strategy compiler with `buildHierarchicalTools` + `spawn_specialist` injection
- [`src/api/types.ts`](https://github.com/framersai/agentos/blob/master/src/api/types.ts) — `AgencyOptions`, `AgencyStrategy`, `EmergentConfig`, `EmergentPlannerConfig`
- [`src/emergent/EmergentAgentForge.ts`](https://github.com/framersai/agentos/blob/master/src/emergent/EmergentAgentForge.ts) — agent-spec validator
- [`src/emergent/EmergentAgentJudge.ts`](https://github.com/framersai/agentos/blob/master/src/emergent/EmergentAgentJudge.ts) — agent-spec safety judge
