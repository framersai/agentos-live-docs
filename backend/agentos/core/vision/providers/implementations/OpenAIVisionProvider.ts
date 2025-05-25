// File: backend/agentos/core/vision/providers/implementations/OpenAIVisionProvider.ts
/**
 * @file OpenAIVisionProvider.ts
 * @module backend/agentos/core/vision/providers/implementations/OpenAIVisionProvider
 * @version 1.0.0
 * @description Implements the IVisionProvider interface for OpenAI's Vision APIs
 * (e.g., GPT-4 with Vision, GPT-4o). This provider handles communication with
 * OpenAI, including request formatting, API calls, and response parsing.
 */

import OpenAI from 'openai';
import {
  IVisionProvider,
  AnalyzeImageOptions,
  ExtractFeaturesOptions,
  CompareFeaturesOptions,
} from '../IVisionProvider';
import { VisionInputData } from '../../types/VisionInput';
import {
  ProcessedVisionData,
  VisionTask,
  ImageFeatureSet,
  FrameComparisonResult,
  DetectedObject,
  SceneUnderstanding,
  OCRResult,
  FaceDetectionResult,
  BoundingBox,
  ImageCategoricalFeatures,
  ImageFeatureVector,
} from '../../types/VisionOutput';
import { BaseVisionProviderConfig, VisionModelInfo } from '../VisionProviderConfig';
import { VisionError, VisionErrorCode } from '../../errors/VisionError';
import { GMIError, GMIErrorCode } from '../../../../../utils/errors'; // Ensure correct path

// Default models that support vision
const DEFAULT_OPENAI_VISION_MODELS = [
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4-turbo', // Often refers to the latest vision-capable gpt-4-turbo
  'gpt-4-vision-preview', // Older, but might still be relevant for some
];

/**
 * @interface OpenAIVisionProviderConfig
 * @description Configuration specific to the OpenAIVisionProvider.
 */
export interface OpenAIVisionProviderConfig extends BaseVisionProviderConfig {
  /**
   * @property {string} apiKey
   * @description OpenAI API Key. Should be retrieved from a secure source like environment variables.
   */
  apiKey: string; // Made mandatory for this provider

  /**
   * @property {string} [organizationId]
   * @description Optional. OpenAI Organization ID.
   */
  organizationId?: string;

  /**
   * @property {'low' | 'high' | 'auto'} [defaultImageDetailLevel='auto']
   * @description Default detail level for image processing ('low', 'high', 'auto').
   * 'low' uses fewer tokens, 'high' uses more for detailed analysis.
   * @see https://platform.openai.com/docs/guides/vision/low-or-high-fidelity-image-understanding
   * @default 'auto'
   */
  defaultImageDetailLevel?: 'low' | 'high' | 'auto';
}

/**
 * @class OpenAIVisionProvider
 * @implements IVisionProvider
 * @description Provides vision analysis capabilities using OpenAI's multimodal models.
 */
export class OpenAIVisionProvider implements IVisionProvider {
  public readonly providerId: string;
  public readonly serviceName: string = 'OpenAI Vision';
  private config!: OpenAIVisionProviderConfig;
  private openaiClient!: OpenAI;
  private _isInitialized: boolean = false;

  /**
   * Constructs an OpenAIVisionProvider instance.
   * @param {string} [providerId='openai-vision'] - A unique ID for this provider instance.
   */
  constructor(providerId: string = 'openai-vision') {
    this.providerId = providerId;
  }

  /**
   * @inheritdoc
   */
  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  /**
   * @inheritdoc
   */
  public async initialize(config: OpenAIVisionProviderConfig): Promise<void> {
    if (!config.apiKey) {
      throw new VisionError(
        `${this.serviceName} (ID: ${this.providerId}): API key is required for initialization.`,
        VisionErrorCode.PROVIDER_AUTH_ERROR,
        { providerId: this.providerId },
        this.providerId
      );
    }
    this.config = {
      timeoutMs: 60000, // OpenAI Vision can be slower
      maxRetries: 2,
      defaultImageDetailLevel: 'auto',
      ...config,
    };

    if (!this.config.providerId) {
      this.config.providerId = this.providerId;
    }

    try {
      this.openaiClient = new OpenAI({
        apiKey: this.config.apiKey,
        organization: this.config.organizationId,
        timeout: this.config.timeoutMs,
        maxRetries: this.config.maxRetries,
      });
      this._isInitialized = true;
      if (this.config.customProviderParams?.logInitialization) {
        console.log(`${this.serviceName} (ID: ${this.providerId}) initialized successfully.`);
      }
    } catch (error: any) {
      throw VisionError.fromError(
        error,
        VisionErrorCode.PROVIDER_AUTH_ERROR, // Or CONFIGURATION_ERROR
        `${this.serviceName} (ID: ${this.providerId}): Failed to initialize OpenAI client`,
        this.providerId
      );
    }
  }

