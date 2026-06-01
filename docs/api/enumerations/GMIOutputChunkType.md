# Enumeration: GMIOutputChunkType

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:254](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L254)

Defines the type of content in a `GMIOutputChunk`.

## Enumeration Members

### ERROR

> **ERROR**: `"error"`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:259](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L259)

***

### FINAL\_RESPONSE\_MARKER

> **FINAL\_RESPONSE\_MARKER**: `"final_response_marker"`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:258](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L258)

***

### LATENCY\_REPORT

> **LATENCY\_REPORT**: `"latency_report"`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:262](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L262)

***

### RAG\_SOURCES\_AVAILABLE

> **RAG\_SOURCES\_AVAILABLE**: `"rag_sources_available"`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:270](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L270)

Emitted after a successful RAG retrieval during a turn so downstream
consumers (guardrails, grounding verification, UI source panels) can
see the retrieved chunks before the LLM call produces text deltas.
The chunk content is `{ ragSources: RagRetrievedChunk[] }`.

***

### REASONING\_STATE\_UPDATE

> **REASONING\_STATE\_UPDATE**: `"reasoning_state_update"`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:257](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L257)

***

### SYSTEM\_MESSAGE

> **SYSTEM\_MESSAGE**: `"system_message"`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:260](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L260)

***

### TEXT\_DELTA

> **TEXT\_DELTA**: `"text_delta"`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:255](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L255)

***

### TOOL\_CALL\_REQUEST

> **TOOL\_CALL\_REQUEST**: `"tool_call_request"`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:256](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L256)

***

### UI\_COMMAND

> **UI\_COMMAND**: `"ui_command"`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:263](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L263)

***

### USAGE\_UPDATE

> **USAGE\_UPDATE**: `"usage_update"`

Defined in: [packages/agentos/src/cognition/substrate/IGMI.ts:261](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/substrate/IGMI.ts#L261)
