# Multi-GMI Agency Runtime – Implementation Plan

> Working checklist that complements `docs/ARCHITECTURE.md` and `docs/MULTI_GMI_COLLABORATION.md`. The focus is shipping the “Agency” abstraction: a single assistant façade backed by multiple coordinating GMIs.

---

## 0. Prerequisites & Baseline
1. **Understand the single-GMI flow**
   - `AgentOS.processRequest` (`packages/agentos/src/api/AgentOS.ts`)
   - `AgentOSOrchestrator.orchestrateTurn` (`packages/agentos/src/api/AgentOSOrchestrator.ts`)
   - `GMIManager.getOrCreateGMIForSession` (`packages/agentos/src/cognitive_substrate/GMIManager.ts`)
   - `WorkflowEngine` (data persistence only) (`packages/agentos/src/core/workflows/WorkflowEngine.ts`)
2. **Docs to keep in sync**
   - `docs/ARCHITECTURE.md` (runtime map)
   - `docs/WORKFLOWS.md` (authoring guide)
   - `docs/MULTI_GMI_COLLABORATION.md` (conceptual model)

---

## 1. Runtime Orchestration
### 1.1 `WorkflowRuntime`
- **Location:** `packages/agentos/src/core/workflows/runtime/WorkflowRuntime.ts`
- **Purpose:** Listen to `WorkflowEngine.onEvent`, queue `WorkflowTaskInstance`s, and dispatch them to GMIs/tools/extensions.
- **Key surface (with JSDoc expectations):**
  ```ts
  /**
   * Coordinates task execution for Agency-backed workflows.
   */
  export class WorkflowRuntime {
    constructor(private readonly deps: WorkflowRuntimeDependencies) {}

    /** Starts listening to workflow events. */
    public async start(): Promise<void>;

    /** Stops listening and drains queued work. */
    public async stop(): Promise<void>;
  }
  ```
- **Dependencies required:**
  - `WorkflowEngine`
  - `GMIManager`
  - `StreamingManager`
  - `IToolOrchestrator`
  - `AgencyRegistry` (see 1.2)
  - `ILogger`
- **Implementation notes:**
  - Use `p-queue` (already added) for concurrency control.
  - For now, only log `READY` tasks; execution handlers are implemented in Step 4.

### 1.2 Agency Registry
- **File:** `packages/agentos/src/core/agency/AgencyRegistry.ts`
- **Purpose:** Keep ephemeral mappings between workflow instances and the GMIs (seats) that form an Agency.
- **Shape:**
  ```ts
  export interface AgencySession {
    agencyId: string;
    workflowId: string;
    conversationId: string;
    seats: Record<string, AgencySeatState>;
    metadata?: Record<string, unknown>;
  }
  ```
- Provide APIs to upsert agencies, register seats, and tear down agencies once workflows finish.
- **Usage quota integration** - Agency launches are gated by `backend/src/features/agents/agencyUsage.service.ts`. The helper logs entries to `agency_usage_log` and enforces weekly plan limits before `AgentOS.startWorkflow` executes.

### 1.3 `AgentOS.initialize`
- Instantiate `WorkflowEngine` + `AgencyRegistry` inside `initializeWorkflowRuntime`.
- After `GMIManager`/`StreamingManager`/`ToolOrchestrator` are ready, call `startWorkflowRuntime()` to spawn the runtime.
- On shutdown call `await this.workflowRuntime?.stop();` and clear the registry.

---

## 2. Schema & Type Updates
### 2.1 `AgentOSInput`
- Add optional `agencyRequest` payload so chat turns can spin up or join Agencies.
  ```ts
  export interface AgencyInvocationRequest {
    agencyId?: string;
    workflowId?: string;
    goal?: string;
    participants?: Array<{ roleId: string; personaId?: string }>;
  }
  export interface AgentOSInput {
    // existing fields…
    agencyRequest?: AgencyInvocationRequest;
  }
  ```
- Document how this interoperates with `workflowRequest`.

### 2.2 `AgentOSResponse`
- Extend the response union with an `AGENCY_UPDATE` chunk (or enrich `WORKFLOW_UPDATE`) carrying roster + Agency state.

### 2.3 Workflow Definitions
- `WorkflowRoleDefinition` gains:
  - `personaId` or `personaTraits`
  - `evolutionRules: PersonaEvolutionRule[]`
