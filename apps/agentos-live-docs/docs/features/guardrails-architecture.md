---
title: 'Guardrails Architecture'
sidebar_position: 7
---

# Guardrails Architecture

Deep dive into how the guardrail system works internally.

---

## Request Lifecycle

Every user message and LLM response passes through the guardrail dispatcher. Input guardrails run before the orchestrator sees the message; output guardrails run on each streaming chunk as it leaves the LLM.

```mermaid
flowchart LR
    A[User Input] --> B[Input Guardrails]
    B -->|BLOCK| C[Error Response]
    B -->|SANITIZE| D[Modified Input]
    B -->|ALLOW/FLAG| D
    D --> E[Orchestrator / LLM]
    E --> F[Output Stream]
    F --> G[Output Guardrails]
    G -->|BLOCK| H[Stream Terminated]
    G -->|SANITIZE| I[Modified Output]
    G -->|ALLOW/FLAG| I
    I --> J[Client]
```

The three possible verdicts are:

- **ALLOW** — content passes through unchanged.
- **SANITIZE** — content is modified in-place (e.g., PII replaced with `[PERSON]`) and the modified version continues downstream.
- **BLOCK** — content is rejected. For input, an error response is returned immediately. For output, the stream is terminated with an `ERROR` chunk.
- **FLAG** — content passes through unchanged, but metadata is attached for downstream logging and auditing.

---

## Two-Phase Parallel Execution

