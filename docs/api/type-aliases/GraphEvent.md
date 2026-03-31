# Type Alias: GraphEvent

> **GraphEvent** = \{ `graphId`: `string`; `runId`: `string`; `type`: `"run_start"`; \} \| \{ `nodeId`: `string`; `state`: `Partial`\<[`GraphState`](../interfaces/GraphState.md)\>; `type`: `"node_start"`; \} \| \{ `durationMs`: `number`; `nodeId`: `string`; `output`: `unknown`; `type`: `"node_end"`; \} \| \{ `edgeType`: `string`; `sourceId`: `string`; `targetId`: `string`; `type`: `"edge_transition"`; \} \| \{ `content`: `string`; `nodeId`: `string`; `type`: `"text_delta"`; \} \| \{ `args`: `unknown`; `nodeId`: `string`; `toolName`: `string`; `type`: `"tool_call"`; \} \| \{ `nodeId`: `string`; `result`: `unknown`; `toolName`: `string`; `type`: `"tool_result"`; \} \| \{ `action`: `string`; `guardrailId`: `string`; `nodeId`: `string`; `passed`: `boolean`; `type`: `"guardrail_result"`; \} \| \{ `checkpointId`: `string`; `nodeId`: `string`; `type`: `"checkpoint_saved"`; \} \| \{ `nodeId`: `string`; `reason`: `"human_approval"` \| `"error"` \| `"guardrail_violation"`; `type`: `"interrupt"`; \} \| \{ `nodeId`: `string`; `traceCount`: `number`; `type`: `"memory_read"`; \} \| \{ `nodeId`: `string`; `traceType`: `string`; `type`: `"memory_write"`; \} \| \{ `nodeId`: `string`; `toolsFound`: `string`[]; `type`: `"discovery_result"`; \} \| \{ `finalOutput`: `unknown`; `runId`: `string`; `totalDurationMs`: `number`; `type`: `"run_end"`; \} \| \{ `nodeId`: `string`; `timeoutMs`: `number`; `type`: `"node_timeout"`; \} \| \{ `error`: \{ `code`: `string`; `message`: `string`; \}; `nodeId?`: `string`; `type`: `"error"`; \} \| \{ `confidence`: `number`; `isFinal`: `boolean`; `nodeId`: `string`; `speaker?`: `string`; `text`: `string`; `type`: `"voice_transcript"`; \} \| \{ `direction`: `"inbound"` \| `"outbound"`; `durationMs`: `number`; `format`: `string`; `nodeId`: `string`; `type`: `"voice_audio"`; \} \| \{ `interruptedText`: `string`; `nodeId`: `string`; `type`: `"voice_barge_in"`; `userSpeech`: `string`; \} \| \{ `endpointReason`: `string`; `nodeId`: `string`; `transcript`: `string`; `turnIndex`: `number`; `type`: `"voice_turn_complete"`; \} \| \{ `action`: `"started"` \| `"ended"`; `exitReason?`: `string`; `nodeId`: `string`; `type`: `"voice_session"`; \} \| \{ `goal`: `string`; `type`: `"mission:planning_start"`; \} \| \{ `branchId`: `string`; `scores?`: [`MissionEvalScores`](../interfaces/MissionEvalScores.md); `summary`: `string`; `type`: `"mission:branch_generated"`; \} \| \{ `branchId`: `string`; `reason`: `string`; `type`: `"mission:branch_selected"`; \} \| \{ `changes`: `string`[]; `type`: `"mission:refinement_applied"`; \} \| \{ `edgeCount`: `number`; `estimatedCost`: `number`; `nodeCount`: `number`; `type`: `"mission:graph_compiled"`; \} \| \{ `patch`: [`MissionGraphPatch`](../interfaces/MissionGraphPatch.md); `reason?`: `string`; `trigger`: [`MissionExpansionTrigger`](MissionExpansionTrigger.md); `type`: `"mission:expansion_proposed"`; \} \| \{ `by`: `"auto"` \| `"user"`; `type`: `"mission:expansion_approved"`; \} \| \{ `by`: `"user"`; `reason`: `string`; `type`: `"mission:expansion_rejected"`; \} \| \{ `edgesAdded?`: `number`; `nodesAdded`: `number`; `type`: `"mission:expansion_applied"`; \} \| \{ `checkpointId`: `string`; `nodeId`: `string`; `type`: `"mission:checkpoint_saved"`; \} \| \{ `cap`: `number`; `threshold`: `string`; `type`: `"mission:threshold_reached"`; `value`: `number`; \} \| \{ `costCap`: `number`; `totalSpent`: `number`; `type`: `"mission:cost_update"`; \} \| \{ `agentCount`: `number`; `summary`: `string`; `totalCost`: `number`; `totalDurationMs`: `number`; `type`: `"mission:complete"`; \} \| \{ `agentId`: `string`; `model`: `string`; `provider`: `string`; `role`: `string`; `type`: `"mission:agent_spawned"`; \} \| \{ `mode`: `"compose"` \| `"sandbox"`; `name`: `string`; `toolId`: `string`; `type`: `"mission:tool_forged"`; \} \| \{ `action`: `string`; `details?`: `unknown`; `type`: `"mission:approval_required"`; \}

