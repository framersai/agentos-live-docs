import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LLMUtilityAI, LLMUtilityAIConfig } from '../LLMUtilityAI';
import { IUtilityAI, SummarizationOptions } from '../IUtilityAI';
import { AIModelProviderManager } from '../../llm/providers/AIModelProviderManager';
import { IProvider } from '../../llm/providers/IProvider';
import { GMIError, GMIErrorCode } from '@agentos/core/utils/errors';

// Basic Mock for AIModelProviderManager and IProvider
const mockProvider: IProvider = {
  providerId: 'mock-llm-provider',
  initialize: vi.fn().mockResolvedValue(undefined),
  generate: vi.fn().mockResolvedValue({ choices: [{ text: 'Mocked LLM summary' }], usage: { totalTokens: 10 } }),
  generateStream: vi.fn().mockImplementation(async function* () {
    yield { textDelta: 'Mocked stream ', isFinal: false };
    yield { textDelta: 'response.', isFinal: true, finishReason: 'stop', usage: { totalTokens: 5 } };
  }),
  generateEmbeddings: vi.fn().mockResolvedValue({ data: [], usage: {totalTokens: 0 }}), // Not used by LLMUtilityAI directly
  checkHealth: vi.fn().mockResolvedValue({ isHealthy: true }),
  listModels: vi.fn().mockResolvedValue([{id: 'default-llm-model', providerId: 'mock-llm-provider'}]),
};

const mockLlmProviderManager: AIModelProviderManager = {
  initialize: vi.fn().mockResolvedValue(undefined),
  getProvider: vi.fn().mockReturnValue(mockProvider),
  listProviderIds: vi.fn().mockReturnValue(['mock-llm-provider']),
  checkHealth: vi.fn().mockResolvedValue({ isOverallHealthy: true, providerStatus: { 'mock-llm-provider': { isHealthy: true}}}),
  shutdownAll: vi.fn().mockResolvedValue(undefined),
} as any; // Cast as any for simplicity if not all methods of AIModelProviderManager are stubbed

const defaultConfig: LLMUtilityAIConfig = {
  utilityId: 'test-llm-utility',
  llmProviderManager: mockLlmProviderManager,
  defaultModelId: 'default-llm-model',
  defaultProviderId: 'mock-llm-provider', // Optional if modelId implies it
};

describe('LLMUtilityAI', () => {
  let llmUtility: IUtilityAI;

  beforeEach(async () => {
    vi.clearAllMocks(); // Clear mocks before each test
    llmUtility = new LLMUtilityAI();
    await llmUtility.initialize(defaultConfig);
  });

  it('should be defined and initialize without errors', () => {
    expect(llmUtility).toBeDefined();
    expect(llmUtility.utilityId).toContain('llm-utility');
  });

  it('should call llmProviderManager for summarization', async () => {
    const textToSummarize = "This is a long text that needs summarization.";
    const options: SummarizationOptions = { method: 'abstractive_llm', desiredLength: 'short' };
    
    const summary = await llmUtility.summarize(textToSummarize, options);

    expect(summary).toBe('Mocked LLM summary');
    expect(mockProvider.generate).toHaveBeenCalled();
    expect(mockProvider.generate).toHaveBeenCalledWith(
      defaultConfig.defaultModelId, // Or summarizationModelId if set in config/options
      expect.stringContaining(textToSummarize), // Check if prompt contains original text
      expect.any(Object) // Check for completion options
    );
  });

  it('parseJsonSafe should parse valid JSON', async () => {
    const jsonString = '{ "key": "value", "number": 123 }';
    const result = await llmUtility.parseJsonSafe(jsonString);
    expect(result).toEqual({ key: 'value', number: 123 });
  });

  it('parseJsonSafe should attempt LLM fix for invalid JSON if configured', async () => {
    const invalidJsonString = '{ "key": "value", "number": 123'; // Missing closing brace
    const fixedJsonString = '{ "key": "value", "number": 123 }';
    
    // Mock the LLM call for fixing JSON
    (mockProvider.generate as any).mockResolvedValueOnce({ choices: [{ text: fixedJsonString }], usage: { totalTokens: 5 } });

    const result = await llmUtility.parseJsonSafe(invalidJsonString, { 
      attemptFixWithLLM: true, 
      llmModelIdForFix: 'json-fixer-model' // This model would be configured
    });
    
    expect(result).toEqual({ key: 'value', number: 123 });
    expect(mockProvider.generate).toHaveBeenCalledWith(
      'json-fixer-model',
      expect.stringContaining(invalidJsonString),
      expect.any(Object)
    );
  });

  it('checkHealth should report as healthy if initialized and provider manager is healthy', async () => {
    const health = await llmUtility.checkHealth();
    expect(health.isHealthy).toBe(true);
    expect(health.details).toHaveProperty('status', 'Initialized');
    expect(health.dependencies?.[0].name).toBe('AIModelProviderManager');
    expect(health.dependencies?.[0].isHealthy).toBe(true);
  });

  it('should allow shutdown', async () => {
    await expect(llmUtility.shutdown?.()).resolves.toBeUndefined();
    // Add any assertions about state after shutdown if applicable
  });
});