The dispatcher splits registered guardrails into two phases based on whether they can modify content (`canSanitize`). Sanitizers must run sequentially (each one's output feeds the next). Non-sanitizing guardrails run in parallel for maximum throughput.

```mermaid
flowchart TD
    A[All Registered Guardrails] --> B{canSanitize?}
    B -->|true| C[Phase 1: Sequential]
    B -->|false| D[Phase 2: Parallel]

    C --> C1[PII Redaction]
    C1 -->|sanitized text| C2[Next Sanitizer...]
    C2 --> E[Sanitized Text]

    E --> D
    D --> D1[ML Classifiers]
    D --> D2[Topicality]
    D --> D3[Code Safety]
    D --> D4[Grounding Guard]

    D1 --> F{Worst Wins}
    D2 --> F
    D3 --> F
    D4 --> F

    F -->|BLOCK| G[Terminate]
    F -->|FLAG| H[Pass + Log]
    F -->|ALLOW| I[Pass]
```

**Worst-wins aggregation:** if any parallel guardrail returns `BLOCK`, the final verdict is `BLOCK` regardless of what the others returned. `FLAG` wins over `ALLOW`.

---

## Streaming Chunk Lifecycle

Output guardrails evaluate each chunk as it arrives from the LLM. A `BLOCK` verdict on any chunk terminates the entire stream. `SYSTEM_PROGRESS` chunks are passed through without evaluation.

```mermaid
sequenceDiagram
    participant LLM
    participant Dispatcher
    participant Guardrail
    participant Client

    LLM->>Dispatcher: TEXT_DELTA (chunk 1)
    Dispatcher->>Guardrail: evaluateOutput({chunk, ragSources})
    Guardrail-->>Dispatcher: null (allow)
    Dispatcher->>Client: TEXT_DELTA (chunk 1)

    LLM->>Dispatcher: TEXT_DELTA (chunk 2)
    Dispatcher->>Guardrail: evaluateOutput({chunk, ragSources})
    Guardrail-->>Dispatcher: BLOCK (violation!)
    Dispatcher->>Client: ERROR chunk
    Note over Client: Stream terminated

    LLM->>Dispatcher: TOOL_CALL_REQUEST
    Dispatcher->>Guardrail: evaluateOutput({chunk})
    Guardrail-->>Dispatcher: null (allow)
    Dispatcher->>Client: TOOL_CALL_REQUEST

    LLM->>Dispatcher: FINAL_RESPONSE
    Dispatcher->>Guardrail: evaluateOutput({chunk, ragSources})
    Guardrail-->>Dispatcher: FLAG (warning)
    Dispatcher->>Client: FINAL_RESPONSE + metadata
```

---

## PII Redaction Pipeline

The PII redaction guardrail uses a four-tier detection pipeline. Each tier gates the next — if Tier 2 finds no name-like tokens, the heavyweight Tier 3 BERT model never loads.

```mermaid
flowchart TD
    A[Input Text] --> B[Tier 1: Regex]
    B --> B1[SSN, CC, Email, Phone<br/>570+ patterns via OpenRedaction]
    B1 -->|high confidence<br/>score 0.85-1.0| R[Results]

    B1 --> C[Tier 2: NLP Pre-filter]
    C --> C1[compromise library<br/>.people/.places/.orgs]
    C1 -->|candidates found| D[Tier 3: NER Model]
    C1 -->|no candidates| Skip[Skip Tier 3 & 4]

    D --> D1[BERT bert-base-NER<br/>PER, LOC, ORG, MISC]
    D1 -->|score 0.3-0.7| E[Tier 4: LLM Judge]
    D1 -->|score > 0.7| R

    E --> E1[Chain-of-thought prompt<br/>Configurable lightweight model]
    E1 --> R

    R --> F[Entity Merger]
    F --> F1[Deduplicate overlapping spans<br/>Apply threshold & allowlist]
    F1 --> G[Redaction Engine]
    G --> G1[placeholder / mask / hash / category-tag]

    style B fill:#2d5016,color:#fff
    style C fill:#1a3a5c,color:#fff
    style D fill:#5c1a3a,color:#fff
    style E fill:#3a1a5c,color:#fff
```

For full configuration details, see [PII Redaction](/docs/extensions/built-in/pii-redaction).

---

## ML Classifier Sliding Window

The ML classifier guardrail uses a sliding window buffer to accumulate tokens before running inference. A context ring of 50 tokens carries forward between evaluations to maintain sentence context across chunk boundaries.

```mermaid
flowchart LR
    subgraph Buffer["Sliding Window Buffer"]
        direction TB
        CTX[Context Ring<br/>50 tokens] --> BUF[Current Buffer<br/>accumulating...]
    end

    A[Token Stream] -->|TEXT_DELTA| Buffer
    Buffer -->|chunk_size reached| C[Classifier Orchestrator]

    C --> C1[Toxicity<br/>toxic-bert<br/>~20ms]
    C --> C2[Injection<br/>DeBERTa<br/>~50ms]
    C --> C3[Jailbreak<br/>PromptGuard<br/>~60ms]

    C1 --> D{Worst Wins}
    C2 --> D
    C3 --> D

    D -->|BLOCK| E[Terminate Stream]
    D -->|ALLOW| F[Slide Window Forward]
    F -->|context carry-forward| Buffer
```

For full configuration details, see [ML Classifiers](/docs/extensions/built-in/ml-classifiers).

---

## Grounding Guard Flow

The grounding guard verifies that LLM claims are supported by the provided RAG sources. It extracts individual claims, cross-references each against source documents via NLI, and escalates ambiguous cases to an LLM judge.

```mermaid
flowchart TD
    A[LLM Response] --> B[Claim Extractor]
    B --> B1[Heuristic Sentence Split]
    B1 -->|simple sentences| C[NLI Cross-Encoder]
    B1 -->|complex sentences| B2[LLM Decomposition]
    B2 --> C

    C --> C1[claim vs source 1]
    C --> C2[claim vs source 2]
    C --> C3[claim vs source N]

    C1 --> D{Score}
    C2 --> D
    C3 --> D

    D -->|entailment > 0.7| E[SUPPORTED]
    D -->|contradiction > 0.7| F[CONTRADICTED]
    D -->|neutral| G[LLM Judge Escalation]
    G --> H[SUPPORTED / CONTRADICTED / UNVERIFIABLE]

    E --> I[Aggregate Results]
    F --> I
    H --> I

    I -->|any contradicted| J[FLAG/BLOCK]
    I -->|>50% unverifiable| K[FLAG]
    I -->|all supported| L[PASS]
```

For full configuration details, see [Grounding Guard](/docs/extensions/built-in/grounding-guard).

---

## Chunk Types

| Type                   | Key Fields                                         | When It Appears                        |
| ---------------------- | -------------------------------------------------- | -------------------------------------- |
| `TEXT_DELTA`           | `textDelta`, `isFinal: false`                      | Each token/word as LLM generates       |
| `FINAL_RESPONSE`       | `finalResponseText`, `ragSources`, `isFinal: true` | Complete response at end of stream     |
| `TOOL_CALL_REQUEST`    | `toolCalls: [{id, name, arguments}]`               | LLM wants to call a tool               |
| `TOOL_RESULT_EMISSION` | `toolCallId`, `result`                             | Tool execution result                  |
| `SYSTEM_PROGRESS`      | `progressMessage`                                  | Status updates (ignored by guardrails) |
| `ERROR`                | `code`, `message`                                  | Error (including guardrail blocks)     |

---

## Memory Budget

All models lazy-load on first use. Nothing is loaded until a guardrail actually evaluates content.

| Pack            | Idle      | Active     | What Loads                            |
| --------------- | --------- | ---------- | ------------------------------------- |
| PII Redaction   | 0         | ~115MB     | OpenRedaction + compromise + BERT NER |
| ML Classifiers  | 0         | ~98MB      | toxic-bert + DeBERTa + PromptGuard    |
| Topicality      | 0         | ~1.7MB     | Topic centroid embeddings             |
| Code Safety     | ~10KB     | ~10KB      | Compiled regex (always loaded)        |
| Grounding Guard | 0         | ~40MB      | NLI cross-encoder                     |
| **Combined**    | **~10KB** | **~255MB** | Only if ALL packs + ALL tiers active  |

---

## Related Documentation

- [Guardrails Overview](/docs/features/guardrails)
- [Creating Custom Guardrails](/docs/features/creating-guardrails)
- [PII Redaction](/docs/extensions/built-in/pii-redaction)
- [ML Classifiers](/docs/extensions/built-in/ml-classifiers)
- [Grounding Guard](/docs/extensions/built-in/grounding-guard)
- [Safety Primitives](/docs/features/safety-primitives)
