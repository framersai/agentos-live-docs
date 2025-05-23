// backend/services/llm_utility/UtilityLLMService.ts

import { IProvider, ModelCompletionOptions, ModelCompletionResponse, ModelUsage } from '../../agentos/core/llm/providers/IProvider';
import { AIModelProviderManager } from '../../agentos/core/llm/providers/AIModelProviderManager';
import { IPromptEngine, PromptComponents, ModelTargetInfo } from '../../agentos/core/llm/IPromptEngine';
import { PromptEngine } from '../../agentos/core/llm/PromptEngine';

/**
 * @fileoverview Provides a service for general-purpose LLM utility tasks.
 * @module agentos/services/llm_utility/UtilityLLMService
 */

export interface DirectPromptRequest {
  prompt: string;
  systemPrompt?: string;
  modelId?: string;
  providerId?: string;
  taskHint?: string; // e.g., "summarization", "classification_general"
  completionOptions?: Partial<ModelCompletionOptions>;
  stream?: boolean; // To request streaming output
}

export interface SummarizationTaskRequest {
  textToSummarize: string;
  desiredLength?: 'short' | 'medium' | 'long' | number;
  outputFormat?: 'paragraph' | 'bullet_points';
  modelId?: string;
  providerId?: string;
  completionOptions?: Partial<ModelCompletionOptions>;
  stream?: boolean;
}

export interface UtilityLLMServiceOutput {
    responseText: string | null;
    usage?: ModelUsage;
    error?: string;
    isFinal?: boolean; // For streaming
    providerId?: string;
    modelIdUsed?: string;
}

export class UtilityLLMService {
  private providerManager: AIModelProviderManager;
  private promptEngine: IPromptEngine;

  constructor(providerManager: AIModelProviderManager, promptEngine?: IPromptEngine) {
    this.providerManager = providerManager;
    this.promptEngine = promptEngine || new PromptEngine();
    if (!(this.promptEngine as any).initialized) {
        this.promptEngine.initialize({}).catch(err => console.error("UtilityLLMService: Error initializing PromptEngine:", err));
    }
    console.log("UtilityLLMService initialized.");
  }

  private async _selectProviderAndModel(
    preferredProviderId?: string,
    preferredModelId?: string,
    taskHint: string = 'general_utility'
  ): Promise<{ provider: IProvider; modelId: string }> {
    let provider: IProvider | undefined;
    let modelId: string | undefined = preferredModelId;

    if (preferredProviderId) {
      provider = this.providerManager.getProvider(preferredProviderId);
      if (!provider) throw new Error(`UtilityLLMService: Preferred provider '${preferredProviderId}' not found or not initialized.`);
      modelId = preferredModelId || provider.defaultModelId;
    } else if (preferredModelId) {
      provider = this.providerManager.getProviderForModel(preferredModelId);
      modelId = preferredModelId;
    } else { // Select a default based on task hint (very simple logic for MVP)
      const allModels = await this.providerManager.listAllAvailableModels();
      let suitableModel;
      if (taskHint.includes("summarization") || taskHint.includes("short")) {
          suitableModel = allModels.find(m => m.id.includes("mini") || m.id.includes("haiku") || m.id.includes("3.5-turbo")) || allModels.find(m => m.id.includes("llama3:8b"));
      }
      suitableModel = suitableModel || allModels.find(m => m.providerId === this.providerManager.getDefaultProvider()?.providerId);
      suitableModel = suitableModel || allModels[0];

      if (suitableModel) {
          modelId = suitableModel.id;
          provider = this.providerManager.getProvider(suitableModel.providerId);
      }
    }

    if (!provider) provider = this.providerManager.getDefaultProvider();
    if (!provider) throw new Error('UtilityLLMService: No suitable LLM provider could be determined.');
    if (!modelId) modelId = provider.defaultModelId;
    if (!modelId) throw new Error(`UtilityLLMService: No model ID could be determined for provider ${provider.providerId}.`);

    return { provider, modelId };
  }

