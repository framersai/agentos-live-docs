---
title: "Runtime Status Matrix"
sidebar_position: 3
displayed_sidebar: guideSidebar
---

This page is the canonical status snapshot for the main AgentOS runtime surfaces. Use it when you need the shortest honest answer to "what is shipped, what is partial, and what is still planned?"

## Status Key

- **Shipped**: supported in the normal runtime path today
- **Partial / Experimental**: implemented or exposed, but not the default path or not fully wired everywhere
- **Planned**: useful direction, but not yet a supported runtime surface

## Matrix

| Surface | Status | What works today | Important limits |
| --- | --- | --- | --- |
| `workflow()` | **Shipped** | Deterministic DAG compilation, branching/parallelism, checkpointing, streaming | Best fit for fixed pipelines, not dynamic planning |
| `AgentGraph` | **Shipped** | Explicit graph builder, cycles, conditional edges, shared `CompiledExecutionGraph` runtime | Advanced edge types still depend on runtime wiring below |
| `mission()` | **Partial / Experimental** | Goal-first builder, anchors, mission-level policies, `toWorkflow()` export | Current compiler still emits a fixed phase-ordered stub graph; planner hints do not reshape runtime execution |
| Discovery edges | **Partial / Experimental** | Discovery edge type exists and can fall back cleanly | Active capability discovery only works when the discovery engine/registry wiring is present in the host runtime |
| Personality edges | **Partial / Experimental** | Personality edge type exists in the IR/runtime model | Default branch behavior is used unless a trait source is injected |
| `extension` / `subgraph` node execution | **Partial / Experimental** | Supported in bridge runtimes and selected host integrations | Bare `NodeExecutor` does not cover every extension/subgraph execution path |
| `ExtensionLoader` auto-install/scan flow | **Partial / Experimental** | Utility exists for registry scanning and auto-install experiments | Not wired into `AgentOS.initialize()`; treat it as experimental host tooling |
| `/api/agentos/extensions/install` | **Partial / Experimental** | Public backend surface exists for host scaffolding | Still a placeholder route, not a real package installer |
| `/api/agentos/tools/execute` | **Partial / Experimental** | Public backend surface exists for host scaffolding | Still a placeholder echo path, not a full runtime bridge |
| `RetrievalAugmentor` runtime path | **Shipped** | Default ingest/query/delete path, vector retrieval with keyword fallback, multimodal PDF text now indexed into normal RAG | Still separate from the opt-in unified query-time stack |
| `UnifiedRetriever` | **Partial / Experimental** | Real opt-in retriever with source fusion/orchestration | Not the default runtime query path yet |
| Memory lifecycle retention / decay | **Shipped** | Candidate discovery works on stores that implement `scanByMetadata()`; retention/cleanup policies can execute | Provider parity is still incomplete across every vector backend |
| Multimodal PDF text retrieval | **Partial / Experimental** | PDF/document text is indexed into normal RAG during ingest | `UnifiedRetriever` still treats multimodal as non-text-only at query time |
| Bench-only retrieval stack (`HybridRetriever`, session retrieval) | **Planned** | Benchmark implementations exist and inform tuning decisions | Not yet promoted into the default product runtime |

## Recommended Defaults

- Prefer `workflow()` or `AgentGraph` for production orchestration today.
- Treat `mission()` as a forward-compatible authoring layer, not a planner-complete runtime.
- Treat `RetrievalAugmentor` as the current default runtime retrieval path.
- Treat `Qdrant` as the default OSS production vector backend.
- Treat `Pinecone` as an optional managed-cloud backend, not the architectural default.
- Treat `ExtensionLoader` and the placeholder backend install/execute routes as experimental.

## Related Guides

- [Unified Orchestration Layer](/features/unified-orchestration)
- [mission() API](/features/mission-api)
- [Auto-Loading Extensions](/extensions/auto-loading)
- [Backend API](/architecture/backend-api)
