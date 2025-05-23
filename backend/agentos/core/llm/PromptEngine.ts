// File: backend/agentos/core/llm/PromptEngine.ts

/**
 * @fileoverview Implements the sophisticated PromptEngine that serves as the core of
 * AgentOS's adaptive and contextual prompting system. This implementation provides
 * intelligent prompt construction with dynamic contextual element selection,
 * token budgeting, multi-modal content integration, and optimization strategies.
 *
 * The PromptEngine orchestrates the entire prompt construction pipeline:
 * 1. Context Analysis: Evaluates execution context against persona-defined criteria.
 * 2. Element Selection: Dynamically selects applicable contextual prompt elements.
 * 3. Content Augmentation: Integrates selected elements with base prompt components.
 * 4. Token Management: Applies intelligent budgeting and content optimization.
 * 5. Template Formatting: Renders final prompts using model-specific templates.
 * 6. Quality Assurance: Validates output and reports issues/optimizations.
 *
 * @module backend/agentos/core/llm/PromptEngine
 * @implements {IPromptEngine}
 */

import {
  IPromptEngine,
  PromptEngineConfig,
  PromptComponents,
  ModelTargetInfo,
  PromptExecutionContext,
  FormattedPrompt,
  PromptEngineResult,
  PromptTemplateFunction,
  ContextualElementType, // Ensure this is correctly imported
  PromptEngineError,
  IPromptEngineUtilityAI, // Using the focused utility AI for prompt engine
  TokenEstimator,
} from './IPromptEngine';
import {
  IPersonaDefinition,
  ContextualPromptElement,
  ContextualPromptElementCriteria,
} from '../../cognitive_substrate/personas/IPersonaDefinition';
import { Message, MessageRole } from '../conversation/ConversationMessage';
import { ChatMessage } from './providers/IProvider';
import { ITool } from '../../tools/interfaces/ITool'; // Assuming this path is correct
// VisionInputData, AudioInputData are also used but might come from IGMI or similar
// For simplicity, if they are just data structures, they can be defined locally or imported.
// Let's assume they are available via IPromptEngine.ts's imports if not directly here.


/**
 * Cache entry structure for optimization and performance tracking.
 * @interface CacheEntry
 * @private
 */
interface CacheEntry {
  key: string;
  result: PromptEngineResult;
  timestamp: number;
  accessCount: number;
  modelId: string;
  estimatedTokenCount: number; // Store what was estimated at time of caching
}

/**
 * Statistics tracking for performance monitoring and optimization.
 * @interface EngineStatisticsInternal
 * @private
 */
interface EngineStatisticsInternal {
  totalPromptsConstructed: number;
  totalConstructionTimeMs: number;
  cacheHits: number;
  cacheMisses: number;
  contextualElementSelections: Record<string, number>; // elementId or type -> count
  tokenCountingOperations: number;
  errorsByType: Record<string, number>; // errorCode -> count
  performanceTimers: Record<string, { count: number; totalTimeMs: number }>; // operationName -> stats
}


/**
 * Comprehensive implementation of the IPromptEngine interface, providing
 * sophisticated adaptive prompting capabilities for AgentOS GMIs.
 *
 * @class PromptEngine
 * @implements {IPromptEngine}
 */
export class PromptEngine implements IPromptEngine {
  private config!: Readonly<PromptEngineConfig>; // To be set in initialize
  private utilityAI?: IPromptEngineUtilityAI;
  private isInitialized: boolean = false;

  private cache: Map<string, CacheEntry> = new Map();
  private statistics: EngineStatisticsInternal = this.getInitialStatistics();

  // Default prompt templates, can be overridden/extended by config.
  private readonly defaultTemplates: Record<string, PromptTemplateFunction>;

  /**
   * Constructs a new PromptEngine instance.
   * The engine is not operational until `initialize()` is called.
   */
  constructor() {
    this.defaultTemplates = {
      'openai_chat': this.createOpenAIChatTemplate(),
      'anthropic_messages': this.createAnthropicMessagesTemplate(),
      'generic_completion': this.createGenericCompletionTemplate(),
      // Add more default templates as needed
    };
  }

  /** @inheritdoc */
  public async initialize(
    config: PromptEngineConfig,
    utilityAI?: IPromptEngineUtilityAI
  ): Promise<void> {
    if (this.isInitialized) {
      console.warn('PromptEngine: Re-initializing an already initialized engine. State will be reset.');
      this.cache.clear();
      this.statistics = this.getInitialStatistics();
    }

    this.validateEngineConfiguration(config); // Internal validation

    this.config = Object.freeze({ ...config }); // Make config immutable after init
    this.utilityAI = utilityAI;

    // Merge default templates with user-provided templates, user templates override defaults.
    this.config = Object.freeze({
        ...this.config,
        availableTemplates: {
            ...this.defaultTemplates,
            ...(config.availableTemplates || {}),
        }
    });


    if (this.config.performance.enableCaching) {
      this.setupCacheEviction();
    }

    this.isInitialized = true;
    console.log(`PromptEngine initialized successfully. Default template: '${this.config.defaultTemplateName}'. Available templates: ${Object.keys(this.config.availableTemplates).length}.`);
  }

  /**
   * Ensures the engine has been properly initialized before any operations.
   * @private
   * @throws {PromptEngineError} If the engine is not initialized.
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new PromptEngineError(
        'PromptEngine is not initialized. Call initialize() first.',
        'ENGINE_NOT_INITIALIZED',
        'PromptEngineCore'
      );
    }
  }

  /**
   * Resets internal statistics.
   * @private
   */
  private getInitialStatistics(): EngineStatisticsInternal {
    return {
      totalPromptsConstructed: 0,
      totalConstructionTimeMs: 0,
      cacheHits: 0,
      cacheMisses: 0,
      contextualElementSelections: {},
      tokenCountingOperations: 0,
      errorsByType: {},
      performanceTimers: {},
    };
  }