- `WorkflowTaskDefinition` adds optional `handoff` metadata describing what to pass to successor tasks.

---

## 3. Persona Overlays & Evolution
### 3.1 Overlay Manager (implemented in `PersonaOverlayManager`)
- **File:** `packages/agentos/src/cognitive_substrate/PersonaOverlayManager.ts` (new)
- Responsibilities:
  - Merge `PersonaEvolutionRule` outputs with base personas.
  - Persist overlays in `WorkflowInstance.metadata`.
  - Feed overlays into `GMIManager` when instantiating Agency seats.

### 3.2 Rule Evaluation
- Support declarative triggers (string DSL) and optional LLM-evaluated policies using `LLMUtilityAI`.
- Provide clear JSDoc (inputs, outputs, failure conditions).

---

## 4. Task Execution Hooks
### 4.1 GMI Tasks
- Inside `WorkflowRuntime`, implement `executeGmiTask`:
  - Resolve/instantiate the Agency seat via `AgencyRegistry` + `GMIManager`.
  - Compose internal `AgentOSInput` (including `workflowRequest` + `agencyRequest`).
  - Stream results back (`StreamingManager.pushChunk`).
  - Call `workflowEngine.applyTaskUpdates` with task output.

### 4.2 Tool & Extension Tasks
- For tool executors, call `IToolOrchestrator.execute`.
- For extension-defined tasks, leverage `ExtensionManager` (new extension kind `agency-task` if required).

---

## 5. Streaming & Telemetry
- Update `StreamingManager` to handle new chunk types (`AGENCY_UPDATE`, `WORKFLOW_UPDATE`).
- Surface Agency updates through backend stream route (`backend/src/integrations/agentos/agentos.stream-router.ts`).
- Instrument:
  - Workflow start/completion
  - Task state transitions
  - Persona evolution decisions

---

## 6. Documentation & JSDoc
1. `docs/ARCHITECTURE.md` – add “Agency Runtime” subsection.
2. `docs/WORKFLOWS.md` – describe new fields and authoring guidance.
3. `docs/MULTI_GMI_COLLABORATION.md` – ensure terminology (Agency, seats, overlays) matches implementation.
4. `docs/MULTI_GMI_IMPLEMENTATION_PLAN.md` – keep progress notes up to date.

**JSDoc rules**
- Every new class/method: `@remarks`, `@param`, `@returns`, `@throws`.
- Complex examples go into inline code blocks.

---

## 7. Testing
### Unit (Vitest)
- `WorkflowRuntime.spec.ts` – simulate event stream, ensure queueing logic runs.
- `AgencyRegistry.spec.ts` – add/remove seats, workflow lookups.
- `PersonaOverlayManager.spec.ts` – rule application & serialization.

### Integration
- Create `packages/agentos/tests/integration/agency-runtime.spec.ts` with mocked GMI/tool responses and assert streamed `AGENCY_UPDATE` chunks.

### Backend Smoke
- Extend integration tests to start an Agency workflow via REST and read SSE updates.

---

## 8. Rollout
1. Guard the runtime behind a config flag (e.g., `AgentOSConfig.enableAgencyWorkflows`).
2. Land schema updates + TypeDoc.
3. Enable internally, collect telemetry, iterate on performance.
4. Update UI surfaces to show Agency roster/progress.

---

## 9. Follow-ups
- Bundle sample Agencies (code-review duo, research triad) as extensions.
- Document guardrail expectations for multi-seat decisions.
- Align billing attribution with seat-level usage.

---

## Appendix – JSDoc Snippets
```ts
/**
 * Applies evolution rules to a persona and produces an overlay snapshot.
 * @param personaId - Base persona identifier.
 * @param baseDefinition - Persona definition before overlays.
 * @param context - Signals collected from workflow activity.
 * @returns Overlay state persisted alongside the workflow instance.
 * @throws {PersonaEvolutionError} When conflicting patches cannot be merged.
 */
function applyPersonaEvolution(
  personaId: string,
  baseDefinition: IPersonaDefinition,
  context: PersonaEvolutionContext,
): PersonaStateOverlay { /* ... */ }
```

```ts
/**
 * Emits an Agency update chunk to downstream clients.
 * @remarks Invoked whenever roster or seat state changes.
 */
private async emitAgencyUpdate(session: AgencySession): Promise<void>;
```

Use inline comments sparingly—only for concurrency or guardrail caveats.
