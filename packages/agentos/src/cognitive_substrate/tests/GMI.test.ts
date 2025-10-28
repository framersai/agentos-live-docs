import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GMI } from '../GMI';
import { IGMI, GMIBaseConfig, GMITurnInput, GMIInteractionType, GMIPrimeState, GMIMood, UserContext, TaskContext } from '../IGMI';
import { IPersonaDefinition } from '../personas/IPersonaDefinition';
import { IWorkingMemory } from '../memory/IWorkingMemory';
import { IPromptEngine } from '../../core/llm/IPromptEngine';
import { AIModelProviderManager } from '../../core/llm/providers/AIModelProviderManager';
import { IProvider, ModelStreamChunk, ModelChatMessage } from '../../core/llm/providers/IProvider';
import { IUtilityAI, ParseJsonOptions, SummarizationOptions } from '../../core/ai_utilities/IUtilityAI';
import { IToolOrchestrator } from '../../tools/IToolOrchestrator';
import { IRetrievalAugmentor } from '../../rag/IRetrievalAugmentor';
import { GMIError, GMIErrorCode } from '@agentos/core/utils/errors';

// --- Mock Dependencies ---
const mockWorkingMemory: IWorkingMemory = {
  id: 'wm-mock',
  initialize: vi.fn().mockResolvedValue(undefined),
  set: vi.fn().mockResolvedValue(undefined),
  get: vi.fn().mockImplementation((key) => {
    if (key === 'currentGmiMood') return Promise.resolve(GMIMood.NEUTRAL);
    if (key === 'currentUserContext') return Promise.resolve({ userId: 'mock-user' });
    if (key === 'currentTaskContext') return Promise.resolve({ taskId: 'mock-task' });
    return Promise.resolve(undefined);
  }),
  delete: vi.fn().mockResolvedValue(undefined),
  getAll: vi.fn().mockResolvedValue({}),
  clear: vi.fn().mockResolvedValue(undefined),
  size: vi.fn().mockResolvedValue(0),
  has: vi.fn().mockResolvedValue(false),
  close: vi.fn().mockResolvedValue(undefined),
};

const mockPromptEngine: IPromptEngine = {
  engineId: 'pe-mock',
  initialize: vi.fn().mockResolvedValue(undefined),
  constructPrompt: vi.fn().mockResolvedValue({
    finalPrompt: { role: 'user', content: "Mocked prompt" } as ModelChatMessage, // Or array if it's chat messages
    selectedModel: { modelId: 'mock-model', providerId: 'mock-provider' },
    issues: []
  }),
  checkHealth: vi.fn().mockResolvedValue({ isHealthy: true }),
};

const mockProvider: IProvider = {
  providerId: 'mock-llm-provider',
  initialize: vi.fn().mockResolvedValue(undefined),
  generate: vi.fn().mockResolvedValue({ choices: [{ text: 'Mock LLM response' }], usage: { totalTokens: 10 } }),
  generateStream: vi.fn().mockImplementation(async function* (): AsyncGenerator<ModelStreamChunk> {
    yield { textDelta: 'Mock stream ', isFinal: false, usage: { promptTokens: 2, completionTokens: 1, totalTokens: 3 } };
    yield { textDelta: 'response.', isFinal: true, finishReason: 'stop', usage: { promptTokens: 0, completionTokens: 2, totalTokens: 2 } };
  }),
  generateEmbeddings: vi.fn().mockResolvedValue({ data: [], usage: { totalTokens: 0 }}),
  checkHealth: vi.fn().mockResolvedValue({ isHealthy: true }),
  listModels: vi.fn().mockResolvedValue([{ id: 'mock-model', providerId: 'mock-llm-provider' }]),
};

const mockLlmProviderManager: AIModelProviderManager = {
  initialize: vi.fn().mockResolvedValue(undefined),
  getProvider: vi.fn().mockReturnValue(mockProvider),
  listProviderIds: vi.fn().mockReturnValue(['mock-llm-provider']),
  checkHealth: vi.fn().mockResolvedValue({ isOverallHealthy: true, providerStatus: { 'mock-llm-provider': { isHealthy: true } } }),
  shutdownAll: vi.fn().mockResolvedValue(undefined),
} as any;