  /** @inheritdoc */
  public async constructPrompt(
    baseComponents: Readonly<PromptComponents>,
    modelTargetInfo: Readonly<ModelTargetInfo>,
    executionContext?: Readonly<PromptExecutionContext>,
    templateName?: string
  ): Promise<PromptEngineResult> {
    this.ensureInitialized();
    const constructionStart = Date.now();
    this.statistics.totalPromptsConstructed++;

    const result: PromptEngineResult = {
      prompt: [], // Default to ChatMessage[] for common case
      wasTruncatedOrSummarized: false,
      issues: [],
      metadata: {
        constructionTimeMs: 0,
        selectedContextualElementIds: [],
        templateUsed: templateName || modelTargetInfo.promptFormatType || this.config.defaultTemplateName,
        totalSystemPromptsApplied: 0,
        historyMessagesIncluded: 0,
      },
    };

    // 1. Cache Check
    if (this.config.performance.enableCaching) {
      const cacheKey = this.generateCacheKey(baseComponents, modelTargetInfo, executionContext, result.metadata.templateUsed);
      result.cacheKey = cacheKey;
      const cached = this.cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < this.config.performance.cacheTimeoutSeconds * 1000) {
        this.statistics.cacheHits++;
        cached.accessCount++;
        // Return a deep copy of the cached result to prevent mutation
        return JSON.parse(JSON.stringify(cached.result));
      }
      this.statistics.cacheMisses++;
    }

    try {
      // 2. Contextual Element Selection
      let selectedElements: ContextualPromptElement[] = [];
      if (executionContext?.activePersona?.promptConfig?.contextualElements) {
        const timerId = 'contextualElementSelection';
        this.startPerformanceTimer(timerId);
        for (const element of executionContext.activePersona.promptConfig.contextualElements) {
          if (element.criteria && await this.evaluateCriteria(element.criteria, executionContext)) {
            selectedElements.push(element);
          }
        }
        // TODO: Add prioritization and maxElementsPerType logic here based on config
        selectedElements.sort((a,b) => (b.priority || 0) - (a.priority || 0)); // Simple priority sort
        const maxElementsOverall = 10; // Example: make this configurable
        selectedElements = selectedElements.slice(0, maxElementsOverall);

        result.metadata.selectedContextualElementIds = selectedElements.map(el => el.id || 'unnamed_contextual_element');
        this.recordPerformanceTimer(timerId);
        selectedElements.forEach(el => this.statistics.contextualElementSelections[el.id || el.type] = (this.statistics.contextualElementSelections[el.id || el.type] || 0) + 1);
      }

      // 3. Augment Base Components
      const augmentedComponents = this.augmentBaseComponents(baseComponents, selectedElements);

      // 4. Token Budgeting & Content Optimization
      // This is a complex step. For this implementation, we'll focus on the structure
      // and assume `utilityAI` can handle summarization if needed.
      // A more detailed token budgeter would iterate and selectively reduce components.
      const timerIdBudget = 'tokenBudgeting';
      this.startPerformanceTimer(timerIdBudget);
      const { optimizedComponents, modifications } = await this.applyTokenBudget(
        augmentedComponents,
        modelTargetInfo,
        result.issues || [] // Pass issues array to append to
      );
      result.wasTruncatedOrSummarized = modifications.wasModified;
      result.modificationDetails = modifications.details;
      this.recordPerformanceTimer(timerIdBudget);


      // 5. Template Application
      const timerIdTemplate = 'templateApplication';
      this.startPerformanceTimer(timerIdTemplate);
      const templateFn = this.config.availableTemplates[result.metadata.templateUsed];
      if (!templateFn) {
        throw new PromptEngineError(`Template '${result.metadata.templateUsed}' not found.`, 'TEMPLATE_NOT_FOUND', 'TemplateApplication');
      }
      result.prompt = await templateFn(
        optimizedComponents,
        modelTargetInfo,
        selectedElements, // Pass selected elements for template's direct use if needed
        this.config,
        (content, modelId) => this.estimateTokenCount(content, modelId || modelTargetInfo.modelId) // Pass estimateTokenCount
      );
      this.recordPerformanceTimer(timerIdTemplate);

      // 6. Final Token Count (more precise if possible, or re-estimate on final structure)
      result.estimatedTokenCount = await this.estimateTokenCount(
        typeof result.prompt === 'string' ? result.prompt : JSON.stringify(result.prompt), // Simplistic for object/array prompts
        modelTargetInfo.modelId
      );
      // TODO: If a precise tokenizer is available, use it here for `result.tokenCount`.

      result.metadata.totalSystemPromptsApplied = optimizedComponents.systemPrompts?.length || 0;
      result.metadata.historyMessagesIncluded = optimizedComponents.conversationHistory?.length || 0;
      if(optimizedComponents.retrievedContext){
        result.metadata.ragContextTokensUsed = await this.estimateTokenCount(
            typeof optimizedComponents.retrievedContext === 'string' ? optimizedComponents.retrievedContext : JSON.stringify(optimizedComponents.retrievedContext),
            modelTargetInfo.modelId
        );
      }

      // Format tool schemas if tools are present and model supports them
      if (optimizedComponents.tools && optimizedComponents.tools.length > 0 && modelTargetInfo.toolSupport.supported) {
          result.formattedToolSchemas = this.formatToolSchemasForModel(optimizedComponents.tools, modelTargetInfo);
      }


    } catch (error: unknown) {
      const err = (error instanceof PromptEngineError) ? error :
        new PromptEngineError(
          error instanceof Error ? error.message : 'Unknown error during prompt construction.',
          'UNHANDLED_CONSTRUCTION_ERROR',
          'ConstructPromptCore',
          error
        );
      result.issues = result.issues || [];
      result.issues.push({
        type: 'error',
        code: err.code,
        message: err.message,
        details: err.details,
        component: err.component || 'ConstructPromptPipeline',
      });
      this.statistics.errorsByType[err.code] = (this.statistics.errorsByType[err.code] || 0) + 1;
      // No re-throw here, result object will carry the error.
    } finally {
      result.metadata.constructionTimeMs = Date.now() - constructionStart;
      this.statistics.totalConstructionTimeMs += result.metadata.constructionTimeMs;
    }