Defined in: [packages/agentos/src/orchestration/events/GraphEvent.ts:45](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/events/GraphEvent.ts#L45)

All runtime events emitted by the graph executor.

Every variant carries a `type` discriminant so consumers can narrow with a
simple `switch (event.type)` or exhaustive-check library.

## Type Declaration

\{ `graphId`: `string`; `runId`: `string`; `type`: `"run_start"`; \}

### graphId

> **graphId**: `string`

### runId

> **runId**: `string`

### type

> **type**: `"run_start"`

Emitted once when the executor accepts a new run request.

\{ `nodeId`: `string`; `state`: `Partial`\<[`GraphState`](../interfaces/GraphState.md)\>; `type`: `"node_start"`; \}

### nodeId

> **nodeId**: `string`

### state

> **state**: `Partial`\<[`GraphState`](../interfaces/GraphState.md)\>

### type

> **type**: `"node_start"`

Emitted immediately before a node's executor is called.

\{ `durationMs`: `number`; `nodeId`: `string`; `output`: `unknown`; `type`: `"node_end"`; \}

### durationMs

> **durationMs**: `number`

### nodeId

> **nodeId**: `string`

### output

> **output**: `unknown`

### type

> **type**: `"node_end"`

Emitted after a node's executor returns successfully.
`durationMs` is wall-clock time from `node_start` to `node_end`.

\{ `edgeType`: `string`; `sourceId`: `string`; `targetId`: `string`; `type`: `"edge_transition"`; \}

### edgeType

> **edgeType**: `string`

### sourceId

> **sourceId**: `string`

### targetId

> **targetId**: `string`

### type

> **type**: `"edge_transition"`

Emitted when the executor resolves a routing condition and moves to the next node.

\{ `content`: `string`; `nodeId`: `string`; `type`: `"text_delta"`; \}

### content

> **content**: `string`

### nodeId

> **nodeId**: `string`

### type

> **type**: `"text_delta"`

Streaming token delta from an LLM (GMI) node.
Multiple deltas are emitted per node; concatenate `content` to reconstruct the full response.

\{ `args`: `unknown`; `nodeId`: `string`; `toolName`: `string`; `type`: `"tool_call"`; \}

### args

> **args**: `unknown`

### nodeId

> **nodeId**: `string`

### toolName

> **toolName**: `string`

### type

> **type**: `"tool_call"`

Emitted when a node issues a tool call to the tool catalogue.

\{ `nodeId`: `string`; `result`: `unknown`; `toolName`: `string`; `type`: `"tool_result"`; \}

### nodeId

> **nodeId**: `string`

### result

> **result**: `unknown`

### toolName

> **toolName**: `string`

### type

> **type**: `"tool_result"`

Emitted when a tool call returns (whether success or structured error).

\{ `action`: `string`; `guardrailId`: `string`; `nodeId`: `string`; `passed`: `boolean`; `type`: `"guardrail_result"`; \}

### action

> **action**: `string`

### guardrailId

> **guardrailId**: `string`

### nodeId

> **nodeId**: `string`

### passed

> **passed**: `boolean`

### type

> **type**: `"guardrail_result"`

Emitted after each guardrail evaluation.
`passed: false` indicates a violation; `action` mirrors `GuardrailPolicy.onViolation`.

\{ `checkpointId`: `string`; `nodeId`: `string`; `type`: `"checkpoint_saved"`; \}

### checkpointId

> **checkpointId**: `string`

### nodeId

> **nodeId**: `string`

### type

> **type**: `"checkpoint_saved"`

Emitted after the runtime successfully persists a checkpoint snapshot.

\{ `nodeId`: `string`; `reason`: `"human_approval"` \| `"error"` \| `"guardrail_violation"`; `type`: `"interrupt"`; \}

### nodeId

> **nodeId**: `string`

### reason

> **reason**: `"human_approval"` \| `"error"` \| `"guardrail_violation"`

### type

> **type**: `"interrupt"`

Emitted when graph execution is suspended mid-run.
- `human_approval`     — node requires operator sign-off before proceeding.
- `error`              — unrecoverable error after exhausting retry budget.
- `guardrail_violation` — a `block` guardrail fired, halting the run.

\{ `nodeId`: `string`; `traceCount`: `number`; `type`: `"memory_read"`; \}

### nodeId

> **nodeId**: `string`

### traceCount

> **traceCount**: `number`

### type

> **type**: `"memory_read"`

Emitted after memory traces are loaded into `GraphState.memory` for a node.

\{ `nodeId`: `string`; `traceType`: `string`; `type`: `"memory_write"`; \}

### nodeId

> **nodeId**: `string`

### traceType

> **traceType**: `string`

### type

> **type**: `"memory_write"`

Emitted after a memory trace is staged or committed for a node.

\{ `nodeId`: `string`; `toolsFound`: `string`[]; `type`: `"discovery_result"`; \}

### nodeId

> **nodeId**: `string`

### toolsFound

> **toolsFound**: `string`[]

### type

> **type**: `"discovery_result"`

Emitted after `DiscoveryPolicy`-triggered capability discovery completes.

\{ `finalOutput`: `unknown`; `runId`: `string`; `totalDurationMs`: `number`; `type`: `"run_end"`; \}

### finalOutput

> **finalOutput**: `unknown`

### runId

> **runId**: `string`

### totalDurationMs

> **totalDurationMs**: `number`

### type

> **type**: `"run_end"`

Emitted once when the graph run concludes normally.
`totalDurationMs` is wall-clock time from `run_start` to `run_end`.

\{ `nodeId`: `string`; `timeoutMs`: `number`; `type`: `"node_timeout"`; \}

### nodeId

> **nodeId**: `string`

### timeoutMs

> **timeoutMs**: `number`

### type

> **type**: `"node_timeout"`

Emitted when a node's wall-clock execution time exceeds `GraphNode.timeout`.

\{ `error`: \{ `code`: `string`; `message`: `string`; \}; `nodeId?`: `string`; `type`: `"error"`; \}

### error

> **error**: `object`

#### error.code

> **code**: `string`

#### error.message

> **message**: `string`

### nodeId?

> `optional` **nodeId**: `string`

### type

> **type**: `"error"`

Emitted for unhandled exceptions or structured runtime errors.
`nodeId` is absent for graph-level errors that occur outside any node's scope.

\{ `confidence`: `number`; `isFinal`: `boolean`; `nodeId`: `string`; `speaker?`: `string`; `text`: `string`; `type`: `"voice_transcript"`; \}

### confidence

> **confidence**: `number`

### isFinal

> **isFinal**: `boolean`

### nodeId

> **nodeId**: `string`

### speaker?

> `optional` **speaker**: `string`

### text

> **text**: `string`

### type

> **type**: `"voice_transcript"`

Live STT transcription -- both interim (partial) and final (confirmed) results.

Emitted by the internal voice turn collector for every speech recognition result.
Consumers should check `isFinal` to distinguish speculative partials from
confirmed utterances. Only final results are persisted in the transcript buffer.

- `speaker` is absent when the STT provider does not support diarization.
- `confidence` ranges from `0` (no confidence) to `1` (maximum confidence).

See `VoiceTurnCollector` for the internal event source.

\{ `direction`: `"inbound"` \| `"outbound"`; `durationMs`: `number`; `format`: `string`; `nodeId`: `string`; `type`: `"voice_audio"`; \}

### direction

> **direction**: `"inbound"` \| `"outbound"`

### durationMs

> **durationMs**: `number`

### format

> **format**: `string`

### nodeId

> **nodeId**: `string`

### type

> **type**: `"voice_audio"`

Audio chunk metadata emitted when audio data flows through the voice pipeline.

The actual PCM/opus audio bytes flow via `IStreamTransport`, NOT through events.
This event carries only metadata (direction, format, duration) so that the graph
event bus can track audio flow without handling binary payloads.

- `direction: 'inbound'` -- user microphone audio arriving at the STT engine.
- `direction: 'outbound'` -- agent TTS audio being sent to the user.
- `durationMs` is `0` for streaming chunks where total duration is unknown.

See `VoiceTransportAdapter` for the transport-layer emitter.

\{ `interruptedText`: `string`; `nodeId`: `string`; `type`: `"voice_barge_in"`; `userSpeech`: `string`; \}

### interruptedText

> **interruptedText**: `string`

### nodeId

> **nodeId**: `string`

### type

> **type**: `"voice_barge_in"`

### userSpeech

> **userSpeech**: `string`

User barge-in -- the user interrupted the agent while it was speaking.

Emitted by the internal voice turn collector when the session fires a `barge_in` event.
This signals that TTS playback should be cancelled and the graph may need to
reroute to handle the interruption (e.g. re-enter a listening state).

- `interruptedText` -- what the agent was saying when interrupted.
- `userSpeech` -- what the user said that triggered the interruption.

See `VoiceInterruptError` for the structured error variant used in graph-level handling.

\{ `endpointReason`: `string`; `nodeId`: `string`; `transcript`: `string`; `turnIndex`: `number`; `type`: `"voice_turn_complete"`; \}

### endpointReason

> **endpointReason**: `string`

### nodeId

> **nodeId**: `string`

### transcript

> **transcript**: `string`

### turnIndex

> **turnIndex**: `number`

### type

> **type**: `"voice_turn_complete"`

User turn complete -- the endpoint detector determined the user finished speaking.

Emitted by both the internal voice turn collector (from session events) and
the voice transport adapter (from transport events). Carries the full
transcript for the completed turn and the endpoint detection reason.

- `turnIndex` is 1-based and reflects the post-increment count (includes
  checkpoint-restored turns when resuming from a checkpoint).
- `endpointReason` describes why the endpoint was detected (e.g. `'punctuation'`,
  `'silence'`, `'acoustic'`, `'unknown'`).

See `VoiceTurnCollector` for turn counting and event emission.

\{ `action`: `"started"` \| `"ended"`; `exitReason?`: `string`; `nodeId`: `string`; `type`: `"voice_session"`; \}

### action

> **action**: `"started"` \| `"ended"`

### exitReason?

> `optional` **exitReason**: `string`

### nodeId

> **nodeId**: `string`

### type

> **type**: `"voice_session"`

Voice session lifecycle event -- signals when a voice session starts or ends.

Emitted by both the voice node executor (at the graph node level) and
the voice transport adapter (at the transport level). The `nodeId` is the
graph node id for executor-level events, or `'__transport__'` for
transport-level events.

- `action: 'started'` -- the session is now active and accepting audio.
- `action: 'ended'` -- the session has terminated; `exitReason` describes why
  (e.g. `'turns-exhausted'`, `'hangup'`, `'interrupted'`, `'error'`,
  `'transport-disposed'`).

See `VoiceNodeExecutor` for node-level lifecycle emission.
See `VoiceTransportAdapter` for transport-level lifecycle emission.

\{ `goal`: `string`; `type`: `"mission:planning_start"`; \}

### goal

> **goal**: `string`

### type

> **type**: `"mission:planning_start"`

Emitted when the Tree of Thought planner begins decomposing a goal.

\{ `branchId`: `string`; `scores?`: [`MissionEvalScores`](../interfaces/MissionEvalScores.md); `summary`: `string`; `type`: `"mission:branch_generated"`; \}

### branchId

> **branchId**: `string`

### scores?

> `optional` **scores**: [`MissionEvalScores`](../interfaces/MissionEvalScores.md)

### summary

> **summary**: `string`

### type

> **type**: `"mission:branch_generated"`

Emitted for each candidate branch generated during Phase 1 (divergent exploration).

\{ `branchId`: `string`; `reason`: `string`; `type`: `"mission:branch_selected"`; \}

### branchId

> **branchId**: `string`

### reason

> **reason**: `string`

### type

> **type**: `"mission:branch_selected"`

Emitted when the evaluator selects a branch in Phase 2.

\{ `changes`: `string`[]; `type`: `"mission:refinement_applied"`; \}

### changes

> **changes**: `string`[]

### type

> **type**: `"mission:refinement_applied"`

Emitted when Phase 3 (Reflexion) applies refinements to the selected branch.

\{ `edgeCount`: `number`; `estimatedCost`: `number`; `nodeCount`: `number`; `type`: `"mission:graph_compiled"`; \}

### edgeCount

> **edgeCount**: `number`

### estimatedCost

> **estimatedCost**: `number`

### nodeCount

> **nodeCount**: `number`

### type

> **type**: `"mission:graph_compiled"`

Emitted when the planned graph compiles to `CompiledExecutionGraph`.

\{ `patch`: [`MissionGraphPatch`](../interfaces/MissionGraphPatch.md); `reason?`: `string`; `trigger`: [`MissionExpansionTrigger`](MissionExpansionTrigger.md); `type`: `"mission:expansion_proposed"`; \}

### patch

> **patch**: [`MissionGraphPatch`](../interfaces/MissionGraphPatch.md)

### reason?

> `optional` **reason**: `string`

### trigger

> **trigger**: [`MissionExpansionTrigger`](MissionExpansionTrigger.md)

### type

> **type**: `"mission:expansion_proposed"`

Emitted when an expansion is proposed (agent request, supervisor, or planner loop).

\{ `by`: `"auto"` \| `"user"`; `type`: `"mission:expansion_approved"`; \}

### by

> **by**: `"auto"` \| `"user"`

### type

> **type**: `"mission:expansion_approved"`

Emitted when an expansion is approved (auto or user).

\{ `by`: `"user"`; `reason`: `string`; `type`: `"mission:expansion_rejected"`; \}

### by

> **by**: `"user"`

### reason

> **reason**: `string`

### type

> **type**: `"mission:expansion_rejected"`

Emitted when a proposed expansion is explicitly rejected.

\{ `edgesAdded?`: `number`; `nodesAdded`: `number`; `type`: `"mission:expansion_applied"`; \}

### edgesAdded?

> `optional` **edgesAdded**: `number`

### nodesAdded

> **nodesAdded**: `number`

### type

> **type**: `"mission:expansion_applied"`

Emitted after an expansion GraphPatch is applied.

\{ `checkpointId`: `string`; `nodeId`: `string`; `type`: `"mission:checkpoint_saved"`; \}

### checkpointId

> **checkpointId**: `string`

### nodeId

> **nodeId**: `string`

### type

> **type**: `"mission:checkpoint_saved"`

Emitted when a mission checkpoint is saved for later replay/resume.

\{ `cap`: `number`; `threshold`: `string`; `type`: `"mission:threshold_reached"`; `value`: `number`; \}

### cap

> **cap**: `number`

### threshold

> **threshold**: `string`

### type

> **type**: `"mission:threshold_reached"`

### value

> **value**: `number`

Emitted when a guardrail threshold is hit (agent count, cost, etc).

\{ `costCap`: `number`; `totalSpent`: `number`; `type`: `"mission:cost_update"`; \}

### costCap

> **costCap**: `number`

### totalSpent

> **totalSpent**: `number`

### type

> **type**: `"mission:cost_update"`

Periodic cost update for live dashboards and CLI.

\{ `agentCount`: `number`; `summary`: `string`; `totalCost`: `number`; `totalDurationMs`: `number`; `type`: `"mission:complete"`; \}

### agentCount

> **agentCount**: `number`

### summary

> **summary**: `string`

### totalCost

> **totalCost**: `number`

### totalDurationMs

> **totalDurationMs**: `number`

### type

> **type**: `"mission:complete"`

Emitted once when the mission finishes.

\{ `agentId`: `string`; `model`: `string`; `provider`: `string`; `role`: `string`; `type`: `"mission:agent_spawned"`; \}

### agentId

> **agentId**: `string`

### model

> **model**: `string`

### provider

> **provider**: `string`

### role

> **role**: `string`

### type

> **type**: `"mission:agent_spawned"`

Emitted when a new agent is spawned during execution.

\{ `mode`: `"compose"` \| `"sandbox"`; `name`: `string`; `toolId`: `string`; `type`: `"mission:tool_forged"`; \}

### mode

> **mode**: `"compose"` \| `"sandbox"`

### name

> **name**: `string`

### toolId

> **toolId**: `string`

### type

> **type**: `"mission:tool_forged"`

Emitted when the EmergentCapabilityEngine forges a new tool.

\{ `action`: `string`; `details?`: `unknown`; `type`: `"mission:approval_required"`; \}

### action

> **action**: `string`

### details?

> `optional` **details**: `unknown`

### type

> **type**: `"mission:approval_required"`

Emitted when user approval is required before continuing.
