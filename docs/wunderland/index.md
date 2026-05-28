---
title: "Wunderland — Getting Started"
sidebar_position: 1
displayed_sidebar: guideSidebar
description: 'Autonomous AI agent framework with cognitive memory, infinite-context graph-based RAG, HEXACO personality, and a 28-command CLI. Built on OpenClaw, integrates with the AgentOS extension surface via @framers/agentos-extensions-registry. Preview release.'
---

:::info Preview
Wunderland is under active development. APIs and CLI surface may change. Production deployments should pin a specific version. Canonical home: [wunderland.sh](https://wunderland.sh) · [docs.wunderland.sh](https://docs.wunderland.sh) · [github.com/jddunn/wunderland](https://github.com/jddunn/wunderland).
:::

> Autonomous AI agent framework with cognitive memory, infinite-context graph-based RAG, and HEXACO personality modeling, built on [OpenClaw](https://github.com/openclaw) with 5-tier prompt-injection defense, adaptive HyDE retrieval, observational memory with Ebbinghaus decay, 37 channel integrations, and an interactive-wizard CLI.

Wunderland is a sister project that consumes the AgentOS extension and skill surfaces (`@framers/agentos-extensions-registry`, `@framers/agentos-skills-registry`) and layers a packaged runtime, a 28-command CLI, an HTTP API, and curated agent presets on top. If you want a typescript SDK to embed in your application, use [`@framers/agentos`](https://www.npmjs.com/package/@framers/agentos). If you want a batteries-included CLI plus daemon you can install globally and configure with a wizard, use Wunderland.

---

## What it does

- **Natural-language agent creation**: `wunderland create "I need a research bot..."` extracts a typed config with confidence scoring.
- **HEXACO personality modeling**: six trait axes drive system-prompt synthesis, mood adaptation, and behavioral style.
- **5-tier prompt-injection defense**: tool outputs are wrapped as untrusted content by default; `dangerous` / `permissive` / `balanced` / `strict` / `paranoid` named tiers gate every operation.
- **Cognitive memory pipeline**: observational memory with Ebbinghaus decay, adaptive HyDE retrieval, knowledge-graph entity extraction, multimodal RAG. Same architecture documented in the [AgentOS Memory System Overview](/features/memory-system-overview), packaged with sensible defaults.
- **Multi-provider LLM routing**: OpenAI, Anthropic, OpenRouter, Ollama natively; everything else via OpenRouter.
- **Step-up HITL authorization**: Tier 1 autonomous, Tier 2 async review, Tier 3 synchronous human approval.
- **88 curated skills** + **8 built-in tools** + **8 agent presets** auto-loaded from the AgentOS skills/extensions registries.
- **Capability discovery**: 3-tier semantic search across tools, skills, extensions, and channels (~90% token reduction vs static loading).
- **Emergent capabilities**: agents forge new tools at runtime with LLM-as-judge verification and tiered trust promotion.
- **Adaptive execution runtime**: rolling task-outcome KPI telemetry persisted via [`@framers/sql-storage-adapter`](https://www.npmjs.com/package/@framers/sql-storage-adapter), with automatic degraded-mode recovery.
- **Provenance and audit trails**: hash chains, Merkle trees, signed event ledgers, OpenTelemetry export.

---

## Install

```bash
# pnpm recommended (npm on Node 25 has known resolution bugs)
pnpm add -g wunderland

# or globally with npm on Node 22 LTS
npm install -g wunderland

# fastest first run
wunderland quickstart
```

Wunderland requires Node.js 18+. The CLI auto-detects [Ollama](https://ollama.ai) for offline / local-LLM operation; if Ollama isn't installed, the setup wizard prompts for an API key for any supported provider.

---

## CLI

```bash
# Interactive setup wizard
wunderland setup

# Open the terminal dashboard with guided onboarding tour
wunderland

# Health check + operator help
wunderland doctor
wunderland help getting-started
wunderland help workflows
wunderland help tui

# Provider defaults (image gen, TTS, STT, web search)
wunderland extensions configure
wunderland extensions info image-generation

# UI / accessibility
wunderland --theme cyberpunk
wunderland --ascii

# Run the agent server
wunderland start
wunderland chat
```

The full 28-command surface covers `setup`, `chat`, `rag`, `agency`, `workflows`, `evaluate`, `provenance`, `knowledge`, `marketplace`, `agents`, `ps`, `stop`, `logs`, `monitor`, `serve`, AI generation (`image`, `video`, `audio`, `vision`, `structured`), authentication (`login`, `logout`, `auth-status`), and more. See `wunderland help` for the per-command reference, or [docs.wunderland.sh](https://docs.wunderland.sh) for the published guide.

---

## Library API

```ts
import { createWunderland } from 'wunderland';

const app = await createWunderland({ llm: { providerId: 'openai' } });
const session = app.session();
const out = await session.sendText('Hello!');

console.log(out.text);
console.log(await session.usage());
```

Usage and cost totals persist in the shared home ledger at `~/.framers/usage-ledger.jsonl` by default, so `wunderland status`, `app.usage()`, and `session.usage()` inspect cumulative model usage across separate runs. Set `AGENTOS_USAGE_LEDGER_PATH` or `WUNDERLAND_USAGE_LEDGER_PATH` to relocate; pass an explicit config-dir override for Wunderland-only isolation.

### Why `createWunderland()` instead of `agent()`

`@framers/agentos` exposes streamlined helpers (`generateText`, `streamText`, `agent`) for lightweight in-process usage. Wunderland layers operational concerns on top: curated tool loading, skill registries, capability discovery, approval gates, extension auto-loading, adaptive execution, workspace policies, and preset-driven configuration. Use `agent()` when you want a focused SDK; use `createWunderland()` when you want the packaged runtime.

### Presets

```ts
const app = await createWunderland({
  llm: { providerId: 'openai' },
  preset: 'research-assistant',
});
```

Eight presets ship: `research-assistant`, `customer-support`, and others under [`packages/wunderland/presets/agents/`](https://github.com/jddunn/wunderland/tree/master/presets/agents). Presets auto-load recommended tools, skills, and extensions; override or extend any preset by passing additional config alongside.

### Orchestrated execution

```ts
import { createWunderland } from 'wunderland';
import { workflow } from 'wunderland/workflows';

const app = await createWunderland({ llm: { providerId: 'openai' }, tools: 'curated' });

const compiled = workflow('research-pipeline')
  .input({ type: 'object', required: ['topic'], properties: { topic: { type: 'string' } } })
  .returns({ type: 'object', properties: { finalSummary: { type: 'string' } } })
  .step('research', { gmi: { instructions: 'Research the topic and return JSON under scratch.research.' } })
  .then('judge', { gmi: { instructions: 'Score the research and return JSON under scratch.judge.' } })
  .compile();

const result = await app.runGraph(compiled, { topic: 'graph-based agent runtimes' });
```

`workflow()` for deterministic DAGs, `AgentGraph` for loops and routers, `mission()` for planner-driven orchestration. All three compile to the same graph IR and execute through Wunderland's curated tools, approvals, and runtime policies.

---

## How it works

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Wunderland Runtime                            │
│                                                                      │
│  bootstrap   AgentBootstrap (single source of truth for init)        │
│  core        WunderlandSeed, HEXACO, PresetLoader, AgentManifest     │
│  security    PreLLMClassifier, DualLLMAuditor, SignedOutputVerifier  │
│  inference   HierarchicalInferenceRouter, SmallModelResolver         │
│  authz       StepUpAuthorizationManager (Tier 1/2/3)                 │
│  runtime     Tool calling, approvals, system prompts, LLM adapters   │
│  api         HTTP API server (chat, agents, health, social, config)  │
│  social      WonderlandNetwork, Mood/Trust/Safety/Alliance engines   │
│  jobs        JobEvaluator, JobScanner, JobExecutor, BidLifecycle     │
│  rag         WunderlandRAGClient over vector + graph stores          │
│  workflows   AgentGraph, workflow(), mission(), WorkflowEngine       │
│  evaluation  Evaluator, LLMJudge, criteria presets                   │
│  knowledge   KnowledgeGraph, entity extraction, semantic search      │
│  provenance  HashChain, MerkleTree, SignedEventLedger, AnchorMgr     │
│  pairing     PairingManager (allowlist management)                   │
│  storage     Agent storage, memory auto-ingest                       │
│  memory      Cognitive memory initializer                            │
│  observ.     OpenTelemetry, usage tracking                           │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼ shared substrate
┌──────────────────────────────────────────────────────────────────────┐
│                          AgentOS Surfaces                            │
│  @framers/agentos-extensions-registry  →  curated tools / channels   │
│  @framers/agentos-skills-registry      →  88 SKILL.md skills        │
│  @framers/agentos                      →  GMI runtime, memory, RAG   │
│  @framers/sql-storage-adapter          →  SQLite / Postgres / etc    │
└──────────────────────────────────────────────────────────────────────┘
```

The runtime initializes through `AgentBootstrap`, which is the single entry point that resolves the agent config, loads the LLM provider, wires the security pipeline (3-layer: pre-LLM classifier, dual-LLM auditor, signed output verifier), opens the storage adapter, and registers tools, skills, and extensions from the AgentOS registries plus any user-supplied directories.

The 5 named security tiers (`dangerous`, `permissive`, `balanced`, `strict`, `paranoid`) gate which extensions auto-load, which tools require approval, which folders the agent can read or write, and what gets logged. Default is `balanced`. The 6-step LLM guard chain runs on every turn: circuit breakers, cost guards, stuck detection, action dedup, content similarity checks, and audit logging.

---

## What it's good for

- **Always-on agents**: a `wunderland start` daemon plus a `daemon/` background process manager keeps agents running across restarts.
- **Researcher / operator workflows**: the 28-command CLI exposes evaluation, provenance, and knowledge-graph tooling that the lower-level SDK doesn't expose.
- **Multi-agent collectives**: AgencyRegistry plus AgentCommunicationBus plus shared AgencyMemoryManager handle agent-to-agent messaging and shared state.
- **Self-hosted production**: 5-tier security, signed event ledgers, OpenTelemetry, and step-up HITL authorization are configured by default.

---

## When to use what

| Want | Use |
|---|---|
| Embed a typescript SDK in your app | [`@framers/agentos`](https://www.npmjs.com/package/@framers/agentos) |
| Visual debugger / dashboard | [AgentOS Workbench](https://github.com/framersai/agentos-workbench) |
| Batteries-included CLI + daemon | [`wunderland`](https://www.npmjs.com/package/wunderland) (this) |
| Structured world simulation engine | [`paracosm`](https://www.npmjs.com/package/paracosm) |
| Public benchmarks harness | [`@framers/agentos-bench`](https://github.com/framersai/agentos-bench) |

All of these share the same memory, retrieval, and orchestration primitives. Wunderland adds the operator surface (CLI, daemon, dashboard, presets, security tiers, audit ledger) without forking the substrate.

---

## Links

- **Site**: [wunderland.sh](https://wunderland.sh)
- **Docs**: [docs.wunderland.sh](https://docs.wunderland.sh)
- **Source**: [github.com/jddunn/wunderland](https://github.com/jddunn/wunderland)
- **npm**: [`wunderland`](https://www.npmjs.com/package/wunderland)
- **License**: [Apache-2.0](https://github.com/jddunn/wunderland/blob/master/LICENSE)

Discord and Telegram for both AgentOS and Wunderland: [wilds.ai/discord](https://wilds.ai/discord) · [t.me/rabbitholewun](https://t.me/rabbitholewun).