const mockUtilityAI: IUtilityAI = {
  utilityId: 'util-mock',
  initialize: vi.fn().mockResolvedValue(undefined),
  summarize: vi.fn().mockResolvedValue("Mocked summary from UtilityAI"),
  parseJsonSafe: vi.fn().mockImplementation(async (jsonString, _options) => {
    try { return JSON.parse(jsonString); } catch (e) { return null; }
  }),
  // Stub other IUtilityAI methods as needed for GMI tests, or make them optional in a Partial mock
  classifyText: vi.fn(), extractKeywords: vi.fn(), tokenize: vi.fn(), stemTokens: vi.fn(),
  calculateSimilarity: vi.fn(), analyzeSentiment: vi.fn(), detectLanguage: vi.fn(),
  normalizeText: vi.fn(), generateNGrams: vi.fn(), calculateReadability: vi.fn(),
  checkHealth: vi.fn().mockResolvedValue({ isHealthy: true }),
  shutdown: vi.fn().mockResolvedValue(undefined),
};

const mockToolOrchestrator: IToolOrchestrator = {
  orchestratorId: 'to-mock',
  initialize: vi.fn().mockResolvedValue(undefined),
  registerTool: vi.fn().mockResolvedValue(undefined),
  unregisterTool: vi.fn().mockResolvedValue(true),
  getTool: vi.fn().mockResolvedValue(undefined),
  listAvailableTools: vi.fn().mockResolvedValue([]), // No tools by default for simpler tests
  processToolCall: vi.fn().mockResolvedValue({ toolCallId: 'mock-tcid', toolName: 'mock-tool', output: 'Mock tool output', isError: false }),
  checkHealth: vi.fn().mockResolvedValue({ isHealthy: true }),
  shutdown: vi.fn().mockResolvedValue(undefined),
};

const mockRetrievalAugmentor: IRetrievalAugmentor = {
  augmenterId: 'ra-mock',
  initialize: vi.fn().mockResolvedValue(undefined),
  ingestDocuments: vi.fn().mockResolvedValue({ processedCount: 0, failedCount: 0, ingestedIds: [], errors: [] }),
  retrieveContext: vi.fn().mockResolvedValue({ queryText: '', retrievedChunks: [], augmentedContext: 'Mocked RAG context', diagnostics: {} }),
  deleteDocuments: vi.fn().mockResolvedValue({ successCount: 0, failureCount: 0, errors: [] }),
  updateDocuments: vi.fn().mockResolvedValue({ processedCount: 0, failedCount: 0, ingestedIds: [], errors: [] }),
  checkHealth: vi.fn().mockResolvedValue({ isHealthy: true }),
  shutdown: vi.fn().mockResolvedValue(undefined),
};

const mockPersona: IPersonaDefinition = {
  id: 'test-persona-v1.1', name: 'Test Persona', description: 'A persona for GMI testing.', version: '1.1.0',
  baseSystemPrompt: 'You are a test assistant.',
  allowedCapabilities: [],
  defaultModelCompletionOptions: { modelId: 'mock-model', providerId: 'mock-provider' },
  memoryConfig: {
    enabled: true,
    ragConfig: { enabled: false } // RAG disabled by default for simpler tests
  },
  // Add other required fields from IPersonaDefinition
  personalityTraits: {}, moodAdaptation: { enabled: false }, defaultLanguage: 'en',
  modelTargetPreferences: [], costSavingStrategy: 'balance_quality_cost',
  toolIds: [], allowedInputModalities: ['text'], allowedOutputModalities: ['text'],
  conversationContextConfig: { maxMessages: 10 }, metaPrompts: [],
  minSubscriptionTier: "FREE", isPublic: true, activationKeywords: [], strengths: [],
  uiInteractionStyle: 'neutral', initialMemoryImprints: []
};

const mockBaseConfig: GMIBaseConfig = {
  workingMemory: mockWorkingMemory,
  promptEngine: mockPromptEngine,
  llmProviderManager: mockLlmProviderManager,
  utilityAI: mockUtilityAI,
  toolOrchestrator: mockToolOrchestrator,
  retrievalAugmentor: mockRetrievalAugmentor,
  defaultLlmModelId: 'mock-model', // Ensure this is present
  defaultLlmProviderId: 'mock-provider',
};