    if (result.cacheKey && this.config.performance.enableCaching && (result.issues?.every(i => i.type !== 'error'))) {
      this.cache.set(result.cacheKey, {
        key: result.cacheKey,
        result: JSON.parse(JSON.stringify(result)), // Deep copy
        timestamp: Date.now(),
        accessCount: 0,
        modelId: modelTargetInfo.modelId,
        estimatedTokenCount: result.estimatedTokenCount || 0,
      });
    }
    return result;
  }


  /** @inheritdoc */
  public async evaluateCriteria(
    criteria: Readonly<ContextualPromptElementCriteria>,
    context: Readonly<PromptExecutionContext>
  ): Promise<boolean> {
    this.ensureInitialized();
    const timerId = 'evaluateCriteria';
    this.startPerformanceTimer(timerId);

    // This is a simplified evaluation. A full implementation would involve:
    // - Parsing complex criteria (AND/OR/NOT groups).
    // - Querying workingMemory using `criteria.workingMemoryQuery`.
    // - Handling `criteria.complexCondition` (e.g., via a small embedded script or predefined functions).
    let overallMatch = true; // Assuming AND logic for top-level simple fields for this example.

    if (criteria.mood && context.currentMood !== criteria.mood) overallMatch = false;
    if (overallMatch && criteria.userSkillLevel && context.userSkillLevel !== criteria.userSkillLevel) overallMatch = false;
    if (overallMatch && criteria.taskHint && !context.taskHint?.includes(criteria.taskHint)) overallMatch = false; // Partial match for hint
    if (overallMatch && criteria.taskComplexity && context.taskComplexity !== criteria.taskComplexity) overallMatch = false;
    if (overallMatch && criteria.language && context.language !== criteria.language) overallMatch = false;

    if (overallMatch && criteria.conversationSignals && criteria.conversationSignals.length > 0) {
      if (!criteria.conversationSignals.every(s => context.conversationSignals?.includes(s))) {
        overallMatch = false;
      }
    }
    // Placeholder for workingMemoryQuery
    if (overallMatch && criteria.workingMemoryQuery) {
        // Example: const value = await context.workingMemory.get(criteria.workingMemoryQuery.key);
        // if (value !== criteria.workingMemoryQuery.expectedValue) overallMatch = false;
        console.warn("Working memory query evaluation in PromptEngine is a placeholder.");
    }

    this.recordPerformanceTimer(timerId);
    return overallMatch;
  }


  /** @inheritdoc */
  public async estimateTokenCount(content: string, modelId?: string): Promise<number> {
    this.ensureInitialized();
    this.statistics.tokenCountingOperations++;
    const timerId = 'estimateTokenCount';
    this.startPerformanceTimer(timerId);

    if (!content) return 0;
    // Simple estimation: average 4 chars per token, common for English.
    // A more sophisticated version would use a tokenizer library like tiktoken
    // or call a model-specific tokenization endpoint if available.
    // For now, using a rough character-based heuristic.
    let count = Math.ceil(content.length / 4);

    // Slightly adjust for specific known models if needed (very rough)
    if (modelId?.includes('gpt-4')) count = Math.ceil(content.length / 3.8);
    else if (modelId?.includes('claude')) count = Math.ceil(content.length / 4.2);

    this.recordPerformanceTimer(timerId);
    return count;
  }

  /** @inheritdoc */
  public async registerTemplate(
    templateName: string,
    templateFunction: PromptTemplateFunction
  ): Promise<void> {
    this.ensureInitialized();
    if (!templateName || typeof templateName !== 'string' || templateName.trim() === '') {
      throw new PromptEngineError('Template name must be a non-empty string.', 'INVALID_TEMPLATE_NAME', 'RegisterTemplate');
    }
    if (typeof templateFunction !== 'function') {
      throw new PromptEngineError('Template function must be a valid function.', 'INVALID_TEMPLATE_FUNCTION', 'RegisterTemplate');
    }

    const mutableTemplates = this.config.availableTemplates as Record<string, PromptTemplateFunction>;
    if (mutableTemplates[templateName]) {
      console.warn(`PromptEngine: Overwriting existing template '${templateName}'.`);
    }
    mutableTemplates[templateName] = templateFunction;
    // Re-freeze if config was deeply frozen, or manage templates separately.
    // For simplicity here, we assume availableTemplates can be updated post-init.
    console.log(`PromptEngine: Template '${templateName}' registered.`);
  }

  /** @inheritdoc */
  public async validatePromptConfiguration(
    components: Readonly<PromptComponents>,
    modelTargetInfo: Readonly<ModelTargetInfo>,
    executionContext?: Readonly<PromptExecutionContext> // Added executionContext to allow context-aware validation
  ): Promise<{
    isValid: boolean;
    issues: Array<{ type: 'error' | 'warning'; code: string; message: string; suggestion?: string; component?: string; }>;
    recommendations?: string[];
  }> {
    this.ensureInitialized();
    const issues: Array<{ type: 'error' | 'warning'; code: string; message: string; suggestion?: string; component?: string;}> = [];
    const recommendations: string[] = [];

    // Check for model compatibility with provided components
    if (components.visionInputs && components.visionInputs.length > 0 && !modelTargetInfo.visionSupport?.supported) {
      issues.push({ type: 'error', code: 'VISION_NOT_SUPPORTED', message: `Model ${modelTargetInfo.modelId} does not support vision inputs.`, component: 'visionInputs' });
    }
    if (components.tools && components.tools.length > 0 && !modelTargetInfo.toolSupport.supported) {
      issues.push({ type: 'error', code: 'TOOLS_NOT_SUPPORTED', message: `Model ${modelTargetInfo.modelId} does not support tools/functions.`, component: 'tools' });
    }

    // Basic token check (very rough estimate for validation purposes)
    let estimatedTokens = 0;
    if (components.systemPrompts) estimatedTokens += (await Promise.all(components.systemPrompts.map(sp => this.estimateTokenCount(sp.content, modelTargetInfo.modelId)))).reduce((a,b) => a+b, 0);
    if (components.userInput) estimatedTokens += await this.estimateTokenCount(components.userInput, modelTargetInfo.modelId);
    if (components.conversationHistory) estimatedTokens += (await Promise.all(components.conversationHistory.map(msg => this.estimateTokenCount(typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content) , modelTargetInfo.modelId)))).reduce((a,b) => a+b, 0);

    if (estimatedTokens > modelTargetInfo.maxContextTokens) {
      issues.push({ type: 'warning', code: 'POTENTIAL_TOKEN_OVERFLOW', message: `Estimated initial token count (${estimatedTokens}) exceeds model's max context (${modelTargetInfo.maxContextTokens}). Relying on truncation/summarization.`, component: 'OverallPrompt' });
    } else if (estimatedTokens > (modelTargetInfo.optimalContextTokens || modelTargetInfo.maxContextTokens) * 0.8) {
      recommendations.push(`Consider reducing initial prompt length; current estimate (${estimatedTokens}) is >80% of optimal/max context.`);
    }

    if (!components.systemPrompts || components.systemPrompts.length === 0) {
      recommendations.push("Consider adding a system prompt to guide the GMI's behavior more effectively.");
    }

    // Validate contextual elements if executionContext and persona are provided
    if (executionContext?.activePersona?.promptConfig?.contextualElements) {
        // This could involve checking if criteria reference valid working memory keys, etc.
        recommendations.push("Review persona's contextual elements to ensure they align with expected execution contexts.");
    }


    return { isValid: !issues.some(i => i.type === 'error'), issues, recommendations };
  }


  /** @inheritdoc */
  public async clearCache(selectivePattern?: string): Promise<void> {
    this.ensureInitialized();
    if (!this.config.performance.enableCaching) {
      console.warn("PromptEngine: Cache clearing attempted but caching is disabled.");
      return;
    }
    if (selectivePattern) {
      let clearedCount = 0;
      const regex = new RegExp(selectivePattern); // Basic regex matching
      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          this.cache.delete(key);
          clearedCount++;
        }
      }
      console.log(`PromptEngine: Cleared ${clearedCount} cache entries matching pattern '${selectivePattern}'.`);
    } else {
      this.cache.clear();
      console.log("PromptEngine: All cache entries cleared.");
    }
    this.statistics.cacheHits = 0; // Reset hit/miss on full clear
    this.statistics.cacheMisses = 0;
  }

  /** @inheritdoc */
  public async getEngineStatistics(): Promise<{
    totalPromptsConstructed: number;
    averageConstructionTimeMs: number;
    cacheStats: { hits: number; misses: number; currentSize: number; maxSize?: number; effectivenessRatio: number; };
    tokenCountingStats: { operations: number; averageAccuracy?: number; };
    contextualElementUsage: Record<string, { count: number; averageEvaluationTimeMs?: number; }>;
    errorRatePerType: Record<string, number>;
    performanceTimers: Record<string, { count: number; totalTimeMs: number; averageTimeMs: number; }>;
  }> {
    this.ensureInitialized();
    const totalCacheAccesses = this.statistics.cacheHits + this.statistics.cacheMisses;
    const cacheEffectiveness = totalCacheAccesses > 0 ? this.statistics.cacheHits / totalCacheAccesses : 0;

    const contextualElementUsageWithAvgTime: Record<string, { count: number; averageEvaluationTimeMs?: number; }> = {};
    for(const key in this.statistics.contextualElementSelections) {
        contextualElementUsageWithAvgTime[key] = {
            count: this.statistics.contextualElementSelections[key],
            // averageEvaluationTimeMs could be tracked if evaluateCriteria is timed per element type/id
        };
    }

    return {
      totalPromptsConstructed: this.statistics.totalPromptsConstructed,
      averageConstructionTimeMs: this.statistics.totalPromptsConstructed > 0 ? this.statistics.totalConstructionTimeMs / this.statistics.totalPromptsConstructed : 0,
      cacheStats: {
        hits: this.statistics.cacheHits,
        misses: this.statistics.cacheMisses,
        currentSize: this.cache.size,
        maxSize: this.config.performance.maxCacheSizeBytes, // Note: this was 'maxCacheSizeBytes' in config, might be num entries
        effectivenessRatio: cacheEffectiveness,
      },
      tokenCountingStats: {
        operations: this.statistics.tokenCountingOperations,
        // averageAccuracy would require ground truth for token counts, hard to implement generally here.
      },
      contextualElementUsage: contextualElementUsageWithAvgTime,
      errorRatePerType: { ...this.statistics.errorsByType },
      performanceTimers: { ...this.statistics.performanceTimers },
    };
  }


  // --- Private Helper Methods ---

  private validateEngineConfiguration(config: PromptEngineConfig): void {
    if (!config.defaultTemplateName || typeof config.defaultTemplateName !== 'string') {
      throw new PromptEngineError('Invalid `defaultTemplateName` in configuration.', 'INVALID_CONFIG_PARAM', 'Initialization');
    }
    if (!config.availableTemplates || typeof config.availableTemplates !== 'object') {
      throw new PromptEngineError('Invalid `availableTemplates` in configuration.', 'INVALID_CONFIG_PARAM', 'Initialization');
    }
    if (!config.tokenCounting || typeof config.tokenCounting.strategy !== 'string') {
      throw new PromptEngineError('Invalid `tokenCounting` strategy in configuration.', 'INVALID_CONFIG_PARAM', 'Initialization');
    }
    // ... more exhaustive validation of config properties
  }

  private generateCacheKey(
    components: Readonly<PromptComponents>,
    modelInfo: Readonly<ModelTargetInfo>,
    executionContext?: Readonly<PromptExecutionContext>,
    templateName?: string
  ): string {
    // A more robust hashing function than simple JSON.stringify would be used in production
    // (e.g., crypto hash like SHA256) to ensure uniqueness and manage key length.
    // For this example, a simplified key generation:
    const relevantData = {
      system: components.systemPrompts?.map(p => p.content.substring(0,50)).join(';'), // Preview
      userInput: components.userInput?.substring(0,100),
      historyLastTurn: components.conversationHistory?.[components.conversationHistory.length -1]?.content?.toString().substring(0,50),
      tools: components.tools?.map(t => t.id).join(','),
      modelId: modelInfo.modelId,
      template: templateName,
      personaId: executionContext?.activePersona.id,
      mood: executionContext?.currentMood,
      task: executionContext?.taskHint,
    };
    const keyString = Object.values(relevantData).filter(v => v !== undefined).join('||');
    // Simple hash (not cryptographically secure, just for cache key variety)
    let hash = 0;
    for (let i = 0; i < keyString.length; i++) {
      const char = keyString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `promptcache:${modelInfo.modelId}:${hash.toString(36)}`;
  }

  private setupCacheEviction(): void {
    // Basic interval-based eviction. More sophisticated LRU/LFU could be used.
    const interval = (this.config.performance.cacheTimeoutSeconds / 2) * 1000; // Check halfway through timeout
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if ((now - entry.timestamp) > this.config.performance.cacheTimeoutSeconds * 1000) {
          this.cache.delete(key);
        }
      }
    }, Math.max(interval, 60000)); // Don't run too frequently
  }

  private startPerformanceTimer(timerId: string): void {
    if (!this.statistics.performanceTimers[timerId]) {
      this.statistics.performanceTimers[timerId] = { count: 0, totalTimeMs: 0, averageTimeMs: 0 };
    }
    // Store start time associated with timerId, perhaps in a temporary map if nesting is needed
    // For simplicity, assume direct recording at end for now.
  }

  private recordPerformanceTimer(timerId: string, durationMs?: number): void {
    // This would require `startTime` to be passed or stored if `durationMs` isn't provided.
    // Simplified: Assume duration is calculated before calling this.
    // For a real implementation, you'd likely use `performance.now()` or `process.hrtime()`
    // const duration = durationMs || (Date.now() - (this._timerStartMap.get(timerId) || Date.now()));
    // this._timerStartMap.delete(timerId);

    // This is a placeholder as simple duration passing isn't robust for async operations.
    // In a real scenario, you'd manage start times more carefully or use a perf library.
    // For now, we'll just increment count and add a dummy time if not provided.
    const DUMMY_DURATION = 10; // ms
    const actualDuration = durationMs !== undefined ? durationMs : DUMMY_DURATION;

    const timer = this.statistics.performanceTimers[timerId];
    if(timer){
        timer.count++;
        timer.totalTimeMs += actualDuration;
        timer.averageTimeMs = timer.totalTimeMs / timer.count;
    }
  }

  /** Augments base prompt components with dynamically selected contextual elements. */
  private augmentBaseComponents(
    base: Readonly<PromptComponents>,
    selectedElements: ReadonlyArray<ContextualPromptElement>
  ): PromptComponents {
    const augmented = JSON.parse(JSON.stringify(base)) as PromptComponents; // Deep clone

    if (!augmented.systemPrompts) augmented.systemPrompts = [];
    if (!augmented.customComponents) augmented.customComponents = {};

    for (const element of selectedElements) {
      switch (element.type) {
        case ContextualElementType.SYSTEM_INSTRUCTION_ADDON:
        case ContextualElementType.BEHAVIORAL_GUIDANCE:
        case ContextualElementType.TASK_SPECIFIC_INSTRUCTION:
        case ContextualElementType.ERROR_HANDLING_GUIDANCE:
        case ContextualElementType.ETHICAL_GUIDELINE:
        case ContextualElementType.OUTPUT_FORMAT_SPEC:
        case ContextualElementType.REASONING_PROTOCOL:
          augmented.systemPrompts.push({ content: element.content, priority: element.priority || 100, source: `contextual:${element.id || element.type}` });
          break;
        case ContextualElementType.FEW_SHOT_EXAMPLE:
          if (!augmented.customComponents.fewShotExamples) augmented.customComponents.fewShotExamples = [];
          (augmented.customComponents.fewShotExamples as unknown[]).push(element.content); // Assuming content is structured example
          break;
        case ContextualElementType.USER_PROMPT_AUGMENTATION:
           augmented.userInput = `${augmented.userInput || ''}\n${element.content}`.trim();
           break;
        // Other types can be added to customComponents for template access
        default:
          const typeKey = element.type.toString().toLowerCase().replace(/_/g, '');
          if (!augmented.customComponents[typeKey]) augmented.customComponents[typeKey] = [];
          (augmented.customComponents[typeKey] as unknown[]).push(element.content);
          break;
      }
    }
    // Re-sort system prompts by priority (lower number = higher priority = comes first)
    augmented.systemPrompts.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    return augmented;
  }

  /** Applies token budget by truncating or summarizing components. */
  private async applyTokenBudget(
    components: PromptComponents,
    modelInfo: Readonly<ModelTargetInfo>,
    issues: PromptEngineResult['issues']
  ): Promise<{ optimizedComponents: PromptComponents; modifications: { wasModified: boolean; details: PromptEngineResult['modificationDetails'] } }> {
    const optimized = JSON.parse(JSON.stringify(components)) as PromptComponents; // Deep clone
    const modifications: { wasModified: boolean; details: PromptEngineResult['modificationDetails'] } = {
        wasModified: false,
        details: { truncatedComponents: [], summarizedComponents: [], removedComponents: [], originalEstimatedTokenCount: 0 }
    };

    const budget = modelInfo.optimalContextTokens || modelInfo.maxContextTokens;
    let currentTokens = await this.calculateTotalTokens(optimized, modelInfo.modelId);
    modifications.details!.originalEstimatedTokenCount = currentTokens;

    const budgets = { // Example: allocate percentages of total budget
        system: 0.20 * budget,
        userInput: 0.15 * budget,
        history: 0.35 * budget,
        rag: 0.20 * budget,
        tools: 0.10 * budget, // Tools schema can be large
    };

    // 1. History (most flexible to reduce)
    if (optimized.conversationHistory && optimized.conversationHistory.length > 0) {
        let historyTokens = await this.calculateTokensForMessages(optimized.conversationHistory, modelInfo.modelId);
        if (historyTokens > budgets.history || currentTokens > budget) {
            const originalCount = optimized.conversationHistory.length;
            if (this.utilityAI && this.config.historyManagement.summarizationTriggerRatio > 0 && (historyTokens / budgets.history > this.config.historyManagement.summarizationTriggerRatio)) {
                try {
                    const { summaryMessages, finalTokenCount } = await this.utilityAI.summarizeConversationHistory(
                        optimized.conversationHistory,
                        (currentTokens > budget) ? budgets.history - (currentTokens - budget) : budgets.history,
                        modelInfo,
                        this.config.historyManagement.preserveImportantMessages
                    );
                    optimized.conversationHistory = summaryMessages;
                    modifications.details!.summarizedComponents!.push('conversationHistory');
                    modifications.wasModified = true;
                    currentTokens = currentTokens - historyTokens + finalTokenCount; // Update total
                    historyTokens = finalTokenCount;
                } catch (e) {
                    issues?.push({type: 'warning', code: 'HISTORY_SUMMARIZATION_FAILED', message: `History summarization failed: ${e instanceof Error ? e.message : String(e)}`});
                    // Fallback to truncation
                    optimized.conversationHistory = this.truncateMessages(optimized.conversationHistory, budgets.history, (content) => this.estimateTokenCount(content, modelInfo.modelId));
                    modifications.details!.truncatedComponents!.push('conversationHistory');
                    modifications.wasModified = true;
                    const newHistoryTokens = await this.calculateTokensForMessages(optimized.conversationHistory, modelInfo.modelId);
                    currentTokens = currentTokens - historyTokens + newHistoryTokens;
                    historyTokens = newHistoryTokens;
                }
            } else { // Truncate if no summarizer or ratio not met
                optimized.conversationHistory = this.truncateMessages(optimized.conversationHistory, budgets.history, (content) => this.estimateTokenCount(content, modelInfo.modelId));
                if(optimized.conversationHistory.length < originalCount) {
                    modifications.details!.truncatedComponents!.push('conversationHistory');
                    modifications.wasModified = true;
                }
                const newHistoryTokens = await this.calculateTokensForMessages(optimized.conversationHistory, modelInfo.modelId);
                currentTokens = currentTokens - historyTokens + newHistoryTokens;
                historyTokens = newHistoryTokens;
            }
        }
    }

    // 2. RAG Context
    if (optimized.retrievedContext) {
        const contextStr = typeof optimized.retrievedContext === 'string' ? optimized.retrievedContext : optimized.retrievedContext.map(r => r.content).join('\n');
        let ragTokens = await this.estimateTokenCount(contextStr, modelInfo.modelId);
        if (ragTokens > budgets.rag || currentTokens > budget) {
            if (this.utilityAI) {
                try {
                    const { summary, finalTokenCount } = await this.utilityAI.summarizeRAGContext(
                        optimized.retrievedContext,
                        (currentTokens > budget) ? budgets.rag - (currentTokens - budget) : budgets.rag,
                        modelInfo,
                        this.config.contextManagement.preserveSourceAttributionInSummary
                    );
                    optimized.retrievedContext = summary;
                    modifications.details!.summarizedComponents!.push('retrievedContext');
                    modifications.wasModified = true;
                    currentTokens = currentTokens - ragTokens + finalTokenCount;
                    ragTokens = finalTokenCount;
                } catch(e){
                     issues?.push({type: 'warning', code: 'RAG_SUMMARIZATION_FAILED', message: `RAG summarization failed: ${e instanceof Error ? e.message : String(e)}`});
                     // Fallback to simple string truncation if summarization fails
                     optimized.retrievedContext = contextStr.substring(0, Math.floor(contextStr.length * (budgets.rag / ragTokens)));
                     modifications.details!.truncatedComponents!.push('retrievedContext');
                     modifications.wasModified = true;
                     const newRagTokens = await this.estimateTokenCount(optimized.retrievedContext as string, modelInfo.modelId);
                     currentTokens = currentTokens - ragTokens + newRagTokens;
                     ragTokens = newRagTokens;
                }
            } else { // Simple truncation
                 optimized.retrievedContext = contextStr.substring(0, Math.floor(contextStr.length * (budgets.rag / ragTokens)));
                 modifications.details!.truncatedComponents!.push('retrievedContext');
                 modifications.wasModified = true;
                 const newRagTokens = await this.estimateTokenCount(optimized.retrievedContext as string, modelInfo.modelId);
                 currentTokens = currentTokens - ragTokens + newRagTokens;
                 ragTokens = newRagTokens;
            }
        }
    }

    // 3. System Prompts (usually important, truncate last if necessary)
    // 4. User Input (less likely to be truncated, but possible for very long inputs)
    // These would follow similar logic if currentTokens still exceeds budget.
    // For brevity, these further truncation steps are omitted but would target less critical components first.

    if (currentTokens > budget && issues) {
        issues.push({ type: 'warning', code: 'TOKEN_BUDGET_EXCEEDED_POST_OPT', message: `Prompt still exceeds budget (${currentTokens}/${budget}) after initial optimizations. Quality may be affected.`});
    }

    return { optimizedComponents: optimized, modifications };
  }

  private async calculateTotalTokens(components: PromptComponents, modelId: string): Promise<number> {
      let total = 0;
      if(components.systemPrompts) total += (await Promise.all(components.systemPrompts.map(sp => this.estimateTokenCount(sp.content, modelId)))).reduce((a,b) => a+b, 0);
      if(components.userInput) total += await this.estimateTokenCount(components.userInput, modelId);
      if(components.conversationHistory) total += await this.calculateTokensForMessages(components.conversationHistory, modelId);
      if(components.retrievedContext) {
          const contextStr = typeof components.retrievedContext === 'string' ? components.retrievedContext : components.retrievedContext.map(r => r.content).join('\n');
          total += await this.estimateTokenCount(contextStr, modelId);
      }
      // Tools schema token estimation is complex and provider-dependent. Placeholder.
      if(components.tools) total += components.tools.length * 50; // Very rough estimate
      return total;
  }

  private async calculateTokensForMessages(messages: Message[], modelId: string): Promise<number> {
      if (!messages) return 0;
      let sum = 0;
      for (const msg of messages) {
          if (typeof msg.content === 'string') {
              sum += await this.estimateTokenCount(msg.content, modelId);
          } else if (Array.isArray(msg.content)) { // Multi-part content (e.g., text + image)
              for (const part of msg.content) {
                  if (part.type === 'text' && part.text) {
                      sum += await this.estimateTokenCount(part.text, modelId);
                  } else if (part.type === 'image_url') {
                      sum += 70; // OpenAI specific cost for image link + low-res image
                      if (part.image_url?.detail === 'high') sum += 65; // Additional for high-res tile
                  }
              }
          }
          // Add tokens for role, name, tool_calls etc. (approx 5-10 per message overall)
          sum += 5;
      }
      return sum;
  }

  /** Truncates messages from the beginning to fit target token count. */
  private truncateMessages(messages: Message[], targetTokenCount: number, estimateFn: TokenEstimator): Message[] {
    // This is a naive truncation. A better one would use estimateFn iteratively.
    let currentTokens = messages.reduce((sum, msg) => sum + (typeof msg.content === 'string' ? msg.content.length : 50) , 0) / 4; // Rough estimate
    while(currentTokens > targetTokenCount && messages.length > 1) {
        const removedMsg = messages.shift();
        currentTokens -= (typeof removedMsg?.content === 'string' ? removedMsg.content.length : 50) / 4;
    }
    return messages;
  }


  /** Formats tool schemas based on the target model's requirements. */
  private formatToolSchemasForModel(tools: ITool[], modelInfo: Readonly<ModelTargetInfo>): any[] {
    if (!modelInfo.toolSupport.supported || !tools || tools.length === 0) {
      return [];
    }
    switch (modelInfo.toolSupport.format) {
      case 'openai_functions':
        return tools.map(tool => ({
          type: 'function',
          function: {
            name: tool.id, // Assuming tool.id is the function name
            description: tool.definition.description,
            parameters: tool.definition.parameters, // Assuming JSON Schema for parameters
          },
        }));
      // Add cases for 'anthropic_tools', 'google_tools', etc.
      default:
        console.warn(`PromptEngine: Tool format '${modelInfo.toolSupport.format}' not fully supported for schema generation. Returning raw definitions.`);
        return tools.map(tool => tool.definition); // Fallback
    }
  }

  // Default Template Implementations (can be overridden or extended via config)
  private createOpenAIChatTemplate(): PromptTemplateFunction {
    return async (components, modelInfo, selectedElements, config, estimateTokenCountFn) => {
      const messages: ChatMessage[] = [];
      // 1. System Prompts
      if (components.systemPrompts && components.systemPrompts.length > 0) {
        const combinedSystemContent = components.systemPrompts.map(p => p.content).join("\n\n").trim();
        if (combinedSystemContent) {
            messages.push({ role: 'system', content: combinedSystemContent });
        }
      }
      // 2. Conversation History
      if (components.conversationHistory) {
        components.conversationHistory.forEach(msg => {
          // Map AgentOS MessageRole to OpenAI ChatMessageRole
          let role: ChatMessage['role'] = 'user'; // default
          if (msg.role === MessageRole.ASSISTANT) role = 'assistant';
          else if (msg.role === MessageRole.SYSTEM) role = 'system'; // Could merge with main system above
          else if (msg.role === MessageRole.TOOL) role = 'tool';

          const chatMsg: ChatMessage = { role, content: null }; // Content will be set below

          if (typeof msg.content === 'string') {
            chatMsg.content = msg.content;
          } else if (Array.isArray(msg.content)) { // OpenAI vision format
            chatMsg.content = msg.content; // Pass directly if already formatted for OpenAI
          } else if (msg.content === null && msg.tool_calls) {
            // This is fine, content can be null for assistant message with tool_calls
          } else if (msg.content) {
            // Fallback for other content types - stringify. This may not be optimal for LLM.
            chatMsg.content = JSON.stringify(msg.content);
          }


          if (msg.name) chatMsg.name = msg.name;
          if (msg.tool_call_id) chatMsg.tool_call_id = msg.tool_call_id;
          if (msg.tool_calls) chatMsg.tool_calls = msg.tool_calls;

          messages.push(chatMsg);
        });
      }
      // 3. Current User Input (with Vision if applicable)
      const userMessageParts: any[] = [];
      if (components.userInput) {
        userMessageParts.push({ type: 'text', text: components.userInput });
      }
      if (components.visionInputs && modelInfo.visionSupport?.supported) {
        components.visionInputs.forEach(vis => {
          userMessageParts.push({
            type: 'image_url',
            image_url: { url: vis.type === 'base64' ? `data:${vis.mediaType || 'image/jpeg'};base64,${vis.data}` : vis.data }
          });
        });
      }
      if (userMessageParts.length > 0) {
        messages.push({ role: 'user', content: userMessageParts.length === 1 && userMessageParts[0].type === 'text' ? userMessageParts[0].text : userMessageParts });
      }
      // Note: retrievedContext and other customComponents need explicit handling within this template
      // or a more generic templating engine if they are to be injected into specific message parts.
      // For example, RAG context might be prepended to user input or added as a system message.
      if (components.retrievedContext) {
          const ragContent = typeof components.retrievedContext === 'string' ? components.retrievedContext : components.retrievedContext.map(r => `Source: ${r.source}\nContent: ${r.content}`).join('\n\n');
          // Prepend RAG to the last user message or add as a new user message with context.
          // This is a simple strategy.
          if (messages.length > 0 && messages[messages.length-1].role === 'user') {
              const lastUserMsg = messages[messages.length-1];
              const newUserContent = `Context:\n${ragContent}\n\nUser Query: ${lastUserMsg.content}`;
              messages[messages.length-1].content = newUserContent;
          } else {
               messages.push({role: 'user', content: `Based on the following context:\n${ragContent}\n\nPlease respond to the implicit or explicit user query.`});
          }
      }

      return messages;
    };
  }

  private createAnthropicMessagesTemplate(): PromptTemplateFunction {
    // Similar structure to OpenAI, but with a top-level 'system' prompt
    return async (components, modelInfo, selectedElements, config, estimateTokenCountFn) => {
        const messages: ChatMessage[] = [];
        let systemPrompt = '';
        if (components.systemPrompts && components.systemPrompts.length > 0) {
            systemPrompt = components.systemPrompts.map(p => p.content).join("\n\n").trim();
        }

        // TODO: Convert components.conversationHistory and components.userInput (+vision)
        // into Anthropic's message format, ensuring alternating user/assistant turns.
        // Handle multi-modal content for Anthropic.

        if (components.conversationHistory) {
          components.conversationHistory.forEach(msg => {
            let role: 'user' | 'assistant' = 'user';
            if (msg.role === MessageRole.ASSISTANT) role = 'assistant';
            // System messages handled separately for Anthropic. Tool messages need mapping.
            if (msg.role === MessageRole.USER || msg.role === MessageRole.ASSISTANT) {
                 const contentParts: any[] = [];
                 if (typeof msg.content === 'string') {
                     contentParts.push({type: 'text', text: msg.content});
                 } else if (Array.isArray(msg.content)) { // Already formatted for multipart
                    msg.content.forEach(part => contentParts.push(part));
                 }
                 // TODO: Map visionInputs from Message to Anthropic image parts if not already done in GMI
                 messages.push({ role, content: contentParts });
            } else if (msg.role === MessageRole.TOOL) {
                // Anthropic tool result format
                messages.push({
                    role: 'user', // Tool results are presented as a 'user' turn to Claude
                    content: [
                        {
                            type: 'tool_result',
                            tool_use_id: msg.tool_call_id!,
                            content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
                            // is_error: ... based on tool result payload
                        }
                    ]
                });
            }
          });
        }

        const currentUserInputParts: any[] = [];
        if(components.userInput) currentUserInputParts.push({type: 'text', text: components.userInput});
        if(components.visionInputs && modelInfo.visionSupport?.supported){
            components.visionInputs.forEach(vis => {
                currentUserInputParts.push({
                    type: 'image',
                    source: {
                        type: vis.type === 'base64' ? 'base64' : 'url', // Anthropic uses 'base64' type for source
                        media_type: vis.mediaType || (vis.data.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png'),
                        data: vis.type === 'base64' ? vis.data : (vis.data.startsWith('data:') ? vis.data.split(',')[1] : vis.data) // Extract base64 if full data URI
                    }
                });
            });
        }
        if (currentUserInputParts.length > 0) {
            messages.push({role: 'user', content: currentUserInputParts});
        }


        const formatted: FormattedPrompt = { messages };
        if (systemPrompt) {
            formatted.system = systemPrompt;
        }
        // Handle tool definitions for Anthropic if components.tools are provided
        if (components.tools && modelInfo.toolSupport.format === 'anthropic_tools') {
            formatted.tools = this.formatToolSchemasForModel(components.tools, modelInfo);
        }

        return formatted;
    };
  }

  private createGenericCompletionTemplate(): PromptTemplateFunction {
    return async (components, modelInfo, selectedElements, config, estimateTokenCountFn) => {
      let promptString = "";
      if (components.systemPrompts) promptString += components.systemPrompts.map(p=>p.content).join("\n") + "\n\n";
      if (components.conversationHistory) {
        promptString += components.conversationHistory.map(m => `${m.role}: ${typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}`).join("\n") + "\n\n";
      }
      if (components.userInput) promptString += `user: ${components.userInput}\nassistant:`; // Common completion prompt style
      return promptString;
    };
  }

}