  public async processDirectPrompt(request: DirectPromptRequest): Promise<UtilityLLMServiceOutput> {
    try {
      const { provider, modelId } = await this._selectProviderAndModel(request.providerId, request.modelId, request.taskHint || "direct_prompt");

      const promptComponents: Partial<PromptComponents> = { userInput: request.prompt };
      if (request.systemPrompt) promptComponents.systemPrompts = [{ content: request.systemPrompt, priority: 0 }];

      const modelTargetInfo: ModelTargetInfo = { modelId, promptFormatType: provider.getFormatTypeForModel?.(modelId) || 'auto' };
      const promptResult = await this.promptEngine.constructPrompt(promptComponents, modelTargetInfo);
      if (promptResult.issues?.some(i => i.type === 'error')) {
        throw new Error(`Prompt construction failed: ${promptResult.issues.filter(i => i.type === 'error').map(i => i.message).join('; ')}`);
      }

      const completionOptions: ModelCompletionOptions = {
        modelId,
        stream: false, // Non-streaming by default for this method
        ...(request.completionOptions || {}),
      };

      const response = await provider.generateCompletion(promptResult.prompt, completionOptions, promptResult);
      
      return {
        responseText: response.choices[0]?.message?.content || response.choices[0]?.text || null,
        usage: response.usage,
        error: response.error?.message,
        isFinal: true,
        providerId: provider.providerId,
        modelIdUsed: response.modelId,
      };
    } catch (error: any) {
        console.error("UtilityLLMService.processDirectPrompt Error:", error);
        return { responseText: null, error: error.message, isFinal: true };
    }
  }


  public async *streamDirectPrompt(request: DirectPromptRequest): AsyncIterable<UtilityLLMServiceOutput> {
    let provider: IProvider;
    let modelId: string;
    try {
        ({ provider, modelId } = await this._selectProviderAndModel(request.providerId, request.modelId, request.taskHint || "direct_prompt_stream"));
    } catch (error: any) {
        yield { responseText: null, error: error.message, isFinal: true };
        return;
    }

    const promptComponents: Partial<PromptComponents> = { userInput: request.prompt };
    if (request.systemPrompt) promptComponents.systemPrompts = [{ content: request.systemPrompt, priority: 0 }];

    const modelTargetInfo: ModelTargetInfo = { modelId, promptFormatType: provider.getFormatTypeForModel?.(modelId) || 'auto' };
    const promptResult = await this.promptEngine.constructPrompt(promptComponents, modelTargetInfo);
    // Error handling for promptResult needed

    const completionOptions: ModelCompletionOptions = {
      modelId,
      stream: true, // Force streaming
      ...(request.completionOptions || {}),
    };

    try {
        const stream = provider.generateCompletionStream(promptResult.prompt, completionOptions, promptResult);
        for await (const chunk of stream) {
            if (chunk.error) {
                yield { responseText: null, error: chunk.error.message, isFinal: true, usage: chunk.usage, providerId: provider.providerId, modelIdUsed: chunk.modelId };
                return;
            }
            const deltaContent = chunk.choices[0]?.delta?.content || "";
            yield {
                responseText: deltaContent, // Yielding only the delta
                usage: chunk.isFinal ? chunk.usage : undefined, // Usage only on final chunk
                isFinal: chunk.isFinal || false,
                providerId: provider.providerId,
                modelIdUsed: chunk.modelId,
            };
            if (chunk.isFinal) return;
        }
    } catch (error: any) {
        console.error("UtilityLLMService.streamDirectPrompt Error:", error);
        yield { responseText: null, error: error.message, isFinal: true };
    }
  }


  public async summarizeText(request: SummarizationTaskRequest): Promise<UtilityLLMServiceOutput> {
    const systemPrompt = `Summarize the following text. Desired length: ${request.desiredLength || 'medium'}. Output format: ${request.outputFormat || 'paragraph'}. Focus on key points.`;
    const directPromptRequest: DirectPromptRequest = {
      prompt: request.textToSummarize,
      systemPrompt,
      modelId: request.modelId,
      providerId: request.providerId,
      taskHint: "summarization",
      completionOptions: {
        max_tokens: request.desiredLength === 'long' ? 1000 : (request.desiredLength === 'short' ? 150 : 500),
        temperature: 0.3, // Lower for factual summarization
        ...(request.completionOptions || {}),
      },
      stream: false, // Summarization is usually not streamed unless very long
    };
    return this.processDirectPrompt(directPromptRequest);
  }

  // Streaming summarization - yields paragraphs or bullet points as they are formed.
  public async *streamSummarizeText(request: SummarizationTaskRequest): AsyncIterable<UtilityLLMServiceOutput> {
      const systemPrompt = `You are an expert summarizer. Summarize the following text.
Desired length: ${request.desiredLength || 'medium'}.
Output format: ${request.outputFormat || 'paragraph'}.
Focus on extracting key information and main points. Stream your response, ensuring each yielded part is a complete sentence or thought if possible.`;

      const directPromptRequest: DirectPromptRequest = {
          prompt: request.textToSummarize,
          systemPrompt: systemPrompt,
          modelId: request.modelId,
          providerId: request.providerId,
          taskHint: "summarization_stream",
          completionOptions: {
                temperature: 0.5,
                max_tokens: request.desiredLength === 'long' ? 1200 : (request.desiredLength === 'short' ? 200 : 600),
                ...(request.completionOptions || {}),
          },
          stream: true,
      };
      yield* this.streamDirectPrompt(directPromptRequest);
  }
}