describe('GMI Core Functionality', () => {
  let gmi: IGMI;

  beforeEach(async () => {
    vi.clearAllMocks();
    gmi = new GMI('test-gmi-instance');
    // initialize directly, as mocking its internal state for each test is complex
    await gmi.initialize(mockPersona, mockBaseConfig);
  });

  it('should be defined and initialize to READY state', () => {
    expect(gmi).toBeDefined();
    expect(gmi.getCurrentState()).toBe(GMIPrimeState.READY);
  });

  it('processTurnStream should yield text output for simple text input', async () => {
    const input: GMITurnInput = {
      interactionId: 'turn-1', userId: 'user-test', type: GMIInteractionType.TEXT, content: 'Hello GMI!',
    };
    const outputChunks = [];
    for await (const chunk of gmi.processTurnStream(input)) {
      outputChunks.push(chunk);
    }

    expect(outputChunks.length).toBeGreaterThanOrEqual(2); // At least text delta and final marker
    const textDeltaChunk = outputChunks.find(c => c.type === GMIOutputChunkType.TEXT_DELTA && typeof c.content === 'string');
    expect(textDeltaChunk).toBeDefined();
    expect(textDeltaChunk?.content).toContain('Mock stream');
    const finalMarker = outputChunks.find(c => c.type === GMIOutputChunkType.FINAL_RESPONSE_MARKER);
    expect(finalMarker).toBeDefined();
    expect(finalMarker?.isFinal).toBe(true);
    expect(mockPromptEngine.constructPrompt).toHaveBeenCalled();
    expect(mockProvider.generateStream).toHaveBeenCalled();
  });

  it('performPostTurnIngestion should call utilityAI.summarize if RAG ingestion is enabled', async () => {
    const ragEnabledPersona: IPersonaDefinition = {
      ...mockPersona,
      memoryConfig: {
        enabled: true,
        ragConfig: {
          enabled: true,
          ingestionTriggers: { onTurnSummary: true },
          defaultIngestionDataSourceId: 'test-ds',
          // Add conceptual summarization config path if GMI uses it
          retrievedContextProcessing: { llmConfig: { modelId: 'summarizer-model' } }
        }
      }
    };
    await gmi.initialize(ragEnabledPersona, mockBaseConfig); // Re-initialize with RAG persona

    // Simulate a turn that would trigger ingestion
    (gmi as any).conversationHistory = [ // Manually set history for this specific test
        { role: 'user', content: 'User input for summary' },
        { role: 'assistant', content: 'Assistant response for summary' }
    ];
    (gmi as any).reasoningTrace.turnId = 'test-turn-id-for-ingestion'; // Set turnId for document ID

    await (gmi as any).performPostTurnIngestion('User input for summary', 'Assistant response for summary');

    expect(mockUtilityAI.summarize).toHaveBeenCalled();
    expect(mockRetrievalAugmentor.ingestDocuments).toHaveBeenCalled();
  });

  it('_triggerAndProcessSelfReflection should call utilityAI.parseJsonSafe', async () => {
    const reflectionPersona: IPersonaDefinition = {
      ...mockPersona,
      metaPrompts: [{
        id: 'gmi_self_trait_adjustment', description: 'Test reflection',
        promptTemplate: 'Reflect: {{evidence}}',
        trigger: { type: 'turn_interval', intervalTurns: 1 },
        modelId: 'reflection-model',
      }],
    };
    await gmi.initialize(reflectionPersona, mockBaseConfig);
    (gmi as any).turnsSinceLastReflection = 1; // Force trigger

    // Mock LLM generate for reflection
    (mockProvider.generate as any).mockResolvedValueOnce({
      choices: [{ text: JSON.stringify({ updatedGmiMood: GMIMood.FOCUSED }) }],
      usage: { totalTokens: 10 }
    });

    await (gmi as any)._triggerAndProcessSelfReflection();

    expect(mockProvider.generate).toHaveBeenCalled();
    expect(mockUtilityAI.parseJsonSafe).toHaveBeenCalled();
    // Check if workingMemory was called to set the mood (requires mood to be valid)
    expect(mockWorkingMemory.set).toHaveBeenCalledWith('currentGmiMood', GMIMood.FOCUSED);
  });


  it('should shutdown gracefully', async () => {
    await expect(gmi.shutdown()).resolves.toBeUndefined();
    expect(gmi.getCurrentState()).toBe(GMIPrimeState.SHUTDOWN);
    expect(mockWorkingMemory.close).toHaveBeenCalled();
    // Add more shutdown assertions if other components have specific shutdown actions called by GMI
  });
});