  private ensureInitialized(): void {
    if (!this._isInitialized || !this.openaiClient) {
      throw new VisionError(
        `${this.serviceName} (ID: ${this.providerId}) is not initialized. Call initialize() first.`,
        VisionErrorCode.CONFIGURATION_ERROR,
        { providerId: this.providerId },
        this.providerId
      );
    }
  }

  /**
   * @inheritdoc
   */
  public async analyzeImage(
    input: VisionInputData,
    options: AnalyzeImageOptions,
  ): Promise<ProcessedVisionData> {
    this.ensureInitialized();
    const startTime = Date.now();
    const modelIdToUse = options.modelId || this.config.defaultModelId || 'gpt-4o'; // Default to gpt-4o

    if (this.config.customProviderParams?.logRequests) {
        console.log(`OpenAIVisionProvider (ID: ${this.providerId}): Analyzing image. Model: ${modelIdToUse}, Tasks: ${options.tasks.join(', ')}`);
    }

    const imageUrlContent: OpenAI.Chat.Completions.ChatCompletionContentPartImage.ImageURL = {
      url: input.type === 'image_url' ? input.data : `data:${input.mimeType || 'image/jpeg'};base64,${input.data}`,
      detail: this.config.defaultImageDetailLevel,
    };

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    let systemPrompt = "You are a highly capable multimodal AI assistant. Analyze the provided image based on the user's request. ";
    let userPromptText = "Please analyze this image. ";

    // Consolidate task prompts
    const taskPrompts: string[] = [];
    if (options.tasks.includes(VisionTask.DESCRIBE_SCENE)) {
      taskPrompts.push("Provide a detailed description of the scene.");
    }
    if (options.tasks.includes(VisionTask.DETECT_OBJECTS)) {
      taskPrompts.push(`List the primary objects you see (up to ${options.maxObjectsToDetect || 10}) and their approximate locations if possible.`);
    }
    if (options.tasks.includes(VisionTask.EXTRACT_TEXT_OCR)) {
      taskPrompts.push(`Extract all visible text (OCR). Specify language if not English. OCR Languages Hint: ${options.ocrLanguages?.join(', ') || 'auto-detect'}`);
    }
    if (options.tasks.includes(VisionTask.DETECT_FACES)) {
      taskPrompts.push("Describe any human faces visible, including their expressions or notable features (do not attempt to identify individuals).");
    }
    // Note: EXTRACT_FEATURES is typically handled by a different method or a specialized model.
    // For GPT-4o, "features" might be implicitly captured in detailed descriptions.

    if (taskPrompts.length > 0) {
        userPromptText += "Specifically: " + taskPrompts.join(" ");
    } else {
        // Default to a general description if no specific tasks are given
        userPromptText += "Describe what you see in this image in detail.";
    }

    // Attempt to get a structured JSON response for easier parsing
    systemPrompt += ` Please format your response as a single, comprehensive JSON object with keys corresponding to the requested tasks (e.g., "sceneDescription", "detectedObjects", "ocrResult", "faceDetections").
    For "detectedObjects", provide an array of objects, each with "label", "confidence" (0-1), and optionally "boundingBox" ({ "x": 0-1, "y": 0-1, "width": 0-1, "height": 0-1, "unit": "normalized" }).
    For "ocrResult", provide "fullText" and optionally "languageCode".
    For "faceDetections", provide an array of objects, each with "confidence" and "boundingBox".`;


    messages.push({ role: 'system', content: systemPrompt });
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: userPromptText },
        { type: 'image_url', image_url: imageUrlContent },
      ],
    });

    try {
      const completion = await this.openaiClient.chat.completions.create({
        model: modelIdToUse,
        messages: messages,
        max_tokens: options.customTaskParams?.max_tokens as number || 2048, // Allow override
        temperature: options.customTaskParams?.temperature as number || 0.3,
        response_format: { type: "json_object" } // Request JSON mode
      });

      const processingTimeMs = Date.now() - startTime;
      const rawResponseContent = completion.choices[0]?.message?.content;

      if (!rawResponseContent) {
        throw new VisionError(
          'OpenAI API returned no content in the message.',
          VisionErrorCode.PROVIDER_API_ERROR,
          { responseId: completion.id, modelUsed: completion.model },
          this.providerId,
          modelIdToUse
        );
      }

      // Parse the JSON response from the LLM
      let parsedLlmJson: any;
      try {
        parsedLlmJson = JSON.parse(rawResponseContent);
      } catch (e) {
        console.error("OpenAIVisionProvider: Failed to parse LLM JSON response. Raw:", rawResponseContent, e);
        throw new VisionError(
            'Failed to parse structured JSON response from OpenAI model.',
            VisionErrorCode.PROVIDER_API_ERROR,
            { rawResponse: rawResponseContent, parseError: (e as Error).message, modelUsed: completion.model },
            this.providerId,
            modelIdToUse
        );
      }

      const processedData: ProcessedVisionData = {
        inputId: input.description || `input_${Date.now()}`,
        processingTimestamp: Date.now(),
        visionProviderId: this.providerId,
        modelIdUsed: completion.model,
        processingTimeMs,
        rawProviderResponse: options.includeRawResponse ? completion : undefined,
      };

      // Map parsedLlmJson to ProcessedVisionData structure
      if (parsedLlmJson.sceneDescription && options.tasks.includes(VisionTask.DESCRIBE_SCENE)) {
        processedData.sceneUnderstanding = {
          generalDescription: typeof parsedLlmJson.sceneDescription === 'string' ? parsedLlmJson.sceneDescription : JSON.stringify(parsedLlmJson.sceneDescription),
          tags: parsedLlmJson.sceneTags || [], // Assuming LLM might provide tags
        };
      }
      if (parsedLlmJson.detectedObjects && Array.isArray(parsedLlmJson.detectedObjects) && options.tasks.includes(VisionTask.DETECT_OBJECTS)) {
        processedData.detectedObjects = parsedLlmJson.detectedObjects.map((obj: any) => ({
          label: obj.label || 'unknown_object',
          confidence: obj.confidence || 0.5,
          boundingBox: obj.boundingBox as BoundingBox, // Assume LLM provides valid BoundingBox
          attributes: obj.attributes,
        } as DetectedObject));
      }
      if (parsedLlmJson.ocrResult && options.tasks.includes(VisionTask.EXTRACT_TEXT_OCR)) {
        processedData.ocrResult = {
          fullText: parsedLlmJson.ocrResult.fullText || (typeof parsedLlmJson.ocrResult === 'string' ? parsedLlmJson.ocrResult : ''),
          languageCode: parsedLlmJson.ocrResult.languageCode,
          // Words/paragraphs would require more complex prompting or parsing
        };
      }
      if (parsedLlmJson.faceDetections && Array.isArray(parsedLlmJson.faceDetections) && options.tasks.includes(VisionTask.DETECT_FACES)) {
         processedData.faceDetections = parsedLlmJson.faceDetections.map((face: any) => ({
            boundingBox: face.boundingBox as BoundingBox,
            confidence: face.confidence || 0.5,
            emotions: face.emotions,
            // landmarks, pose etc. would require specific prompting
         } as FaceDetectionResult));
      }


      return processedData;

    } catch (error: any) {
      if (error instanceof VisionError) throw error; // Re-throw if already a VisionError
      console.error(`OpenAIVisionProvider (ID: ${this.providerId}): Error during analyzeImage API call:`, error);
      const apiError = error as OpenAI.APIError;
      let visionErrorCode = VisionErrorCode.PROVIDER_API_ERROR;
      if (apiError.status === 401) visionErrorCode = VisionErrorCode.PROVIDER_AUTH_ERROR;
      if (apiError.status === 429) visionErrorCode = VisionErrorCode.RESOURCE_LIMIT_EXCEEDED;

      throw new VisionError(
        `OpenAI API error: ${apiError.message || 'Unknown API error'} (Status: ${apiError.status})`,
        visionErrorCode,
        {
          originalError: { name: apiError.name, status: apiError.status, headers: apiError.headers, type: (apiError as any).type, code: (apiError as any).code, param: (apiError as any).param },
          requestOptions: { modelIdToUse, tasks: options.tasks },
        },
        this.providerId,
        modelIdToUse
      );
    }
  }

  /**
   * @inheritdoc
   * For OpenAI GPT-4o/Vision, direct numerical feature vector extraction for general purpose
   * similarity isn't a standard exposed API feature like in some dedicated vision APIs.
   * We can simulate this by:
   * 1. Prompting for very detailed textual descriptions (rich "textual features").
   * 2. Using a text embedding model on these descriptions (outside this provider, or conceptually here).
   * 3. Returning a categorical feature set based on tags/description.
   * For this implementation, we'll return a categorical feature set.
   */
  public async extractImageFeatures(
    input: VisionInputData,
    options?: ExtractFeaturesOptions,
  ): Promise<ImageFeatureSet> {
    this.ensureInitialized();
    const modelIdToUse = options?.modelId || this.config.defaultModelId || 'gpt-4o';

    if (this.config.customProviderParams?.logRequests) {
        console.log(`OpenAIVisionProvider (ID: ${this.providerId}): Extracting features. Model: ${modelIdToUse}`);
    }

    // Simulate by getting a detailed description and some tags.
    // A true "feature vector" would typically require a dedicated embedding model or different API endpoint.
    const analysisOptions: AnalyzeImageOptions = {
        tasks: [VisionTask.DESCRIBE_SCENE], // Get a description that can serve as textual features
        modelId: modelIdToUse,
        customTaskParams: {
            [VisionTask.DESCRIBE_SCENE]: { detailLevel: "high" }
        }
    };

    try {
        const analysisResult = await this.analyzeImage(input, analysisOptions);
        const features: ImageCategoricalFeatures = {
            tags: analysisResult.sceneUnderstanding?.tags || [],
            dominantObjectType: analysisResult.detectedObjects && analysisResult.detectedObjects.length > 0
                ? analysisResult.detectedObjects.sort((a,b) => b.confidence - a.confidence)[0].label
                : analysisResult.sceneUnderstanding?.tags?.[0],
            customAttributes: {
                descriptionSummary: analysisResult.sceneUnderstanding?.generalDescription.substring(0, 200) + "..."
            }
        };
        // If user specifically requested 'embedding_vector' and we had a strategy (e.g. use text-embedding on description):
        // if (options?.featureType === 'embedding_vector') {
        //   // ... call text embedding model on analysisResult.sceneUnderstanding.generalDescription ...
        //   // return { vector: ..., modelId: 'text-embedding-model', dimensions: ... } as ImageFeatureVector;
        // }
        return features;
    } catch (error) {
        throw VisionError.fromError(
            error,
            VisionErrorCode.FEATURE_EXTRACTION_FAILED,
            `Failed to extract simulated features using ${modelIdToUse}`,
            this.providerId,
            modelIdToUse
        );
    }
  }

  /**
   * @inheritdoc
   * Compares features. If features are textual/categorical (as extracted by the current
   * `extractImageFeatures`), this might involve another LLM call to assess semantic similarity
   * between the textual descriptions, or a simpler string metric.
   * For mock purposes, we'll do a very basic comparison.
   */
  public async compareImageFeatures(
    features1: ImageFeatureSet,
    features2: ImageFeatureSet,
    options?: CompareFeaturesOptions,
  ): Promise<FrameComparisonResult> {
    this.ensureInitialized();
    const modelIdToUse = this.config.defaultModelId || 'gpt-4o'; // For potential LLM-based comparison

     if (this.config.customProviderParams?.logRequests) {
        console.log(`OpenAIVisionProvider (ID: ${this.providerId}): Comparing features. Method: ${options?.comparisonMethod || 'default'}`);
    }

    let similarityScore = 0.0;
    const comparisonMethod = options?.comparisonMethod || 'semantic_description_comparison';

    // Type guards to handle different ImageFeatureSet types
    const isCategorical = (f: ImageFeatureSet): f is ImageCategoricalFeatures =>
        typeof f === 'object' && f !== null && ('tags' in f || 'dominantObjectType' in f || 'customAttributes' in f);

    if (isCategorical(features1) && isCategorical(features2)) {
        // Simple comparison based on tag overlap for categorical features
        const tags1 = new Set(features1.tags || []);
        const tags2 = new Set(features2.tags || []);
        const intersection = new Set([...tags1].filter(tag => tags2.has(tag)));
        const union = new Set([...tags1, ...tags2]);
        similarityScore = union.size > 0 ? intersection.size / union.size : 1.0; // 1.0 if both empty

        if (features1.dominantObjectType && features2.dominantObjectType && features1.dominantObjectType === features2.dominantObjectType) {
            similarityScore = (similarityScore + 1.0) / 2.0; // Boost if dominant object is same
        }

        // For a more robust comparison, one could prompt an LLM with descriptions from customAttributes
        // e.g., `prompt = "How similar are these two image descriptions in meaning on a scale of 0 to 1? \nDesc1: ${desc1}\nDesc2: ${desc2}"`
        // This is left as a potential enhancement if `comparisonMethod` suggests 'llm_semantic_textual'.
    } else {
        // Fallback for other or mixed feature types - less accurate for this provider
        similarityScore = Math.random() * 0.5; // Low similarity for non-comparable types
        console.warn("OpenAIVisionProvider: Comparing non-categorical or mixed feature types with basic random score.");
    }


    return {
      similarityScore: Math.max(0, Math.min(1, similarityScore)),
      differenceScore: 1 - Math.max(0, Math.min(1, similarityScore)),
      comparisonMethod,
    };
  }

  /**
   * @inheritdoc
   */
  public async listAvailableModels(filter?: { capability?: VisionTask | string }): Promise<VisionModelInfo[]> {
    this.ensureInitialized();
    // OpenAI's /v1/models endpoint can list models, but capabilities like 'vision' aren't always explicitly filterable there.
    // We'll maintain a static list of known vision-capable models for simplicity here.
    const knownVisionModels: VisionModelInfo[] = DEFAULT_OPENAI_VISION_MODELS.map(id => ({
      modelId: id,
      providerId: this.providerId,
      modelName: id.toUpperCase(), // Simple name
      supportedTasks: [ // General capabilities for models like GPT-4o
        VisionTask.DESCRIBE_SCENE,
        VisionTask.DETECT_OBJECTS, // Via prompting
        VisionTask.EXTRACT_TEXT_OCR, // Via prompting
        VisionTask.DETECT_FACES,     // Via prompting
        VisionTask.EXTRACT_FEATURES, // Textual/Categorical via prompting
      ],
      supportedInputMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], // Common types GPT-4 Vision supports
      maxInputResolutionWidth: 4096, // Example, check OpenAI docs for specific model
      maxInputResolutionHeight: 4096,
      isDefaultModel: id === (this.config.defaultModelId || 'gpt-4o'),
    }));

    if (filter?.capability) {
      const task = filter.capability as VisionTask;
      return knownVisionModels.filter(m => m.supportedTasks.includes(task));
    }
    return knownVisionModels;
  }

  /**
   * @inheritdoc
   */
  public async getModelInfo(modelId: string): Promise<VisionModelInfo | undefined> {
    this.ensureInitialized();
    const models = await this.listAvailableModels();
    return models.find(m => m.modelId === modelId || `${m.providerId}/${m.modelId}` === modelId);
  }

  /**
   * @inheritdoc
   */
  public async checkHealth(): Promise<{ isHealthy: boolean; details?: any }> {
    this.ensureInitialized();
    try {
      // A light-weight call, e.g., listing models (though this can be slow sometimes)
      // Or, a better check might be to try a very small, cheap vision request if one exists,
      // or just rely on the client initialization success.
      // For now, checking if client can list models (first page)
      await this.openaiClient.models.list({limit: 1});
      return { isHealthy: true, details: { providerId: this.providerId, service: this.serviceName, status: 'Operational' } };
    } catch (error: any) {
      console.error(`OpenAIVisionProvider (ID: ${this.providerId}) health check failed:`, error);
      return {
        isHealthy: false,
        details: {
          providerId: this.providerId,
          service: this.serviceName,
          status: 'Unhealthy',
          error: error.message,
          errorCode: (error as OpenAI.APIError)?.status,
        },
      };
    }
  }

  /**
   * @inheritdoc
   */
  public async shutdown(): Promise<void> {
    if (this.config?.customProviderParams?.logRequests) {
        console.log(`OpenAIVisionProvider (ID: ${this.providerId}) shutdown. (No specific resources to release for OpenAI client).`);
    }
    this._isInitialized = false;
  }
}