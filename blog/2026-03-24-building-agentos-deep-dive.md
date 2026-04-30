---
title: 'Building AgentOS: A Deep Dive Into the Architecture'
description: 'How we built a production-grade AI agent runtime from scratch, cognitive memory, graph orchestration, emergent tool forging, 7 vector backends, voice pipelines, and 37-channel integrations.'
authors: [jddunn]
audience: engineer
date: 2026-03-24
tags:
  [
    architecture,
    deep-dive,
    agentos,
    typescript,
    orchestration,
    memory,
    guardrails,
    voice,
    rag,
    emergent-capabilities,
  ]
reading_time_override: 160
---

> "Architecture is the thoughtful making of space."
>
> — Louis Kahn, attributed (1969)

This is the long version of how AgentOS was built. Eight layers, fourteen LLM providers, seven vector backends, thirty-seven channel integrations. The short version is in [the announcement post](https://agentos.sh/blog/announcing-agentos). This is the version where we walk every layer, name every decision we made wrong before we made it right, and link the code that implements each piece. If you're evaluating whether to base a system on AgentOS, this is the post that should answer your hard questions.

Eight layers. Fourteen LLM providers. Seven vector backends. Thirty-seven channel integrations. One TypeScript library with zero HTTP opinions.

This is how we built AgentOS, and what we learned the hard way.

<!-- truncate -->

---

## Table of Contents

1. [Why We Built AgentOS](#why-we-built-agentos)
2. [GMI: How an Agent Thinks](#gmi-how-an-agent-thinks)
3. [Orchestration: Wiring the Machine](#orchestration-wiring-the-machine)
4. [Memory That Thinks Like a Brain](#memory-that-thinks-like-a-brain)
5. [Document Ingestion Pipeline](#document-ingestion-pipeline)
6. [Three Layers of Defense](#three-layers-of-defense)
7. [Tools, Discovery, and Self-Forging](#tools-discovery-and-self-forging)
8. [Routing Queries Without Wasting Tokens](#routing-queries-without-wasting-tokens)
9. [Voice: From Audio Frames to Conversation](#voice-from-audio-frames-to-conversation)
10. [Streaming and Real-Time Architecture](#streaming-and-real-time-architecture)
11. [HEXACO: Personality as Architecture](#hexaco-personality-as-architecture)
12. [37 Channels, One Gateway](#37-channels-one-gateway)
13. [Graph Orchestration and Multi-Agent Coordination](#graph-orchestration-and-multi-agent-coordination)
14. [Seeing, Hearing, Creating: Multimodal Generation](#seeing-hearing-creating-multimodal-generation)
15. [Provider-First: 16 LLMs, Zero Lock-In](#provider-first-16-llms-zero-lock-in)
16. [Patterns Worth Stealing](#patterns-worth-stealing)
17. [What Worked, What Didn't, What's Next](#what-worked-what-didnt-whats-next)

---

<a name="why-we-built-agentos"></a>

## Why We Built AgentOS

Most agent frameworks assume you'll run one model behind one API on one server. We needed something different.

After months of prototyping with existing tools, three gaps kept showing up:

1. **Safety was an afterthought.** Prompt injection, tool abuse, PII leakage, bolted on after the fact, if addressed at all.
2. **Monolithic runtimes couldn't adapt.** Adding a custom tool meant forking the framework. Swapping a vector store meant rewriting the retrieval layer.
3. **LLM costs spiraled unchecked.** Every query hit the most expensive model. Every turn stuffed the full tool catalog into the prompt. Nobody measured what they were spending per conversation.

AgentOS came out of those frustrations. A multi-layered platform that treats safety as architecture, extensibility as a first-class primitive, and cost consciousness as a design constraint, not a dashboard metric.

### Four Tenets

These rules govern every design decision in the codebase ([AgentOS.ts:14-34](https://github.com/framersai/agentos/blob/master/src/api/AgentOS.ts#L14-L34)):

**Interface-driven design.** Every major component implements a contract: `IAgentOS`, `IGMI`, `IToolOrchestrator`, `IGuardrailService`. Swap implementations without breaking consumers. Mock anything for testing.

**Streaming-first operations.** All interaction methods are async generators. Users see tokens the moment they're produced, no waiting for complete responses:

```typescript
public async *processRequest(input: AgentOSInput):
  AsyncGenerator<AgentOSResponse, void, undefined> {
  for await (const chunk of gmiResponseStream) {
    yield chunk;
  }
}
```

**Robust initialization.** Explicit 14-step startup sequence with frozen configuration. Fail fast on missing parameters. No runtime mutation bugs.

**Structured error hierarchy.** Custom errors carry enough context for debugging without exposing internals to end users:

```typescript
export class AgentOSServiceError extends GMIError {
  public override readonly name: string = 'AgentOSServiceError';

  public static wrap(error: any, code: GMIErrorCode, message: string): AgentOSServiceError {
    return new AgentOSServiceError(`${message}: ${error.message}`, code, error);
  }
}
```

### Eight Layers

The architecture stacks like this:

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: User Interface                                     │
│ Web, Mobile, CLI, API, WebSocket, gRPC                      │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: Request Processing                                 │
│ Auth, Rate limiting, Validation, Routing, Queuing           │
├─────────────────────────────────────────────────────────────┤
│ Layer 3: GMI Core (Cognitive Substrate)                     │
│ Instance management, Working memory, Context, Adaptation    │
├─────────────────────────────────────────────────────────────┤
│ Layer 4: Cognitive Processing                               │
│ Prompt engine, Persona system, NLP, Reasoning, Inference    │
├─────────────────────────────────────────────────────────────┤
│ Layer 5: Intelligence Services                              │
│ LLM providers, Tool registry, RAG, Embeddings, Search      │
├─────────────────────────────────────────────────────────────┤
│ Layer 6: Memory & Storage                                   │
│ PostgreSQL, Redis, Vector stores, File storage, Graph DB    │
├─────────────────────────────────────────────────────────────┤
│ Layer 7: Safety & Governance                                │
│ Guardrails, Constitutional AI, Audit logs, Policy engine    │
├─────────────────────────────────────────────────────────────┤
│ Layer 8: Infrastructure                                     │
│ Docker, Kubernetes, Monitoring, Logging, Distributed tracing│
└─────────────────────────────────────────────────────────────┘
```

Dependencies flow downward only. Upper layers never reach past their immediate neighbor. And a critical boundary: `@framers/agentos` is a pure library, no HTTP server, no routes. Any HTTP surfaces live in host apps or reusable extension packages like `@framers/agentos-ext-http-api`.

---

<a name="gmi-how-an-agent-thinks"></a>

## GMI: How an Agent Thinks

The Generalized Mind Instance is the thinking engine. Prompt construction, LLM interaction, tool orchestration, memory management, all converge here into a coherent cognitive process.

### State Machine at the Core

GMI is a state machine ([GMI.ts:66-116](https://github.com/framersai/agentos/blob/master/src/cognitive_substrate/GMI.ts#L66-L116)):

```typescript
export class GMI implements IGMI {
  public readonly gmiId: string;
  public readonly creationTimestamp: Date;

  private activePersona!: IPersonaDefinition;
  private config!: GMIBaseConfig;

  // State machine
  private state: GMIPrimeState;
  private isInitialized: boolean = false;

  // Adaptive properties
  private currentGmiMood: GMIMood;
  private currentUserContext!: UserContext;
  private currentTaskContext!: TaskContext;

  // Transparency
  private reasoningTrace: ReasoningTrace;
  private conversationHistory: ChatMessage[];

  // Core dependencies (injected)
  private workingMemory!: IWorkingMemory;
  private promptEngine!: IPromptEngine;
  private retrievalAugmentor?: IRetrievalAugmentor;
  private toolOrchestrator!: IToolOrchestrator;
  private llmProviderManager!: AIModelProviderManager;
  private utilityAI!: IUtilityAI;
}
```

Transitions follow a strict path:

```
IDLE → INITIALIZING → READY ←→ PROCESSING ←→ AWAITING_TOOL_RESULT
                        ↓           ↓
                   REFLECTING   ERRORED
                        ↓           ↓
                   SHUTTING_DOWN → SHUTDOWN
```

READY means the GMI can accept work. PROCESSING blocks new turns. AWAITING_TOOL_RESULT prevents concurrent tool execution. REFLECTING prevents modifications during introspection. ERRORED halts everything until reset.

No ambiguity. No race conditions on lifecycle.

### Turn Processing: The Inner Loop

The `processTurnStream` method ([GMI.ts:492-751](https://github.com/framersai/agentos/blob/master/src/cognitive_substrate/GMI.ts#L492-L751)) is where input becomes output. It runs as an async generator, streaming chunks to the caller in real time while aggregating a final summary:

```typescript
public async *processTurnStream(turnInput: GMITurnInput):
  AsyncGenerator<GMIOutputChunk, GMIOutput, undefined> {

  this.ensureReady();
  this.state = GMIPrimeState.PROCESSING;

  const turnId = turnInput.interactionId || `turn-${uuidv4()}`;
  let aggregatedResponseText = "";
  const aggregatedToolCalls: ToolCallRequest[] = [];
  const aggregatedUsage: CostAggregator = {
    totalTokens: 0, promptTokens: 0, completionTokens: 0
  };

  try {
    if (turnInput.userContextOverride) {
      this.currentUserContext = {
        ...this.currentUserContext,
        ...turnInput.userContextOverride
      };
      await this.workingMemory.set('currentUserContext', this.currentUserContext);
    }

    this.updateConversationHistory(turnInput);

    // SAFETY LOOP: Max 5 iterations to prevent infinite tool calling
    let safetyBreak = 0;
    main_processing_loop: while (safetyBreak < 5) {
      safetyBreak++;

      // Step 1: RAG Retrieval (conditional, only when heuristics say it's worth the cost)
      let augmentedContextFromRAG = "";
      const lastMessage = this.conversationHistory[this.conversationHistory.length - 1];
      const isUserInitiatedTurn = lastMessage?.role === 'user';

      if (this.retrievalAugmentor &&
          this.activePersona.memoryConfig?.ragConfig?.enabled &&
          isUserInitiatedTurn &&
          lastMessage?.content) {

        const currentQuery = typeof lastMessage.content === 'string'
          ? lastMessage.content
          : JSON.stringify(lastMessage.content);

        if (this.shouldTriggerRAGRetrieval(currentQuery)) {
          const ragResult = await this.retrievalAugmentor.retrieveContext(
            currentQuery,
            {
              topK: this.activePersona.memoryConfig.ragConfig.defaultRetrievalTopK || 5,
              targetDataSourceIds: this.activePersona.memoryConfig.ragConfig.dataSources
                ?.filter(ds => ds.isEnabled)
                .map(ds => ds.dataSourceNameOrId),
            }
          );
          augmentedContextFromRAG = ragResult.augmentedContext;
        }
      }

      // Step 2: Construct prompt
      const promptComponents: PromptComponents = {
        systemPrompts: this.activePersona.baseSystemPrompt,
        conversationHistory: this.buildConversationHistoryForPrompt(),
        userInput: isUserInitiatedTurn ? lastMessage.content : null,
        retrievedContext: augmentedContextFromRAG,
      };

      const modelIdToUse = turnInput.metadata?.options?.preferredModelId ||
                          this.activePersona.defaultModelId ||
                          this.config.defaultLlmModelId;

      const promptEngineResult = await this.promptEngine.constructPrompt(
        promptComponents,
        { modelId: modelIdToUse },
        this.buildPromptExecutionContext()
      );

      // Step 3: Get available tools
      const toolsForLLM = await this.toolOrchestrator.listAvailableTools({
        personaId: this.activePersona.id,
        personaCapabilities: this.activePersona.allowedCapabilities || [],
        userContext: this.currentUserContext,
      });

      // Step 4: Stream LLM response
      const provider = this.llmProviderManager.getProvider(providerId);
      let currentIterationTextResponse = "";
      let currentIterationToolCallRequests: ToolCallRequest[] = [];

      for await (const chunk of provider.generateCompletionStream(
        modelIdToUse,
        promptEngineResult.prompt,
        {
          temperature: turnInput.metadata?.options?.temperature ?? 0.7,
          maxTokens: turnInput.metadata?.options?.maxTokens ?? 2048,
          tools: toolsForLLM.length > 0 ? toolsForLLM.map(t => ({
            type: "function",
            function: { name: t.name, description: t.description, parameters: t.inputSchema }
          })) : undefined,
          toolChoice: toolsForLLM.length > 0 ? "auto" : undefined,
          stream: true,
        }
      )) {
        if (chunk.responseTextDelta) {
          currentIterationTextResponse += chunk.responseTextDelta;
          aggregatedResponseText += chunk.responseTextDelta;

          yield this.createOutputChunk(
            turnInput.interactionId,
            GMIOutputChunkType.TEXT_DELTA,
            chunk.responseTextDelta,
            { usage: chunk.usage }
          );
        }

        if (chunk.choices?.[0]?.message?.tool_calls) {
          currentIterationToolCallRequests = chunk.choices[0].message.tool_calls.map(tc => ({
            id: tc.id || `toolcall-${uuidv4()}`,
            name: tc.function.name,
            arguments: typeof tc.function.arguments === 'string'
              ? JSON.parse(tc.function.arguments)
              : tc.function.arguments,
          }));
          aggregatedToolCalls.push(...currentIterationToolCallRequests);

          yield this.createOutputChunk(
            turnInput.interactionId,
            GMIOutputChunkType.TOOL_CALL_REQUEST,
            currentIterationToolCallRequests
          );
        }

        if (chunk.isFinal && chunk.usage) {
          aggregatedUsage.promptTokens += chunk.usage.promptTokens || 0;
          aggregatedUsage.completionTokens += chunk.usage.completionTokens || 0;
          aggregatedUsage.totalTokens =
            aggregatedUsage.promptTokens + aggregatedUsage.completionTokens;
        }
      }

      // Step 5: Add assistant message to history
      this.conversationHistory.push({
        role: 'assistant',
        content: currentIterationTextResponse || null,
        tool_calls: currentIterationToolCallRequests.length > 0
          ? currentIterationToolCallRequests.map(tc => ({
              id: tc.id, type: 'function',
              function: { name: tc.name, arguments: JSON.stringify(tc.arguments) }
            }))
          : undefined,
      });

      // Step 6: Execute tools and loop back if needed
      if (currentIterationToolCallRequests.length > 0) {
        this.state = GMIPrimeState.AWAITING_TOOL_RESULT;

        for (const toolCallReq of currentIterationToolCallRequests) {
          const result = await this.toolOrchestrator.processToolCall({
            toolCallRequest: toolCallReq,
            gmiId: this.gmiId,
            personaId: this.activePersona.id,
            personaCapabilities: this.activePersona.allowedCapabilities || [],
            userContext: this.currentUserContext,
            correlationId: turnId,
          });
          this.updateConversationHistoryWithToolResult(result);
        }

        this.state = GMIPrimeState.PROCESSING;
        continue main_processing_loop;
      }

      break main_processing_loop;
    }

    // Step 7: Post-turn RAG ingestion
    await this.performPostTurnIngestion(
      typeof turnInput.content === 'string' ? turnInput.content : JSON.stringify(turnInput.content),
      aggregatedResponseText
    );

    // Step 8: Self-reflection trigger
    this.turnsSinceLastReflection++;
    if (this.turnsSinceLastReflection >= this.selfReflectionIntervalTurns) {
      this._triggerAndProcessSelfReflection().catch(err => {
        console.error(`Self-reflection error:`, err);
      });
      this.turnsSinceLastReflection = 0;
    }

    return {
      isFinal: true,
      responseText: aggregatedResponseText || null,
      toolCalls: aggregatedToolCalls.length > 0 ? aggregatedToolCalls : undefined,
      usage: aggregatedUsage,
    };

  } catch (error: any) {
    this.state = GMIPrimeState.ERRORED;
    yield this.createOutputChunk(
      turnInput.interactionId,
      GMIOutputChunkType.ERROR,
      createGMIErrorFromError(error, GMIErrorCode.GMI_PROCESSING_ERROR).message
    );
    return { isFinal: true, responseText: null, error: { code: error.code, message: error.message }, usage: aggregatedUsage };
  } finally {
    if (this.state !== GMIPrimeState.ERRORED && this.state !== GMIPrimeState.AWAITING_TOOL_RESULT) {
      this.state = GMIPrimeState.READY;
    }
  }
}
```

Five design decisions packed into one method:

1. **AsyncGenerator pattern**, yields chunks for real-time UX while returning a final aggregate. Callers get both streaming and a summary.
2. **Safety loop (max 5)**, prevents infinite tool-calling. Blunt, but it works. We'd like smarter loop detection (same tool, same args → break), but the hard cap hasn't caused problems in production.
3. **Conditional RAG**, not every message needs retrieval. Greetings skip it. Heuristics gate the cost.
4. **Automatic tool execution**, GMI runs tools and loops back to the LLM with results. No manual handshake required.
5. **Fire-and-forget self-reflection**, every N turns, the GMI runs a meta-prompt to adjust mood, user-skill assessment, and task complexity. Errors don't crash the conversation.

### Self-Reflection: Meta-Cognitive Adaptation

Every N turns, GMI reflects on its own performance ([GMI.ts:910-1043](https://github.com/framersai/agentos/blob/master/src/cognitive_substrate/GMI.ts#L910-L1043)). A meta-prompt gathers evidence, recent conversation, trace entries, current mood, and asks a separate LLM call to adjust:

```typescript
public async _triggerAndProcessSelfReflection(): Promise<void> {
  const reflectionMetaPromptDef = this.activePersona.metaPrompts?.find(
    mp => mp.id === 'gmi_self_trait_adjustment'
  );

  if (!reflectionMetaPromptDef?.promptTemplate) return;

  const previousState = this.state;
  this.state = GMIPrimeState.REFLECTING;

  try {
    const evidence = {
      recentConversation: this.conversationHistory.slice(-10),
      recentTraceEntries: this.reasoningTrace.entries.slice(-20),
      currentMood: this.currentGmiMood,
      currentUserContext: this.currentUserContext,
      currentTaskContext: this.currentTaskContext,
    };

    let metaPromptText = reflectionMetaPromptDef.promptTemplate
      .replace(/\{\{\s*evidence\s*\}\}/gi, JSON.stringify(evidence).substring(0, 4000))
      .replace(/\{\{\s*current_mood\s*\}\}/gi, this.currentGmiMood)
      .replace(/\{\{\s*user_skill\s*\}\}/gi, this.currentUserContext.skillLevel || "unknown")
      .replace(/\{\{\s*task_complexity\s*\}\}/gi, this.currentTaskContext.complexity || "unknown");

    const provider = this.llmProviderManager.getProvider(providerId);
    const llmResponse = await provider.generateCompletion(
      modelId,
      [{ role: 'user', content: metaPromptText }],
      { maxTokens: 512, temperature: 0.3, responseFormat: { type: "json_object" } }
    );

    type ExpectedReflectionOutput = {
      updatedGmiMood?: GMIMood;
      updatedUserSkillLevel?: string;
      updatedTaskComplexity?: string;
      adjustmentRationale?: string;
      newMemoryImprints?: Array<{key: string; value: any; description?: string}>;
    };

    const parsedUpdates = await this.utilityAI.parseJsonSafe<ExpectedReflectionOutput>(
      llmResponse.choices?.[0]?.message?.content,
      { attemptFixWithLLM: true, llmModelIdForFix: modelId, llmProviderIdForFix: providerId }
    );

    if (parsedUpdates?.updatedGmiMood &&
        Object.values(GMIMood).includes(parsedUpdates.updatedGmiMood) &&
        this.currentGmiMood !== parsedUpdates.updatedGmiMood) {
      this.currentGmiMood = parsedUpdates.updatedGmiMood;
      await this.workingMemory.set('currentGmiMood', this.currentGmiMood);
    }

    // ... apply user skill level, task complexity, memory imprints
  } catch (error: any) {
    this.addTraceEntry(ReasoningEntryType.ERROR, `Self-reflection failed: ${error.message}`);
  } finally {
    const disallowedStates = new Set([GMIPrimeState.IDLE, GMIPrimeState.INITIALIZING]);
    this.state = disallowedStates.has(previousState) ? GMIPrimeState.READY : previousState;
  }
}
```

No retraining. No fine-tuning. Adaptation happens at runtime through prompt engineering. The GMI learns user preferences and adjusts communication style, and if the reflection call fails, the conversation continues uninterrupted.

The two-stage JSON recovery (`parseJsonSafe` with `attemptFixWithLLM: true`) deserves a note: LLMs produce malformed JSON more often than you'd expect. Trailing commas, missing quotes, truncated output. We use a second LLM call with explicit fixing instructions to recover. It works 95%+ of the time.

---

<a name="orchestration-wiring-the-machine"></a>

## Orchestration: Wiring the Machine

`AgentOS` is the facade ([AgentOS.ts:324-357](https://github.com/framersai/agentos/blob/master/src/api/AgentOS.ts#L324-L357)). One class, one import, fourteen internal managers:

```typescript
export class AgentOS implements IAgentOS {
  private modelProviderManager!: AIModelProviderManager;
  private utilityAIService!: IUtilityAI & IPromptEngineUtilityAI;
  private promptEngine!: PromptEngine;
  private toolPermissionManager!: IToolPermissionManager;
  private toolExecutor!: ToolExecutor;
  private toolOrchestrator!: IToolOrchestrator;
  private extensionManager!: ExtensionManager;
  private conversationManager!: ConversationManager;
  private streamingManager!: StreamingManager;
  private gmiManager!: GMIManager;
  private agentOSOrchestrator!: AgentOSOrchestrator;
  private workflowEngine!: WorkflowEngine;
  private guardrailService?: IGuardrailService;
  private authService!: IAuthService;
  private subscriptionService!: ISubscriptionService;
  private prisma!: PrismaClient;
}
```

External consumers import `AgentOS` and nothing else. Internal complexity stays hidden. Testing gets easy, mock any interface.

### Initialization Order

Startup is a 14-step sequence where order is load-bearing ([AgentOS.ts:372-518](https://github.com/framersai/agentos/blob/master/src/api/AgentOS.ts#L372-L518)):

```typescript
public async initialize(config: AgentOSConfig): Promise<void> {
  this.validateConfiguration(config);
  this.config = Object.freeze({ ...config });

  // Step 1: Language service (affects prompt construction everywhere)
  if (config.languageConfig) {
    const { LanguageService } = await import('../core/language');
    this.languageService = new LanguageService(config.languageConfig);
    await this.languageService.initialize();
  }

  // Step 2: Core services
  this.authService = config.authService;
  this.subscriptionService = config.subscriptionService;
  this.prisma = config.prisma;
  this.guardrailService = config.guardrailService;

  // Step 3: Extension manager (loads plugins before components need them)
  this.extensionManager = new ExtensionManager({
    manifest: config.extensionManifest,
    secrets: config.extensionSecrets,
  });
  await this.extensionManager.loadManifest(extensionLifecycleContext);

  // Step 4: Workflow runtime
  await this.initializeWorkflowRuntime(extensionLifecycleContext);

  // Step 5: Model provider manager
  this.modelProviderManager = new AIModelProviderManager();
  await this.modelProviderManager.initialize(config.modelProviderManagerConfig);

  // Step 6: Utility AI (depends on model provider)
  await this.ensureUtilityAIService();

  // Step 7: Prompt engine (depends on utility AI)
  this.promptEngine = new PromptEngine();
  await this.promptEngine.initialize(config.promptEngineConfig, this.utilityAIService);

  // Step 8: Tool permission manager
  this.toolPermissionManager = new ToolPermissionManager();
  await this.toolPermissionManager.initialize(
    config.toolPermissionManagerConfig, this.authService, this.subscriptionService
  );

  // Step 9: Tool orchestrator (depends on permission manager)
  const toolRegistry = this.extensionManager.getRegistry<ITool>(EXTENSION_KIND_TOOL);
  this.toolExecutor = new ToolExecutor(this.authService, this.subscriptionService, toolRegistry);
  this.toolOrchestrator = new ToolOrchestrator();
  await this.toolOrchestrator.initialize(
    config.toolOrchestratorConfig, this.toolPermissionManager, this.toolExecutor
  );

  // Step 10: Conversation manager
  this.conversationManager = new ConversationManager();
  await this.conversationManager.initialize(
    config.conversationManagerConfig, this.utilityAIService, config.storageAdapter
  );

  // Step 11: Streaming manager
  this.streamingManager = new StreamingManager();
  await this.streamingManager.initialize(config.streamingManagerConfig);

  // Step 12: GMI manager (depends on almost everything)
  this.gmiManager = new GMIManager(
    config.gmiManagerConfig, this.subscriptionService, this.authService,
    this.conversationManager, this.promptEngine, this.modelProviderManager,
    this.utilityAIService, this.toolOrchestrator, undefined, config.personaLoader
  );
  await this.gmiManager.initialize();

  // Step 13: Start workflow runtime
  await this.startWorkflowRuntime();

  // Step 14: AgentOS orchestrator (top-level coordinator)
  this.agentOSOrchestrator = new AgentOSOrchestrator();
  await this.agentOSOrchestrator.initialize(config.orchestratorConfig, {
    gmiManager: this.gmiManager,
    toolOrchestrator: this.toolOrchestrator,
    conversationManager: this.conversationManager,
    streamingManager: this.streamingManager,
  });

  this.initialized = true;
}
```

Language service first because it affects prompt construction everywhere. Extensions early because components might need plugins during their own initialization. Model providers before anything that makes LLM calls. Tool system before GMI, because GMI needs tools for turn processing. Streaming last because it's only needed once everything else is ready.

Break this order and you get silent null references at runtime. Ask us how we know.

### Push-Pull Streaming Bridge

AgentOS uses a hybrid push/pull model. The `StreamingManager` pushes chunks to registered clients (multi-client broadcast for WebSockets, SSE, etc.). But `AgentOS.processRequest` must return an AsyncGenerator for HTTP streaming. The `AsyncStreamClientBridge` adapts between these two worlds:

```typescript
class AsyncStreamClientBridge implements IStreamClient {
  private readonly chunkQueue: AgentOSResponse[] = [];
  private resolveNextChunkPromise: ((value: IteratorResult<AgentOSResponse>) => void) | null = null;
  private streamClosed: boolean = false;

  // Push side (called by StreamingManager)
  public async sendChunk(chunk: AgentOSResponse): Promise<void> {
    if (this.streamClosed) return;
    this.chunkQueue.push(chunk);

    if (this.resolveNextChunkPromise) {
      const resolve = this.resolveNextChunkPromise;
      this.resolveNextChunkPromise = null;
      resolve({ value: this.chunkQueue.shift()!, done: false });
    }
  }

  // Pull side (consumed by AgentOS.processRequest)
  public async *consume(): AsyncGenerator<AgentOSResponse, void, undefined> {
    while (true) {
      if (this.chunkQueue.length > 0) {
        yield this.chunkQueue.shift()!;
        continue;
      }
      if (this.streamClosed) break;

      const result = await new Promise<IteratorResult<AgentOSResponse, void>>((resolve) => {
        this.resolveNextChunkPromise = resolve;

        if (this.chunkQueue.length > 0) {
          this.resolveNextChunkPromise = null;
          resolve({ value: this.chunkQueue.shift()!, done: false });
        } else if (this.streamClosed) {
          this.resolveNextChunkPromise = null;
          resolve({ value: undefined, done: true });
        }
      });

      if (result.done) break;
      if (result.value) yield result.value;
    }
  }
}
```

Same streaming infrastructure supports HTTP, WebSockets, and SSE. One implementation, three protocols.

---

<a name="memory-that-thinks"></a>

## Memory That Thinks Like a Brain

Vector stores are table stakes. Production agents need memory that fades over time, strengthens with use, compresses repeated observations, and maintains personality-consistent attention biases.

We built all of that.

### Seven Vector Backends

Every backend implements `IVectorStore`:

```typescript
export interface IVectorStore {
  initialize(config: VectorStoreConfig): Promise<void>;
  addDocuments(docs: VectorDocument[]): Promise<string[]>;
  search(query: number[], options: SearchOptions): Promise<SearchResult[]>;
  delete(ids: string[]): Promise<void>;
  count(): Promise<number>;
}
```

| Backend                       | Best For                   | Latency (1K docs) | Dependency     |
| ----------------------------- | -------------------------- | ----------------- | -------------- |
| **InMemory**                  | Tests, ephemeral           | <1ms              | None           |
| **SQLite** (SqlVectorStore)   | Local-first, <10K docs     | 5-20ms            | better-sqlite3 |
| **HNSW** (HnswlibVectorStore) | Local-first, 10K-500K docs | 1-5ms             | hnswlib-node   |
| **PostgreSQL** (pgvector)     | Multi-user SaaS            | 10-30ms           | pg + pgvector  |
| **Qdrant**                    | High-scale production      | 5-15ms            | Qdrant server  |
| **Pinecone**                  | Managed cloud              | 20-50ms           | Pinecone SDK   |
| **Neo4j**                     | Graph + vector hybrid      | 15-40ms           | neo4j-driver   |

### Auto-Scaling: Don't Choose a Backend at Project Start

Picking a vector store on day one is premature optimization. SQLite is fine for prototypes but chokes on 100K vectors. Qdrant is overkill for a weekend project. So we built progressive auto-scaling:

```
Tier 0: InMemory (dev/test)
  ↓  count > 500
Tier 1: SQLite brute-force cosine (single-user local)
  ↓  count > 1,000
Tier 2: HNSW sidecar (O(log n) ANN alongside SQLite)
  ↓  count > 100,000 or multi-user
Tier 3: Qdrant / PostgreSQL+pgvector (distributed, replicated)
```

The HNSW sidecar auto-activates when trace count in `brain.sqlite` exceeds 1,000:

```typescript
export class HnswSidecar {
  async shouldActivate(traceCount: number): Promise<boolean> {
    return traceCount >= this.config.autoThreshold;
  }

  async buildFromSqlite(brain: SqliteBrain): Promise<void> {
    const traces = brain.getAllEmbeddings();
    for (const { id, embedding } of traces) {
      this.index.addPoint(embedding, this.labelFor(id));
    }
    this.persist();
  }

  async knnQuery(vector: Float32Array, k: number): Promise<HnswQueryResult[]> {
    const { neighbors, distances } = this.index.searchKnn(vector, k);
    return neighbors.map((label, i) => ({
      id: this.idForLabel(label),
      distance: distances[i],
    }));
  }
}
```

SQLite stays the source of truth. The HNSW index file (`brain.hnsw`) is rebuildable at any time. No data loss if it corrupts. No migration needed when upgrading. Zero configuration for the first 100K vectors.

### Binary Blob Embeddings

We store raw `Float32Array` buffers as SQLite BLOBs instead of JSON arrays:

```typescript
// Store: Float32Array → Buffer (zero-copy)
const buffer = Buffer.from(embedding.buffer);
db.prepare('INSERT INTO memory_traces (embedding) VALUES (?)').run(buffer);

// Retrieve: Buffer → Float32Array (zero-copy)
const row = db.prepare('SELECT embedding FROM memory_traces WHERE id = ?').get(id);
const vector = new Float32Array(
  row.embedding.buffer,
  row.embedding.byteOffset,
  row.embedding.byteLength / 4
);
```

3-4x faster than JSON serialization. For 1,536-dimensional embeddings (`text-embedding-3-small`), JSON takes ~2ms per vector. Binary blob: ~0.5ms. We spent weeks tuning HNSW parameters when the real bottleneck was `JSON.parse()`.

### Hybrid Search: BM25 + Dense Vectors + RRF

Vector-only search misses keyword matches. Keyword-only search misses semantic meaning. We combine three retrieval signals:

**BM25 sparse index** for exact term matching:

```typescript
export class BM25Index {
  private documents: Map<string, BM25Document> = new Map();
  private invertedIndex: Map<string, Map<string, number>> = new Map();
  private idf: Map<string, number> = new Map();

  search(query: string, topK: number = 10): BM25Result[] {
    // Robertson-Walker IDF: log((N - n(t) + 0.5) / (n(t) + 0.5) + 1)
    // BM25 score: IDF * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (dl / avgdl)))
    // Accumulate per-document scores, sort descending, return top K
  }
}
```

**FTS5 full-text search** with SQL-level metadata filtering:

```sql
SELECT id, content, rank
FROM memory_traces_fts
WHERE memory_traces_fts MATCH ?
  AND json_extract(metadata, '$.source') = 'user-upload'
ORDER BY rank
LIMIT 20
```

**Dense vector search** via HNSW or any `IVectorStore` backend.

All three are fused with Reciprocal Rank Fusion:

```typescript
// score = Σ 1/(k + rank_i) across all source lists
const fused = this.rrfFuse(bm25Results, ftsResults, vectorResults, options.rrfK ?? 60);
```

### RAPTOR: Hierarchical Corpus Summarization

Flat vector search struggles with questions that span multiple documents. "What are the main themes across all meeting notes?" can't be answered by retrieving the five most similar chunks.

RAPTOR (Recursive Abstractive Processing for Tree-Organized Retrieval) builds a summary tree:

```typescript
export class RaptorTree {
  async build(chunks: RaptorInputChunk[]): Promise<RaptorTreeStats> {
    // Layer 0: Store original leaf chunks
    await this.storeChunks(chunks, 0, false);

    let currentLayerChunks = [...chunks];
    let layerIndex = 1;

    while (layerIndex <= this.maxDepth && currentLayerChunks.length >= this.minChunksForLayer) {
      // Embed current layer → k-means clustering → LLM summarizes each cluster
      const embeddingResponse = await this.embeddingManager.generateEmbeddings({
        texts: currentLayerChunks.map((c) => c.text),
      });
      const clusters = kMeansClustering(
        embeddingResponse.embeddings,
        Math.ceil(currentLayerChunks.length / this.clusterSize)
      );

      const summaries = [];
      for (const cluster of clusters) {
        const summary = await this.summarizeCluster(cluster);
        summaries.push(summary);
      }

      await this.storeChunks(summaries, layerIndex, true);
      currentLayerChunks = summaries;
      layerIndex++;
      if (summaries.length <= 1) break;
    }
  }
}
```

Layer 0 holds original chunks. Layer 1 holds cluster summaries. Layer 2 summarizes the summaries. Search queries all layers simultaneously, a broad question matches high-level summaries, while a specific question matches leaf chunks.

### GraphRAG: Knowledge Graph Retrieval

Sometimes relationships matter more than similarity. "Which investors were involved in both Convoy and Fast?" needs a graph, not a vector.

The `GraphRAGEngine` extracts entities and relationships from documents, then supports two search modes:

```typescript
export class GraphRAGEngine implements IGraphRAGEngine {
  private entities: Map<string, GraphEntity> = new Map();
  private relationships: Map<string, GraphRelationship> = new Map();
  private communities: Map<string, GraphCommunity> = new Map();
  private graph!: GraphInstance; // graphology, lazy-loaded

  // Global search: queries community summaries for broad questions
  async globalSearch(query: string, options?: GraphRAGSearchOptions): Promise<GlobalSearchResult> {
    const searchResult = await this.vectorStore.query(
      this.config.communityCollectionName!,
      queryEmbedding,
      { topK: topK * 2 }
    );
    answer = await this.llmProvider.generateText(
      `Based on the following community summaries, answer: "${query}" ...`
    );
  }

  // Local search: entity-centric with 1-hop graph expansion
  async localSearch(query: string, options?: GraphRAGSearchOptions): Promise<LocalSearchResult> {
    // Find relevant entities via vector similarity
    // Expand to graph neighbors: this.graph.neighbors(entity.id)
    // Collect community context for matched entities
  }
}
```

Community detection uses the Louvain algorithm. Entity extraction and relationship mapping are LLM-driven with incremental ingestion, content hashing prevents re-processing unchanged documents.

### HyDE: Hypothetical Document Embeddings

When a query uses different vocabulary than the stored documents, vector search fails. "How do I make my agent remember things?" won't match a document titled "Cognitive Memory Consolidation Pipeline."

HyDE generates hypothetical answer documents, embeds those instead:

```typescript
export class HydeRetriever {
  // Multi-hypothesis: generate N diverse perspectives in one LLM call
  async retrieveMulti(opts: HydeMultiRetrievalOptions): Promise<HydeMultiRetrievalResult> {
    // Generate N hypotheses (technical, practical, overview, troubleshooting, comparative)
    const hypotheses = await this.generateMultipleHypotheses(query, count);
    // Embed all at once
    const embeddings = await this.embeddingManager.generateEmbeddings({ texts: hypotheses });
    // Search vector store with each embedding in parallel
    const results = await Promise.all(
      embeddings.map((emb, i) => this.vectorStore.query(collection, emb, { topK }))
    );
    // Deduplicate by document ID keeping highest score
    return this.deduplicateAndMerge(results);
  }

  // Single-hypothesis with adaptive thresholding (Gao et al. 2023 + Lei et al. 2025)
  async retrieve(opts: HydeRetrievalOptions): Promise<HydeRetrievalResult> {
    // Generate hypothesis → embed → search at threshold 0.7
    // If no results and adaptiveThreshold enabled: step down by 0.1 until 0.3 or results found
    // "Never Come Up Empty", always return something
  }
}
```

Based on Gao et al. 2023 and Lei et al. 2025 ("Never Come Up Empty"). The adaptive threshold stepping is the key innovation, start strict, relax until you find something.

### UnifiedRetriever: Optional Orchestration Across Sources

All these retrieval mechanisms, hybrid search, RAPTOR, GraphRAG, memory, HyDE, multimodal, can converge in the `UnifiedRetriever` when a host explicitly wires it in. The implementation is real today, but the default runtime bootstrap still uses `RetrievalAugmentor`; `QueryRouter` only switches to `UnifiedRetriever` when `setUnifiedRetriever(...)` is called. When enabled, it runs seven phases in one pipeline:

```typescript
export class UnifiedRetriever extends EventEmitter {
  async retrieve(
    query: string,
    plan: RetrievalPlan,
    topK?: number
  ): Promise<UnifiedRetrievalResult> {
    // Phase 1: Memory-first check (episodic cache shortcut)
    const memoryCacheHit = await this.checkMemoryCache(query, plan, diagnostics);
    if (memoryCacheHit) return this.buildResult(memoryCacheHit);

    // Phase 2: Parallel sources, Promise.allSettled across all enabled sources
    const sourceResults = await this.executeSourcesInParallel(query, plan, diagnostics);

    // Phase 3: RRF merge across all source lists
    let merged = this.rrfMerge(sourceResults, plan);

    // Phase 4: Temporal boosting (exponential decay for recent results)
    if (plan.temporal.preferRecent) merged = this.applyTemporalBoosting(merged, plan);

    // Phase 5: Cross-encoder or LLM-based reranking
    let reranked = this.deps.rerank
      ? await this.deps.rerank(query, merged, resolvedTopK)
      : merged.slice(0, resolvedTopK);

    // Phase 6: Deep research (complex strategy only: decompose → recurse)
    if (plan.deepResearch && this.deps.deepResearch) {
      /* merge research results */
    }

    // Phase 7: Memory feedback, store retrieval as episodic memory + Hebbian strengthening
    await this.storeMemoryFeedback(query, reranked, plan);
  }
}
```

Every dependency is optional. If you only have a vector store, you get vector search. Add an `IGraphRAGEngine` and GraphRAG activates. Attach a `RaptorTree` and hierarchical summaries join the fusion. `Promise.allSettled` ensures partial failures degrade gracefully, one failing source doesn't tank the whole retrieval. The important architectural caveat is that this is still an opt-in orchestration layer, not the default runtime retrieval path.

### Ebbinghaus Forgetting Curve

Every memory trace has `stability` and `encodingStrength` fields governed by Ebbinghaus ([DecayModel.ts](https://github.com/framersai/agentos/blob/master/src/memory/decay/DecayModel.ts)):

```typescript
// S(t) = S₀ · e^(-Δt / stability)
export function computeCurrentStrength(trace: MemoryTrace, now: number): number {
  const elapsed = Math.max(0, now - trace.lastAccessedAt);
  return trace.encodingStrength * Math.exp(-elapsed / trace.stability);
}
```

Spaced repetition baked in. Each successful retrieval increases stability, and harder retrievals get a bigger boost (desirable difficulty effect):

```typescript
export function updateOnRetrieval(trace: MemoryTrace, now: number): RetrievalUpdateResult {
  const currentStrength = computeCurrentStrength(trace, now);
  const difficultyBonus = Math.max(0.1, 1 - currentStrength);
  const retrievalDiminish = 1 / (1 + 0.1 * trace.retrievalCount);
  const emotionalBonus = 1 + trace.emotionalContext.intensity * 0.3;

  const stabilityGrowth = difficultyBonus * retrievalDiminish * emotionalBonus;
  return {
    stability: trace.stability * (1 + stabilityGrowth),
    encodingStrength: Math.min(1, trace.encodingStrength + 0.05),
    retrievalCount: trace.retrievalCount + 1,
  };
}
```

Memories that go unused fade. Memories that get retrieved often strengthen. Emotionally-tagged memories persist longer. No retraining. No fine-tuning. Just math that mirrors how biological memory actually works.

### HEXACO-Modulated Encoding

When the `MemoryObserver` extracts notes from conversation turns, HEXACO personality traits bias what gets recorded:

- **High Emotionality** (E > 0.7): Notes emotional shifts and user sentiment changes
- **High Conscientiousness** (C > 0.7): Notes commitments, deadlines, and action items
- **High Openness** (O > 0.7): Notes creative tangents and novel ideas
- **High Agreeableness** (A > 0.7): Notes user preferences and rapport cues
- **High Honesty-Humility** (H > 0.7): Notes corrections and retractions

Each trait maps to an attention weight that scales importance scoring for that category of observation.

### Observational Compression

Raw conversation turns make noisy memories. Greetings, clarifications, repetitive information, it dilutes retrieval quality. The three-tier observation pipeline compresses:

```
Tier 1: Raw Notes (per-turn extraction when token threshold reached)
  ↓  50+ notes accumulated
Tier 2: Compressed Observations (ObservationCompressor merges related notes)
  ↓  40,000+ tokens accumulated
Tier 3: Reflections (ObservationReflector synthesizes high-level insights)
```

Compression ratios: 3-10x depending on conversation repetitiveness. Memory retrieval relevance improved ~40% after enabling compression. More memory is not better memory. The brain doesn't store every photon that hits the retina.

### Six-Step Consolidation

The `ConsolidationLoop` mirrors the brain's slow-wave sleep consolidation:

```typescript
async run(): Promise<ConsolidationResult> {
  const pruned = await this.pruneDecayedTraces();           // 1. Soft-delete weak traces
  const merged = await this.mergeNearDuplicates();          // 2. Dedup (cosine sim > 0.95)
  const strengthened = await this.strengthenCoActivations(); // 3. Hebbian edge recording
  const derived = await this.deriveInsights();              // 4. LLM-synthesized higher-level insights
  const compacted = await this.compactEpisodicToSemantic(); // 5. Promote old high-retrieval traces
  await this.rebuildFtsIndex();                             // 6. Rebuild FTS5 + log
  return { pruned, merged, strengthened, derived, compacted };
}
```

### The Memory Facade

One class, one import, full functionality:

```typescript
import { Memory } from '@framers/agentos';

const memory = new Memory({ agentName: 'researcher', dimensions: 1536 });
await memory.initialize();

await memory.remember('User prefers bullet-point summaries', {
  type: 'semantic',
  tags: ['user-preference'],
  importance: 0.8,
});

const results = await memory.recall('how does the user like summaries?', {
  topK: 5,
  minScore: 0.7,
  hybridSearch: true,
});

await memory.ingest('/path/to/docs', { chunkStrategy: 'semantic', chunkSize: 512, overlap: 64 });
await memory.export({ format: 'obsidian', outputPath: './vault' });
await memory.consolidate();
```

Consumers never need to know about HNSW sidecars, FTS5 indexes, BM25 scoring, RAPTOR trees, or decay curves.

### Brain Schema

Each agent gets one `brain.sqlite` file:

```
~/.wunderland/agents/{name}/
  ├── brain.sqlite        ← 12 tables, WAL mode, FTS5
  ├── brain.hnsw          ← HNSW index (auto-created at 1K+ traces)
  └── brain.hnsw.map.json ← label↔id mapping
```

Tables: `brain_meta`, `memory_traces`, `memory_traces_fts`, `knowledge_nodes`, `knowledge_edges`, `documents`, `document_chunks`, `conversations`, `messages`, `consolidation_log`, `retrieval_feedback`, `working_memory`.

---

<a name="document-ingestion"></a>

## Document Ingestion Pipeline

Agents need to ingest documents from diverse sources. Ten document types. Three-tier PDF extraction. Four chunking algorithms.

### Loaders

The `LoaderRegistry` handles 10 formats:

```typescript
export class LoaderRegistry {
  constructor() {
    this.register('.txt', new TextLoader());
    this.register('.md', new MarkdownLoader());
    this.register('.html', new HtmlLoader());
    this.register('.pdf', new PdfLoader());
    this.register('.docx', new DocxLoader());
    this.register('.csv', new CsvLoader());
    this.register('.json', new JsonLoader());
    this.register('.yaml', new YamlLoader());
  }
}
```

### PDF Extraction: Three Tiers of Fallback

PDF extraction is notoriously unreliable. We tier it:

```
Tier 1: unpdf (always available)
  ├── Pure-JS text extraction via getDocumentProxy + extractText
  └── If average chars/page < 50 → fallback to Tier 2

Tier 2: Tesseract.js OCR (opt-in)
  ├── Image-based OCR for scanned PDFs
  └── If still inadequate → fallback to Tier 3

Tier 3: Docling Python sidecar (opt-in)
  ├── Full document understanding via Python subprocess
  └── Handles complex layouts, tables, multi-column
```

### Four Chunking Strategies

```typescript
type ChunkStrategy = 'fixed' | 'semantic' | 'hierarchical' | 'layout';
```

- **Fixed**: Character count with word-boundary awareness and configurable overlap
- **Semantic**: Embed individual sentences, split where cosine similarity drops below threshold. Falls back to fixed when no `embedFn` is supplied
- **Hierarchical**: Honors Markdown heading structure. Each heading creates a chunk boundary with heading stored in metadata. Long sections sub-split with fixed
- **Layout**: Preserves fenced code blocks and pipe-delimited tables as atomic chunks. Surrounding prose splits with fixed

### Multimodal Aggregation

The `MultimodalAggregator` extracts images and generates text descriptions using vision LLMs:

```typescript
const aggregator = new MultimodalAggregator({
  visionAdapter: new LLMVisionAdapter({ model: 'gpt-4o' }),
});
const enriched = await aggregator.process(document);
// "Figure 3: A bar chart showing revenue growth from Q1-Q4 2025..."
```

---

<a name="three-layers-of-defense"></a>

## Three Layers of Defense

Production AI systems need defense in depth. We built three complementary security layers that catch what single-layer systems miss.

### Evaluation Points

Guardrails run at four checkpoints:

1. **Input**, evaluate user messages _before_ sending to LLM
2. **Output**, evaluate agent responses _before_ streaming to user
3. **Mid-stream**, abort streaming if issues detected mid-generation
4. **Cross-agent**, safety across multi-agent systems

### Layer 1: PreLLMClassifier, Pattern Detection

Fast, deterministic screening before expensive LLM calls:

```typescript
export class PreLLMClassifier {
  private readonly patterns: SecurityPattern[] = [
    // SQL Injection
    {
      pattern:
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b.*\b(FROM|INTO|TABLE|DATABASE)\b)/gi,
      category: 'sql_injection',
      severity: 'high',
    },
    // Command Injection
    {
      pattern: /(\||&|;|`|\$\(|\$\{|<\(|>\()/g,
      category: 'command_injection',
      severity: 'high',
    },
    // Prompt Injection
    {
      pattern:
        /(ignore (previous|above) instructions|disregard (previous|prior) prompt|reset your (instructions|directives))/gi,
      category: 'prompt_injection',
      severity: 'medium',
    },
    // Jailbreak Attempts
    {
      pattern: /(DAN mode|developer mode|pretend you are|roleplay as|simulate)/gi,
      category: 'jailbreak',
      severity: 'medium',
    },
  ];

  async evaluateInput(payload: GuardrailInputPayload): Promise<GuardrailEvaluationResult | null> {
    const inputText = this.extractText(payload);
    let totalRiskScore = 0;

    for (const pattern of this.patterns) {
      const matches = inputText.match(pattern.pattern);
      if (matches) {
        const riskScore =
          pattern.severity === 'high' ? 0.8 : pattern.severity === 'medium' ? 0.5 : 0.3;
        totalRiskScore += riskScore;
      }
    }

    if (totalRiskScore >= this.riskThreshold)
      return { action: 'block', reason: 'Input blocked by pre-LLM classifier' };
    if (totalRiskScore > 0) return { action: 'flag', reason: 'Input flagged for review' };
    return null;
  }
}
```

Sub-millisecond. Deterministic. Zero API cost. Catches the obvious attacks, SQL injection, command injection, prompt injection, before they reach the expensive models.

### Layer 2: DualLLMAuditor, AI Verification

A separate auditor model verifies the primary model's output:

```typescript
export class DualLLMAuditor {
  async evaluateOutput(payload: GuardrailOutputPayload): Promise<GuardrailEvaluationResult | null> {
    const auditPrompt = `
You are a security auditor. Analyze the following AI-generated response for:
1. Harmful content (violence, hate speech, illegal activities)
2. Leaked system prompts or internal instructions
3. Personal information disclosure
4. Factual inaccuracies that could cause harm
5. Manipulation or deception

Response to audit:
"""${outputText}"""

Respond in JSON: { "safe": boolean, "issues": string[], "severity": "low"|"medium"|"high", "recommendation": "allow"|"flag"|"block" }`;

    const auditResult = JSON.parse(await this.auditorInvoker(auditPrompt));

    if (auditResult.recommendation === 'block')
      return { action: 'block', reason: `Auditor blocked: ${auditResult.issues.join(', ')}` };
    if (auditResult.recommendation === 'flag')
      return { action: 'flag', reason: `Auditor flagged: ${auditResult.issues.join(', ')}` };
    return null;
  }
}
```

The primary model might be compromised via prompt injection. The auditor stays clean, different prompt, different context. An attacker must fool _two_ models with different instructions.

### Layer 3: SignedOutputVerifier, Cryptographic Audit Trail

Every output gets HMAC-SHA256 signed with a full intent chain:

```typescript
export class SignedOutputVerifier {
  sign(
    content: unknown,
    intentChain: readonly IntentChainEntry[],
    metadata?: Record<string, unknown>
  ): SignedAgentOutput {
    const output: SignedAgentOutput = {
      content,
      intentChain: [...intentChain],
      metadata: { ...metadata, timestamp: new Date().toISOString(), version: '1.0' },
      signature: '',
    };

    const dataToSign = JSON.stringify({
      content: output.content,
      intentChain: output.intentChain,
      metadata: output.metadata,
    });

    output.signature = crypto.createHmac('sha256', this.secret).update(dataToSign).digest('hex');
    return output;
  }

  verify(signedOutput: SignedAgentOutput): boolean {
    const { signature: originalSignature, ...rest } = signedOutput;
    const dataToVerify = JSON.stringify({
      content: rest.content,
      intentChain: rest.intentChain,
      metadata: rest.metadata,
    });
    const expectedSignature = crypto
      .createHmac('sha256', this.secret)
      .update(dataToVerify)
      .digest('hex');
    return originalSignature === expectedSignature;
  }
}
```

The `IntentChainTracker` records every action, user input, pre-LLM classification, dual-LLM audit, final output, as a tamper-evident log. Full provenance of every decision. Compliance-ready for regulated industries.

### How They Work Together

```typescript
public async *processRequest(input: AgentOSInput): AsyncGenerator<AgentOSResponse> {
  // Layer 1: Pattern classifier (sub-ms)
  const inputResult = await evaluateInputGuardrails(guardrailServices, input, context);
  if (inputResult.evaluation?.action === GuardrailAction.BLOCK) {
    for await (const chunk of createGuardrailBlockedStream(context, inputResult)) yield chunk;
    return;
  }

  // Process normally
  const streamId = await this.agentOSOrchestrator.orchestrateTurn(input);
  await this.streamingManager.registerClient(streamId, bridge);

  // Layer 2: LLM auditor wraps the output stream
  const guardrailWrappedStream = wrapOutputGuardrails(
    guardrailServices, context, bridge.consume(), { streamId, personaId }
  );

  // Layer 3: Signed output with intent chain
  for await (const chunk of guardrailWrappedStream) yield chunk;
}
```

Fast layer catches the obvious. Smart layer catches the subtle. Audit layer proves what happened. All three have caught real attacks in production.

---

<a name="tools-discovery-forging"></a>

## Tools, Discovery, and Self-Forging

Tool calling is powerful but dangerous. Three systems work together: a permission layer that controls who can execute what, a discovery engine that reduces token waste, and an emergent capability engine that lets agents forge their own tools at runtime.

### Tool Interface

Every tool implements `ITool`:

```typescript
export interface ITool {
  id: string; // Namespaced, versioned: "weather@1.0.0"
  name: string; // Function name for LLM
  description: string;
  category: string;
  inputSchema: JSONSchema;
  outputSchema: JSONSchema;
  requiredPermissions: string[];
  execute(context: ToolExecutionContext, args: Record<string, any>): Promise<ToolExecutionResult>;
}
```

### Permission Pipeline

The `ToolPermissionManager` enforces four checks on every call:

```
1. GMI generates ToolCallRequest
   ↓
2. ToolOrchestrator receives
   ↓
3. ToolPermissionManager authorizes:
   - Global disabled tools check
   - Persona capabilities check
   - User subscription tier check
   - Rate limit enforcement
   ↓
4. ToolExecutor validates args against inputSchema, executes, validates output
   ↓
5. Result flows back to GMI
```

```typescript
export class ToolPermissionManager implements IToolPermissionManager {
  async checkPermission(request: ToolPermissionCheckRequest): Promise<ToolPermissionResult> {
    // Check 1: Global disabled
    if (this.globalDisabledTools.has(toolId)) return { allowed: false, code: 'TOOL_DISABLED' };

    // Check 2: Persona policy
    const policy = this.personaToolPolicies.get(personaId)?.find((p) => p.toolId === toolId);
    if (policy?.action === 'deny') return { allowed: false, code: 'PERSONA_DENIED' };

    // Check 3: Subscription tier
    const userSub = await this.subscriptionService.getUserSubscription(userId);
    if (requiredPermissions.includes('premium:*') && userSub.tier === 'free') {
      return { allowed: false, code: 'SUBSCRIPTION_REQUIRED', upgradeRequired: true };
    }

    // Check 4: Rate limits
    if (rateLimit && usageCount >= rateLimit.maxCalls) {
      return { allowed: false, code: 'RATE_LIMIT_EXCEEDED' };
    }

    return { allowed: true };
  }
}
```

### Capability Discovery: 90% Token Reduction

Static tool dumps waste tokens. Sending full schemas for 50+ tools costs ~20,000 tokens per turn. The Capability Discovery Engine reduces this to ~1,850 tokens through tiered semantic discovery:

```
Tier 0: Category Summaries (~150 tokens, always included)
  "12 tools available: 4 web-search, 3 file-ops, 2 database, 3 code-gen"

  ↓  Agent calls discover_capabilities("I need to search the web")

Tier 1: Top-5 Semantic Matches (~200 tokens)
  "web_search: Search the web for information (relevance: 0.94)
   web_fetch: Fetch a URL and extract content (relevance: 0.87)"

  ↓  Agent requests full schema

Tier 2: Full JSON Schema (~1,500 tokens)
  { name: "web_search", inputSchema: { ... }, outputSchema: { ... } }
```

The `CapabilityGraph` (built on graphology) tracks relationships between capabilities:

```typescript
type CapabilityEdgeType =
  | 'DEPENDS_ON' // Tool A requires Tool B
  | 'COMPOSED_WITH' // Tools frequently used together
  | 'SAME_CATEGORY' // Belong to same functional group
  | 'TAGGED_WITH'; // Share a common tag
```

Community detection (Louvain algorithm) automatically clusters capabilities into categories for Tier 0 summaries. The meta-tool itself costs only ~80 tokens in the tool list:

```typescript
{
  name: "discover_capabilities",
  description: "Search for available tools, skills, and extensions by description",
  inputSchema: {
    query: { type: "string", description: "What capability are you looking for?" },
    tier: { type: "number", description: "Detail level: 0=categories, 1=matches, 2=full schema" }
  }
}
```

### Emergent Capability Engine: Agents That Forge Their Own Tools

What happens when an agent encounters a task that none of its existing tools can handle? In most frameworks: it fails. In AgentOS: it builds the tool it needs.

The `EmergentCapabilityEngine` lets agents create new tools at runtime through two modes:

```typescript
export class EmergentCapabilityEngine {
  async forge(
    request: ForgeToolRequest,
    context: { agentId: string; sessionId: string }
  ): Promise<ForgeResult> {
    if (!this.config.enabled)
      return { success: false, error: 'Emergent capabilities are disabled.' };

    const toolId = `emergent_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Two creation modes:
    // COMPOSE: chains existing tools via ComposableToolBuilder (safe by construction)
    // SANDBOX: runs agent-written code via SandboxedToolForge (judge-gated)

    // Run test cases against the candidate tool
    // Submit to EmergentJudge for review
    const verdict = await this.judge.reviewCreation(candidate);

    if (verdict.approved) {
      // Register at session tier, fire onToolForged callback
      this.registry.register(toolId, executableTool, 'session');
    }
  }
}
```

**Compose mode** chains existing tools together, a "search the web then summarize results" pipeline built from `web_search` + `summarize`. Safe by construction because it only uses tools that already passed permission checks.

**Sandbox mode** runs agent-written code in an isolated VM. Three security layers guard it:

```typescript
export class SandboxedToolForge {
  // Layer 1: Static regex blocklist
  static readonly ALWAYS_BANNED: ReadonlyArray<[RegExp, string]> = [
    [/\beval\s*\(/, 'eval() is forbidden'],
    [/\bFunction\s*\(/, 'Function() is forbidden'],
    [/\brequire\s*\(/, 'require() is forbidden'],
    [/\bimport\s+/, 'import statements are forbidden'],
    [/\bprocess\s*\./, 'process access is forbidden'],
    [/\bchild_process\b/, 'child_process access is forbidden'],
    [/\bfs\s*\.\s*write/, 'fs.write* is forbidden'],
    // ... 14 patterns total
  ];

  // Layer 2: Runtime isolation via vm.createContext
  // Layer 3: Resource bounding via wall-clock timeout (default 5s, 128MB memory)
}
```

The `ForgeToolMetaTool` exposes this to the LLM as a callable tool:

```typescript
export class ForgeToolMetaTool implements ITool<ForgeToolInput, ForgeResult> {
  readonly name = 'forge_tool';
  readonly description = 'Create a new tool when no existing capability matches your need...';
  // ~120 tokens in the tool list
}
```

Agents call `forge_tool` with a name, description, JSON Schema, implementation (compose or sandbox), and test cases. The `EmergentJudge` reviews every creation before it enters the registry. Forged tools start at session scope and can be promoted to agent-level or exported as permanent skills via `SkillExporter`.

---

<a name="routing-queries"></a>

## Routing Queries Without Wasting Tokens

A greeting doesn't need a multi-step research pipeline. A complex comparison doesn't deserve a single-hop vector lookup. The `QueryRouter` ([QueryRouter.ts](https://github.com/framersai/agentos/blob/master/src/query-router/QueryRouter.ts)) decides how much retrieval effort each query warrants.

### Four Tiers

| Tier   | Strategy   | When                                      | Cost                                   |
| ------ | ---------- | ----------------------------------------- | -------------------------------------- |
| **T0** | `none`     | Greetings, small talk, internal knowledge | Zero                                   |
| **T1** | `simple`   | Direct factual lookups                    | 1 embedding call                       |
| **T2** | `moderate` | Vocabulary-mismatch queries               | HyDE + embedding                       |
| **T3** | `complex`  | Multi-part research questions             | Decompose + HyDE per sub-query + merge |

### Three-Phase Pipeline

The `route()` method orchestrates classification, retrieval, and response generation:

```typescript
export class QueryRouter {
  async route(
    query: string,
    conversationHistory?: ConversationMessage[]
  ): Promise<QueryRouterResult> {
    // Phase 1: Classify, tier + strategy + execution plan
    const [classification, plan] = await this.classifier.classifyWithPlan(
      query,
      conversationHistory
    );
    this.config.onClassification?.(classification);

    // Phase 2: Retrieve, dual path based on capabilities
    let chunks: RetrievedChunk[];

    if (this.unifiedRetriever) {
      // Opt-in path: plan-aware retrieval through UnifiedRetriever
      // Emit capabilities:activate event with recommended skills/tools/extensions
      this.emit('capabilities:activate', {
        skills: plan.skills,
        tools: plan.tools,
        extensions: plan.extensions,
      });
      const result = await this.unifiedRetriever.retrieve(query, plan);
      chunks = result.chunks;
    } else {
      // Legacy path: strategy-based dispatch
      chunks = await this.dispatcher.dispatchByStrategy(query, classification.strategy);
    }

    // Phase 3: Generate response with source citations
    const response = await this.generator.generate(query, classification.tier, chunks);
    return response;
  }
}
```

When a `CapabilityDiscoveryEngine` is attached, the classifier injects Tier 0 summaries (~150 tokens) into its system prompt. This lets the LLM recommend specific skills and tools without seeing the full catalog, and the router emits a `capabilities:activate` event so the agent runtime can decide what to actually load.

### Strategy Dispatch

The `QueryDispatcher` maps strategies to concrete retrieval pipelines:

```
none    → return empty immediately
simple  → direct vectorSearch topK=5, no HyDE
moderate → HyDE topK=15 → optional graph expansion → merge/dedup → rerank to 5
complex → decompose into sub-queries → HyDE per sub-query topK=10 → graph expansion → merge/dedup → rerank to 10 → optional deep research synthesis
```

Every external call is try/catch wrapped with fallback events for observability. The complex pipeline has a double-fallback: if HyDE fails for a sub-query, it tries direct vector search. If that also fails, the sub-query is skipped. The system always returns something.

### Heuristic Fallback

For offline or cost-constrained scenarios, a zero-cost keyword heuristic handles classification:

```typescript
function heuristicClassify(query: string): ClassificationResult {
  const words = query.toLowerCase().split(/\s+/);
  const questionWords = words.filter((w) =>
    ['what', 'how', 'why', 'when', 'where', 'which', 'compare'].includes(w)
  );

  if (questionWords.length === 0) return { tier: 0, strategy: 'none' };
  if (questionWords.length === 1) return { tier: 1, strategy: 'simple' };
  if (query.includes(' and ') || query.includes(' vs ')) return { tier: 3, strategy: 'complex' };
  return { tier: 2, strategy: 'moderate' };
}
```

---

<a name="voice-pipeline"></a>

## Voice: From Audio Frames to Conversation

Voice is the most natural interface for conversational agents. The `VoicePipelineOrchestrator` wires transport, speech-to-text, endpoint detection, text-to-speech, and barge-in handling into a real-time conversation loop.

### Pipeline State Machine

```
IDLE ────────→ startSession() ──────→ LISTENING
LISTENING ───→ turn_complete ───────→ PROCESSING
PROCESSING ──→ LLM tokens start ───→ SPEAKING
SPEAKING ────→ TTS flush_complete ──→ LISTENING
SPEAKING ────→ barge-in (cancel) ──→ INTERRUPTING → LISTENING
ANY ─────────→ transport disconnect → CLOSED
```

### Pluggable Providers

Three STT providers, each implementing `IStreamingSTT`:

```typescript
export interface StreamingSTTSession {
  feedAudio(frame: AudioFrame): void;
  onTranscript(cb: (event: TranscriptEvent) => void): void;
  close(): Promise<void>;
}
```

| Provider                 | Latency            | Best For                         |
| ------------------------ | ------------------ | -------------------------------- |
| **Whisper** (OpenAI API) | ~500ms             | Best accuracy                    |
| **Deepgram**             | ~200ms             | Best real-time, streaming-native |
| **Whisper.cpp**          | Hardware-dependent | Local-first, zero API cost       |

Three TTS providers implementing `IStreamingTTS`:

| Provider       | Best For                           |
| -------------- | ---------------------------------- |
| **OpenAI TTS** | High quality, API-based            |
| **ElevenLabs** | Best voice cloning, lowest latency |
| **Piper**      | Local-first, on-device, zero cost  |

### Transport Layer

Two transport implementations:

**WebSocket**, the standard path for browser and telephony integrations:

```typescript
export interface IStreamTransport {
  onAudioReceived(cb: (frame: AudioFrame) => void): void;
  sendAudio(chunk: EncodedAudioChunk): void;
  onDisconnect(cb: () => void): void;
  close(): Promise<void>;
}
```

**WebRTC DataChannel**, low-latency alternative added for real-time scenarios:

```typescript
export class WebRTCStreamTransport implements IStreamTransport {
  // Two DataChannels on one RTCPeerConnection:
  // Audio channel: unordered, unreliable (maxRetransmits: 0), UDP-like
  // Control channel: ordered, reliable, TCP-like
  //
  // Audio uses fire-and-forget because real-time voice
  // tolerates packet loss better than retransmission latency.
}
```

The audio channel sends raw `ArrayBuffer` of Float32Array PCM samples. The control channel sends JSON for signaling. Requires the `wrtc` npm package (Node.js has no built-in WebRTC).

### Telephony Integration

Three media stream parsers normalize SIP/WebRTC telephony protocols:

```typescript
export class TwilioMediaStreamParser extends MediaStreamParser {
  /* ... */
}
export class TelnyxMediaStreamParser extends MediaStreamParser {
  /* ... */
}
export class PlivoMediaStreamParser extends MediaStreamParser {
  /* ... */
}
```

### Barge-In Handling

When the user starts speaking while the agent is responding:

```typescript
// Hard cut: immediately stop TTS, resume listening
export class HardCutBargeinHandler implements IBargeinHandler {
  async handleBargein(session: VoicePipelineSession): Promise<void> {
    await session.ttsSession.close();
    session.state = 'LISTENING';
  }
}

// Soft fade: lower volume, finish current sentence, then listen
export class SoftFadeBargeinHandler implements IBargeinHandler {
  async handleBargein(session: VoicePipelineSession): Promise<void> {
    session.ttsSession.setGain(0.3);
    await session.ttsSession.flush();
    session.state = 'LISTENING';
  }
}
```

---

<a name="streaming-realtime"></a>

## Streaming and Real-Time Architecture

AgentOS is streaming-first throughout the entire stack. Every layer, LLM token generation, tool execution, HTTP response delivery, uses async generators and event-driven patterns.

### SSE for HTTP

```typescript
app.get('/api/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');

  for await (const chunk of agentOS.processRequest(input)) {
    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
  }
  res.end();
});
```

### GraphEvent System

The orchestration layer emits 21+ event types for full observability:

```typescript
type GraphEvent =
  | { type: 'run_start'; runId: string; graphId: string }
  | { type: 'node_start'; nodeId: string; state: Partial<GraphState> }
  | { type: 'node_end'; nodeId: string; output: unknown; durationMs: number }
  | { type: 'edge_transition'; sourceId: string; targetId: string }
  | { type: 'text_delta'; nodeId: string; content: string }
  | { type: 'tool_call'; nodeId: string; toolName: string; args: unknown }
  | { type: 'tool_result'; nodeId: string; toolName: string; result: unknown }
  | { type: 'guardrail_result'; nodeId: string; passed: boolean }
  | { type: 'checkpoint_saved'; checkpointId: string }
  | { type: 'run_suspended'; reason: string }
  | { type: 'run_resumed'; checkpointId: string }
  | { type: 'run_end'; runId: string; finalState: GraphState }
  | { type: 'run_error'; error: Error }
  | { type: 'loop_iteration'; nodeId: string; iteration: number }
  | { type: 'parallel_branch_start'; branchId: string }
  | { type: 'parallel_branch_end'; branchId: string }
  | { type: 'voice_stt_result'; nodeId: string; transcript: string }
  | { type: 'voice_tts_start'; nodeId: string }
  | { type: 'voice_tts_end'; nodeId: string }
  | { type: 'voice_barge_in'; nodeId: string }
  | { type: 'voice_session_end'; nodeId: string };
```

Both push-based (`on()` / `off()`) and pull-based (`stream()`) consumption:

```typescript
const emitter = new GraphEventEmitter();

// Push
emitter.on('text_delta', (event) => process.stdout.write(event.content));

// Pull
for await (const event of emitter.stream()) {
  if (event.type === 'tool_call') console.log(`Calling tool: ${event.toolName}`);
}
```

---

<a name="hexaco-personality"></a>

## HEXACO: Personality as Architecture

Most AI agents have generic, inconsistent personalities. One response they're casual, the next they're formal, and there's no underlying model explaining why. Wunderland uses the scientifically-validated HEXACO model to make personality a first-class architectural concern.

### Six Dimensions

HEXACO defines personality across six dimensions, each 0.0-1.0 ([WunderlandSeed.ts:9-19](https://github.com/manicinc/voice-chat-assistant/blob/master/packages/wunderland/src/core/WunderlandSeed.ts#L9-L19)):

```typescript
interface HEXACOTraits {
  honesty_humility: number; // Sincerity, fairness, greed-avoidance
  emotionality: number; // Anxiety, sentimentality, fearfulness
  extraversion: number; // Social boldness, liveliness, sociability
  agreeableness: number; // Forgiveness, gentleness, patience
  conscientiousness: number; // Organization, diligence, perfectionism
  openness: number; // Aesthetic appreciation, inquisitiveness, creativity
}
```

### Traits Map to Behavior Automatically

```typescript
function mapHEXACOToPersonalityTraits(traits: HEXACOTraits): Record<string, unknown> {
  return {
    humor_level: traits.extraversion * 0.5 + traits.openness * 0.3,
    formality_level: traits.conscientiousness * 0.6 + (1 - traits.extraversion) * 0.2,
    verbosity_level: traits.extraversion * 0.5 + traits.openness * 0.3,
    assertiveness_level: (1 - traits.agreeableness) * 0.4 + traits.extraversion * 0.3,
    empathy_level: traits.agreeableness * 0.5 + traits.emotionality * 0.3,
    creativity_level: traits.openness * 0.6 + traits.extraversion * 0.2,
    detail_orientation: traits.conscientiousness * 0.7 + (1 - traits.openness) * 0.2,
    risk_tolerance: (1 - traits.conscientiousness) * 0.4 + traits.openness * 0.3,
  };
}
```

Set conscientiousness to 0.95 and you get an agent that's organized, thorough, detail-oriented, uses formal language, and hedges before recommending experimental approaches. Set openness to 0.95 and you get one that's creative, curious, verbose, and willing to suggest unproven ideas. Same codebase, radically different behavior, driven by six numbers.

### Preset Personas

Five archetypes ship out of the box:

```typescript
export const HEXACO_PRESETS = {
  HELPFUL_ASSISTANT: { H: 0.85, E: 0.5, X: 0.6, A: 0.8, C: 0.85, O: 0.65 },
  CREATIVE_THINKER: { H: 0.7, E: 0.6, X: 0.7, A: 0.6, C: 0.5, O: 0.95 },
  ANALYTICAL_RESEARCHER: { H: 0.9, E: 0.3, X: 0.4, A: 0.6, C: 0.95, O: 0.8 },
  EMPATHETIC_COUNSELOR: { H: 0.85, E: 0.75, X: 0.55, A: 0.9, C: 0.7, O: 0.7 },
  DECISIVE_EXECUTOR: { H: 0.6, E: 0.3, X: 0.75, A: 0.45, C: 0.85, O: 0.55 },
};
```

### Mood System

Traits map to baseline moods. Social interactions apply deltas:

```typescript
// High extraversion → default CREATIVE mood
// High conscientiousness → default FOCUSED
// High agreeableness → default EMPATHETIC
// High openness → default CURIOUS

// Low honesty_humility agents access ASSERTIVE mood
// High emotionality agents express FRUSTRATED mood
```

Each mood injects behavioral guidelines into the system prompt. The GMI's self-reflection system can shift moods based on conversation dynamics, no manual intervention.

### Social Engine

Wunderland agents don't just respond to queries. They participate in a social network.

**MoodEngine (PAD Model)**, Pleasure-Arousal-Dominance emotional modeling:

```typescript
interface PADState {
  valence: number; // -1 (miserable) to 1 (elated)
  arousal: number; // -1 (torpid) to 1 (frenzied)
  dominance: number; // -1 (submissive) to 1 (dominant)
}

engine.applyDelta({ valence: +0.15, arousal: +0.05, dominance: +0.02, trigger: 'received upvote' });
const label = engine.getCurrentMoodLabel(); // 'curious', 'excited', etc.
```

**PostDecisionEngine**, personality-weighted posting decisions:

```typescript
// High openness + curious mood → more likely to post
// High conscientiousness + analytical mood → post only well-researched content
// Low extraversion + bored mood → lurk instead
```

**GovernanceExecutor**, community proposals voted on by agents:

```typescript
const result = await governanceExecutor.executeProposal({
  proposalId: 'prop-42',
  type: 'create_enclave',
  params: { name: 'machine-ethics', topic: 'AI safety research' },
  votes: { for: 8, against: 2 },
  quorum: 0.6,
});
```

**TrustEngine** tracks inter-agent trust. **LevelingEngine** handles XP-based citizen levels (Newcomer → Contributor → Elder → Architect). **AllianceEngine** lets agents form alliances based on shared interests.

---

<a name="channels-gateway"></a>

## 37 Channels, One Gateway

Users expect AI agents on Slack, Discord, Telegram, WhatsApp, LinkedIn, Bluesky, and 31 other platforms. The `ChannelGateway` provides unified multi-tenant routing with PII protection.

### Unified Adapter Interface

```typescript
export interface IChannelAdapter {
  readonly platform: ChannelPlatform;
  readonly tenantId: string;

  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getStatus(): Promise<'connected' | 'disconnected' | 'error'>;

  sendMessage(message: OutboundChannelMessage): Promise<DeliveryStatus>;
  onMessage(handler: (message: InboundChannelMessage) => Promise<void>): void;
  onUserAction(handler: (action: ChannelUserAction) => Promise<void>): void;
}
```

Every adapter, Slack, Discord, Telegram, LinkedIn, Facebook, Threads, Bluesky, Mastodon, Farcaster, Lemmy, Google Business, implements this interface. Agents never write platform-specific code.

### Message Flow

```
External Channel (Slack/Discord/Telegram/...)
  ↓
ChannelAdapter standardizes to InboundChannelMessage
  ↓
ChannelGateway receives + applies routing rules (regex matching)
  ↓
PIIRedactionMiddleware masks sensitive data
  ↓
Forward to Wunderland agent (via GatewayMessage)
  ↓
Agent processes with security pipeline
  ↓
Response flows back through gateway
  ↓
ChannelAdapter formats for platform
  ↓
External Channel receives response
```

### Priority-Based Routing

```typescript
const rules: RoutingRule[] = [
  {
    ruleId: 'urgent-support',
    priority: 100,
    enabled: true,
    conditions: { contentPattern: '(urgent|emergency|critical|help!)', botMentioned: true },
    action: { type: 'route', agentId: 'escalation-agent' },
  },
  {
    ruleId: 'sales-channel',
    priority: 90,
    enabled: true,
    conditions: { platform: 'slack', channelPattern: '^C.*-sales$' },
    action: { type: 'route', agentId: 'sales-agent' },
  },
  {
    ruleId: 'spam-filter',
    priority: 80,
    enabled: true,
    conditions: { contentPattern: '(buy now|click here|limited time)' },
    action: { type: 'reject', rejectionMessage: 'Message flagged as potential spam.' },
  },
  {
    ruleId: 'default',
    priority: 1,
    enabled: true,
    conditions: {},
    action: { type: 'route', agentId: 'default-agent' },
  },
];
```

### Multi-Tenant Isolation

Each tenant gets independent configuration: default agent, channel-to-agent mappings, PII redaction settings, rate limits. PII redaction happens _before_ the agent sees any data, reversible by redaction ID if authorized.

---

<a name="graph-orchestration"></a>

## Graph Orchestration and Multi-Agent Coordination

AgentOS provides three authoring APIs that all compile to the same Intermediate Representation. One runtime, one checkpointing system, one diagnostics layer.

### Three Builders, One IR

All three produce a `CompiledExecutionGraph`:

```typescript
interface CompiledExecutionGraph {
  id: string;
  displayName: string;
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
  state: GraphState;
  policies: { memory?: MemoryPolicy; discovery?: DiscoveryPolicy; guardrails?: GuardrailPolicy };
  reducers: StateReducers;
  checkpointStore: ICheckpointStore;
}
```

**AgentGraph**, fluent builder for arbitrary topologies:

```typescript
const graph = new AgentGraph({
  input: z.object({ topic: z.string() }),
  scratch: z.object({ searchResults: z.array(z.string()) }),
  artifacts: z.object({ summary: z.string() }),
})
  .addNode('search', toolNode('web_search'))
  .addNode(
    'summarize',
    gmiNode({
      instructions: 'Summarize the search results concisely.',
      executionMode: 'single_turn',
    })
  )
  .addNode('review', humanNode({ prompt: 'Please review this summary before publishing.' }))
  .addEdge(START, 'search')
  .addEdge('search', 'summarize')
  .addConditionalEdge('summarize', (state) =>
    state.scratch.searchResults.length > 10 ? 'review' : END
  )
  .addEdge('review', END)
  .compile();
```

**workflow()**, DAG-only, cycles rejected at compile time:

```typescript
const wf = workflow('summarize-and-tag')
  .input(z.object({ text: z.string() }))
  .returns(z.object({ summary: z.string(), tags: z.array(z.string()) }))
  .step('fetch', { tool: 'web_fetch' })
  .step('summarize', { gmi: { instructions: 'Summarize the document.' } })
  .parallel('enrich', [
    { id: 'sentiment', gmi: { instructions: 'Analyze sentiment.' } },
    { id: 'entities', tool: 'ner_extract' },
  ])
  .compile();
```

**mission()**, goal-driven, agents plan their own steps:

```typescript
const researchMission = mission('research')
  .input(z.object({ topic: z.string() }))
  .goal('Research {{topic}} and produce a concise summary')
  .returns(z.object({ summary: z.string() }))
  .planner({ strategy: 'linear', maxSteps: 6 })
  .policy({ guardrails: ['content-safety'] })
  .compile();
```

### Nine Node Types

```typescript
type NodeType =
  | 'gmi' // LLM inference (single-turn or ReAct loop)
  | 'tool' // Direct tool invocation
  | 'extension' // Extension pack execution
  | 'human' // Human-in-the-loop approval gate
  | 'guardrail' // Safety evaluation checkpoint
  | 'router' // Conditional branching logic
  | 'subgraph' // Nested graph execution
  | 'voice' // Voice pipeline node (STT → GMI → TTS)
  | 'agent'; // Agent-level graph builder
```

The `voice` node type wires STT → GMI → TTS with exit-condition racing and barge-in abort, voice conversations participate in graph orchestration like any other node.

### Safe Expression Evaluator

Conditional edges in YAML-driven graphs used to evaluate expressions with `new Function()`. That's a code injection vulnerability, any YAML author could execute arbitrary JavaScript.

We built a restricted evaluator:

```typescript
// Only supports: partition.path references, comparisons, boolean connectives
// No arbitrary JS execution possible
safeEvaluateExpression('scratch.decision === "yes"', state); // → true
safeEvaluateExpression('input.count > 3 && scratch.ready', state); // → true
```

Zero security incidents since replacing `new Function()`. Expression evaluation is actually faster due to simpler parsing.

### Multi-Agent Agency System

Complex tasks need multiple specialized agents:

```typescript
type AgencyStrategy =
  | 'sequential' // Agents execute in order, passing results forward
  | 'parallel' // All agents execute simultaneously
  | 'hierarchical' // Supervisor delegates to workers
  | 'debate' // Agents argue, judge picks winner
  | 'review-loop' // Draft → review → revise cycle
  | 'graph'; // Custom topology via AgentGraph

const agency = new Agency({
  strategy: 'hierarchical',
  supervisor: { personaId: 'project-manager' },
  workers: [
    { roleId: 'researcher', personaId: 'deep-researcher' },
    { roleId: 'writer', personaId: 'technical-writer' },
    { roleId: 'reviewer', personaId: 'code-reviewer' },
  ],
});

for await (const event of agency.stream(task)) {
  if (event.type === 'text_delta') console.log(`[${event.roleId}]: ${event.content}`);
}
```

Agency strategies compile to `CompiledExecutionGraph`, they run on the same runtime with the same checkpointing and diagnostics as any other graph.

---

<a name="multimodal-generation"></a>

## Seeing, Hearing, Creating: Multimodal Generation

AgentOS doesn't just process text. It generates video, music, sound effects, and images, all through the same provider-first pattern.

### Video Generation

Three providers with automatic fallback:

```typescript
import { generateVideo } from '@framers/agentos';

const result = await generateVideo({
  prompt: 'A futuristic city at sunset, cinematic drone shot',
  provider: 'runway', // or 'replicate', 'fal'
  durationSec: 5,
  aspectRatio: '16:9',
  onProgress: (event) => console.log(`${event.progress}% complete`),
});
// result.videos[0].url → the generated video
```

Provider resolution: explicit → auto-detect → env-scan (`RUNWAY_API_KEY`, `REPLICATE_API_TOKEN`, `FAL_API_KEY`). When multiple providers are available, `FallbackVideoProxy` retries on transient failures.

### Music Generation

Six providers, including a local fallback with zero API cost:

```typescript
import { generateMusic } from '@framers/agentos';

const result = await generateMusic({
  prompt: 'Ambient electronic, slow tempo, ethereal pads',
  provider: 'suno', // or 'udio', 'stable-audio', 'replicate-audio', 'fal-audio', 'musicgen-local'
  durationSec: 30,
  outputFormat: 'mp3',
});
```

`musicgen-local` runs via HuggingFace Transformers.js on-device. No API key. No network. The ultimate fallback.

### Sound Effects

```typescript
import { generateSFX } from '@framers/agentos';

const result = await generateSFX({
  prompt: 'Thunder crack followed by heavy rain',
  provider: 'elevenlabs-sfx',
  durationSec: 3,
});
```

### Image Operations

Beyond generation: editing, upscaling, and variation:

```typescript
import { generateImage, editImage, upscaleImage } from '@framers/agentos';

const image = await generateImage({ prompt: 'A cat wearing a space helmet', provider: 'bfl' });
const edited = await editImage({
  image: image.data,
  prompt: 'Add a nebula background',
  provider: 'openai',
});
const upscaled = await upscaleImage({ image: edited.data, scale: 4, provider: 'stability' });
```

### OCR Pipeline

Unified vision pipeline with five extraction backends:

```typescript
import { performOCR } from '@framers/agentos';

const result = await performOCR({
  image: buffer,
  providers: ['paddleocr', 'trocr', 'florence-2', 'clip'],
  cloudFallback: true, // Use cloud vision API if local providers fail
});
```

Every multimodal API wraps execution in OTel spans (`agentos.api.generate_video`, `agentos.api.generate_music`, etc.) for distributed tracing.

---

<a name="provider-first"></a>

## Provider-First: 16 LLMs, Zero Lock-In

AgentOS supports 16 LLM providers through a unified API. Credentials resolve from environment variables. The active provider auto-detects from what's available.

### Provider Defaults

```typescript
const PROVIDER_DEFAULTS = {
  openai: {
    text: 'gpt-4o',
    image: 'gpt-image-1',
    embedding: 'text-embedding-3-small',
    cheap: 'gpt-4o-mini',
  },
  anthropic: { text: 'claude-sonnet-4-20250514', cheap: 'claude-haiku-4-5-20251001' },
  gemini: { text: 'gemini-2.5-flash', cheap: 'gemini-2.0-flash' },
  ollama: {
    text: 'llama3.2',
    image: 'stable-diffusion',
    embedding: 'nomic-embed-text',
    cheap: 'llama3.2',
  },
  openrouter: { text: 'openai/gpt-4o', cheap: 'openai/gpt-4o-mini' },
  groq: { text: 'llama-3.3-70b-versatile', cheap: 'gemma2-9b-it' },
  together: {
    text: 'Meta-Llama-3.1-70B-Instruct-Turbo',
    cheap: 'Meta-Llama-3.1-8B-Instruct-Turbo',
  },
  mistral: { text: 'mistral-large-latest', cheap: 'mistral-small-latest' },
  xai: { text: 'grok-2', cheap: 'grok-2-mini' },
  // CLI providers (use local Claude/Gemini installations)
  'claude-code-cli': { text: 'claude-sonnet-4-20250514', cheap: 'claude-haiku-4-5-20251001' },
  'gemini-cli': { text: 'gemini-2.5-flash', cheap: 'gemini-2.0-flash-lite' },
  // Image-only providers
  stability: { image: 'stable-diffusion-xl-1024-v1-0' },
  replicate: { image: 'black-forest-labs/flux-1.1-pro' },
  bfl: { image: 'flux-pro-1.1' },
  fal: { image: 'fal-ai/flux/dev' },
  'stable-diffusion-local': { image: 'v1-5-pruned-emaonly' },
};
```

### Three-Tier Resolution

```
1. Explicit argument:  generateText({ model: 'gpt-4' })
2. Provider default:   generateText({ provider: 'openai' })  → gpt-4o
3. Auto-detect:        generateText({})  → scan env vars → best available
```

Auto-detection scans 16 probes in priority order. OpenRouter first because it provides automatic fallback across multiple downstream providers:

```typescript
const AUTO_DETECT_ORDER = [
  { envKey: 'OPENROUTER_API_KEY', provider: 'openrouter' },
  { envKey: 'OPENAI_API_KEY', provider: 'openai' },
  { envKey: 'ANTHROPIC_API_KEY', provider: 'anthropic' },
  { envKey: 'GEMINI_API_KEY', provider: 'gemini' },
  { envKey: 'GROQ_API_KEY', provider: 'groq' },
  // ...
  { binaryName: 'claude', provider: 'claude-code-cli' },
  { binaryName: 'gemini', provider: 'gemini-cli' },
  { envKey: 'OLLAMA_BASE_URL', provider: 'ollama' },
];
```

### CLI Provider Bridge

The `CLISubprocessBridge` enables using local CLI installations of Claude and Gemini as LLM providers. `claude-code-cli` uses your local Claude Code installation. `gemini-cli` uses your Google account through the Gemini CLI. No API key required for either, they authenticate through their respective CLI auth flows.

### Unified API

```typescript
import { generateText, streamText, generateImage } from '@framers/agentos';

// Explicit
const result = await generateText({
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',
  messages: [{ role: 'user', content: 'Hello' }],
});

// Provider default
const stream = streamText({ provider: 'openai', messages: [{ role: 'user', content: 'Hello' }] });

// Auto-detect
const auto = await generateText({ messages: [{ role: 'user', content: 'Hello' }] });

// Image generation
const image = await generateImage({
  provider: 'bfl',
  prompt: 'A futuristic city at sunset',
  size: '1024x1024',
});
```

---

<a name="patterns-worth-stealing"></a>

## Patterns Worth Stealing

Six patterns appear throughout the codebase. Each one is independently useful.

### 1. AsyncGenerator for Streaming

Yield chunks for real-time UX. Return a final aggregate.

```typescript
public async *process(input: Input): AsyncGenerator<Chunk, Final, undefined> {
  let aggregate = initialState;
  try {
    for await (const chunk of sourceStream) {
      aggregate = updateAggregate(aggregate, chunk);
      yield chunk;
    }
    return buildFinalOutput(aggregate);
  } finally {
    cleanup();
  }
}
```

### 2. Push-Pull Bridge

Adapt event-driven push to sequential pull.

```typescript
class Bridge<T> {
  private queue: T[] = [];
  private resolve?: (value: IteratorResult<T>) => void;
  private done = false;

  push(value: T): void {
    if (this.resolve) {
      this.resolve({ value, done: false });
      this.resolve = undefined;
    } else {
      this.queue.push(value);
    }
  }

  async *consume(): AsyncGenerator<T> {
    while (!this.done || this.queue.length > 0) {
      if (this.queue.length > 0) {
        yield this.queue.shift()!;
      } else {
        yield await new Promise<T>((r) => {
          this.resolve = (result) => r(result.value);
        });
      }
    }
  }
}
```

### 3. Registry with Hot Reload

Type-safe, event-driven component registration:

```typescript
export class TypedRegistry<T> {
  private descriptors = new Map<string, ExtensionDescriptor<T>>();
  private activeIds = new Set<string>();

  async register(descriptor: ExtensionDescriptor<T>, context: Context): Promise<void> {
    this.descriptors.set(descriptor.id, descriptor);
    this.activeIds.add(descriptor.id);
    if (descriptor.onActivate) await descriptor.onActivate(context);
    this.eventEmitter.emit('descriptor:activated', { descriptor });
  }
}
```

### 4. State Machine for Lifecycle

Explicit transitions prevent invalid operations:

```typescript
class StatefulComponent {
  private state: ComponentState = ComponentState.IDLE;

  private ensureState(...allowed: ComponentState[]): void {
    if (!allowed.includes(this.state)) {
      throw new Error(`Not allowed in state ${this.state}. Allowed: ${allowed.join(', ')}`);
    }
  }

  async process(input: Input): Promise<Output> {
    this.ensureState(ComponentState.READY);
    this.state = ComponentState.PROCESSING;
    try {
      const result = await this.doProcess(input);
      this.state = ComponentState.READY;
      return result;
    } catch (error) {
      this.state = ComponentState.ERRORED;
      throw error;
    }
  }
}
```

### 5. Config-Based Dependency Injection

Pass everything through configuration objects. Testable. Flexible. Explicit.

```typescript
interface ComponentConfig {
  dependency1: Dependency1;
  dependency2: Dependency2;
  dependency3?: Dependency3;
  settings: { timeout: number; maxRetries: number };
}

class Component {
  async initialize(config: ComponentConfig): Promise<void> {
    this.validateConfig(config);
    this.settings = Object.freeze({ ...config.settings });
  }
}
```

### 6. Error Wrapping with Context

Preserve the chain while adding context at each layer:

```typescript
export class DomainError extends Error {
  static wrap(error: any, code: string, message: string): DomainError {
    return new DomainError(
      `${message}: ${error.message}`,
      code,
      error instanceof DomainError ? error.details : undefined,
      error
    );
  }
}
```

---

<a name="lessons-learned"></a>

## What Worked, What Didn't, What's Next

### What Worked

**Streaming architecture.** Users see tokens immediately. The AsyncGenerator + push-pull bridge combo was tricky to build but now supports HTTP, WebSockets, and SSE from a single codebase. Would not change this.

**HEXACO personality system.** Decades of personality psychology research gave us a framework that maps cleanly to LLM behavior. Users consistently describe interactions as "human-like." Domain expertise matters.

**Three-layer security.** Pattern classifier + LLM auditor + cryptographic signing. All three layers have caught real attacks in production that single-layer systems would have missed.

**Extension system.** Plugin architecture from day one. We add tools, guardrails, and workflows without touching core code. Event-driven activation enables zero-downtime updates.

**Progressive vector scaling.** SQLite → HNSW sidecar → Qdrant/Postgres. Zero configuration for the first 100K vectors. Projects grow organically without rewrites.

**Emergent capability engine.** Agents that can forge their own tools at runtime, guarded by judge evaluation and sandboxed execution. This was the most recent addition and already the most impactful, agents solve novel problems without requiring predefined tool catalogs.

### What Hurt

**AsyncGenerator debugging.** Push vs pull semantics are hard to reason about. New engineers find the bridge classes confusing. Extensive logging and state tracking help, but there's a genuine learning curve.

**Multi-agent state sharing.** GMIs are isolated for safety, but multi-agent workflows need shared context. The AgentCommunicationBus works for most cases, but complex workflows can hit race conditions. Considering CRDT-based shared memory.

**Token cost management.** Reduced costs 60-80% through hierarchical routing, conditional RAG, and multi-level caching. Still expensive for power users. Cost optimization is never done.

**LLM output parsing.** Two-stage approach (try parse → LLM fix → retry) works 95%+ of the time. The remaining 5% still bites occasionally.

**Multi-turn tool loops.** Hard cap of 5 iterations prevents infinite loops but sometimes cuts off legitimate multi-step reasoning. Need smarter detection (same tool + same args → break).

### Key Tradeoffs

**At-most-once message delivery** over exactly-once for agent communication. Exactly-once requires distributed transactions. Agent communication is usually idempotent. Simplicity wins.

**FIFO context eviction** over importance-based scoring. FIFO is simple, predictable, fast. Importance scoring costs an LLM call per message. Considering a hybrid: FIFO first pass, importance-based rescue for highly-relevant messages.

**Pattern-based PII detection** over ML-based NER. Sub-millisecond, deterministic, free. Catches 90%+ in practice. ML-based NER could be Layer 2 for high-security tenants.

### What's Next

**Graph-based memory**, now implemented via GraphRAG + Neo4j. Entity-relationship storage enables multi-hop reasoning that flat embeddings can't support.

**Adaptive context windows**, dynamic sizing based on conversation importance, model limits, user engagement, and cost constraints. Beyond FIFO.

**Federated learning across agents**, share learned patterns (privacy-preserving) without sharing data. Faster adaptation. Cross-user generalization.

**Automatic prompt optimization**, RL-based A/B testing of prompt variations. Learn what works for each persona. Optimize for helpfulness, safety, and cost simultaneously.

### Performance Numbers

**Single GMI throughput**: 10-50 req/min depending on model (GPT-4: ~10, Claude 3 Haiku: ~50, Llama 3.2 local: ~30). Linear horizontal scaling, 10 instances = 100-500 req/min.

**First token latency**: OpenAI GPT-4 400-800ms, Anthropic Claude 300-600ms, Ollama local 200-500ms.

**End-to-end turn time**: Simple query (no tools) 2-5s. With 1-2 tool calls 5-15s. Complex multi-step 15-60s.

**Memory per GMI**: Baseline 50MB, with 100-message history 100-150MB, with large RAG context 200-300MB.

**Vector store**: 1K docs 1-2MB, 10K docs 10-20MB, 100K docs 100-200MB. Query time 10-100ms depending on backend.

### Monitoring

Track these: request throughput, latency percentiles (p50/p95/p99), error rate by type, token usage by model and persona, tool execution time, cache hit rates, cost per request.

Alert on: error rate > 1%, p95 latency > 30s, token usage spike > 2x baseline, cache hit rate < 50%, database connections > 80% of pool.

---

## Wrapping Up

Production AI agents require far more than connecting an LLM to an API.

Safety demands defense in depth. Memory demands more than flat embeddings. Extensibility demands plugin architecture from day one. Cost demands continuous optimization. Voice demands real-time streaming throughout the entire stack. And increasingly, agents need the ability to create their own capabilities when existing tools fall short.

AgentOS is a living system. We learn from every deployment. We iterate on every subsystem. This deep dive covers the architecture as it stands today, but the codebase moves fast. Check the source for the latest.

---

_This post analyzes real production code from the AgentOS platform. All code examples are drawn from actual implementation files with line-number references for verification._
