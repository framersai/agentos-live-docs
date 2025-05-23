// backend/agentos/core/ai_utilities/LLMUtilityAI.ts

import {
  IUtilityAI, UtilityAIConfigBase,
  SummarizationOptions, ClassificationOptions, ClassificationResult,
  KeywordExtractionOptions, TokenizationOptions, StemmingOptions,
  SimilarityOptions, SentimentAnalysisOptions, SentimentResult,
  LanguageDetectionOptions, LanguageDetectionResult,
  TextNormalizationOptions, NGramOptions, ReadabilityOptions, ReadabilityResult
} from './IUtilityAI';
import { UtilityLLMService } from '../../../services/llm_utility/UtilityLLMService'; // Adjusted path
// For non-LLM tasks or very simple LLM fallbacks, we might still use 'natural' or other libraries.
// For this pure LLMUtilityAI, all methods that can be LLM-based will be.
// Non-LLM methods like tokenize, stem, ngram will throw "Not Supported by LLMUtilityAI" or use a basic JS implementation if trivial.

/**
 * @fileoverview An IUtilityAI implementation that primarily uses an LLM
 * (via UtilityLLMService) to perform its tasks.
 * @module agentos/core/ai_utilities/LLMUtilityAI
 */

export interface LLMUtilityAIConfig extends UtilityAIConfigBase {
  utilityLLMService: UtilityLLMService; // Must be injected
  defaultModelId?: string; // Default model for various utility tasks
  defaultProviderId?: string;
  // Task-specific model preferences:
  summarizationModelId?: string;
  classificationModelId?: string;
  keywordModelId?: string;
  sentimentModelId?: string;
  languageDetectionModelId?: string;
}

export class LLMUtilityAI implements IUtilityAI {
  public readonly utilityId = 'llm_utility_service_v1';
  private config!: LLMUtilityAIConfig;
  private service!: UtilityLLMService;
  private isInitialized = false;

  public async initialize(config: LLMUtilityAIConfig): Promise<void> {
    if (!config.utilityLLMService) {
      throw new Error("LLMUtilityAI requires a UtilityLLMService instance in its configuration.");
    }
    this.config = config;
    this.service = config.utilityLLMService;
    this.isInitialized = true;
    console.log(`LLMUtilityAI (${this.utilityId}) initialized.`);
  }

  private getModel(taskSpecificModelId?: string): string | undefined {
      return taskSpecificModelId || this.config.defaultModelId;
  }
  private getProvider(taskSpecificProviderId?: string) : string | undefined {
      return taskSpecificProviderId || this.config.defaultProviderId;
  }

  public async summarize(textToSummarize: string, options?: SummarizationOptions): Promise<string> {
    if (!this.isInitialized) throw new Error(`${this.utilityId} not initialized.`);
    const result = await this.service.summarizeText({
      textToSummarize,
      desiredLength: options?.desiredLength,
      outputFormat: options?.style === 'key_points' ? 'bullet_points' : 'paragraph',
      modelId: this.getModel(options?.modelId || this.config.summarizationModelId),
      providerId: this.getProvider(), // Service handles provider selection based on model if not given
      completionOptions: options?.methodOptions, // Assuming methodOptions are completionOptions
    });
    if (result.error || result.responseText === null) {
      throw new Error(`Summarization failed: ${result.error || 'No response text'}`);
    }
    return result.responseText;
  }

  public async classifyText(textToClassify: string, options: ClassificationOptions): Promise<ClassificationResult> {
    if (!this.isInitialized) throw new Error(`${this.utilityId} not initialized.`);
    const systemPrompt = `Classify the following text into one of these classes: [${options.candidateClasses.join(', ')}].
Respond with ONLY a JSON object with "bestClass" (string) and "confidence" (float 0-1).
If multiLabel is allowed and applicable, "bestClass" can be an array of strings.`;

    const result = await this.service.processDirectPrompt({
      prompt: textToClassify,
      systemPrompt,
      modelId: this.getModel(options?.modelId || this.config.classificationModelId),
      providerId: this.getProvider(),
      completionOptions: { temperature: 0.2, response_format: { type: "json_object" }, ...options.methodOptions },
      taskHint: 'classification'
    });

    if (result.error || !result.responseText) {
      throw new Error(`Classification failed: ${result.error || 'No response text'}`);
    }
    try {
      const parsed = JSON.parse(result.responseText);
      // Basic validation
      if ((typeof parsed.bestClass === 'string' || Array.isArray(parsed.bestClass)) && typeof parsed.confidence === 'number') {
          return {
              bestClass: parsed.bestClass,
              confidence: parsed.confidence,
              allScores: parsed.allScores || options.candidateClasses.map(c => ({
                  classLabel: c,
                  score: (Array.isArray(parsed.bestClass) ? parsed.bestClass.includes(c) : parsed.bestClass === c) ? parsed.confidence as number : (1 - parsed.confidence as number) / (options.candidateClasses.length -1 || 1)
              })) // Simplified allScores if not provided
          };
      }
      throw new Error("Invalid JSON format from LLM for classification.");
    } catch (e: any) {
      throw new Error(`Classification failed: Could not parse LLM response. ${e.message}. Response: ${result.responseText}`);
    }
  }

  public async extractKeywords(textToAnalyze: string, options?: KeywordExtractionOptions): Promise<string[]> {
    if (!this.isInitialized) throw new Error(`${this.utilityId} not initialized.`);
    const maxKeywords = options?.maxKeywords || 5;
    const systemPrompt = `Extract the top ${maxKeywords} most important keywords or keyphrases from the following text.
Respond with ONLY a JSON array of strings, e.g., ["keyword1", "keyphrase two"].`;

    const result = await this.service.processDirectPrompt({
      prompt: textToAnalyze,
      systemPrompt,
      modelId: this.getModel(options?.modelId || this.config.keywordModelId),
      providerId: this.getProvider(),
      completionOptions: { temperature: 0.3, response_format: {type: "json_object"}, ...options?.methodOptions },
      taskHint: 'keyword_extraction'
    });
    if (result.error || !result.responseText) {
      throw new Error(`Keyword extraction failed: ${result.error || 'No response text'}`);
    }
    try {
      const parsed = JSON.parse(result.responseText);
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        return parsed.slice(0, maxKeywords);
      }
      throw new Error("Invalid JSON array format from LLM for keywords.");
    } catch (e: any) {
      throw new Error(`Keyword extraction failed: Could not parse LLM response. ${e.message}. Response: ${result.responseText}`);
    }
  }

  public async analyzeSentiment(text: string, options?: SentimentAnalysisOptions): Promise<SentimentResult> {
    if (!this.isInitialized) throw new Error(`${this.utilityId} not initialized.`);
    const systemPrompt = `Analyze the sentiment of the following text.
Respond with ONLY a JSON object containing "score" (float, e.g., -1.0 to 1.0), "polarity" ("positive", "negative", or "neutral"), "comparative" (normalized score), and optionally "intensity" (float 0-1), "positiveTokens" (array of strings), "negativeTokens" (array of strings).`;

    const result = await this.service.processDirectPrompt({
      prompt: text,
      systemPrompt,
      modelId: this.getModel(options?.modelId || this.config.sentimentModelId),
      providerId: this.getProvider(),
      completionOptions: { temperature: 0.3, response_format: {type: "json_object"}, ...options?.methodOptions },
      taskHint: 'sentiment_analysis'
    });

    if (result.error || !result.responseText) {
      throw new Error(`Sentiment analysis failed: ${result.error || 'No response text'}`);
    }
    try {
      const parsed = JSON.parse(result.responseText);
      // Basic validation and default values
      return {
        score: typeof parsed.score === 'number' ? parsed.score : 0,
        polarity: ["positive", "negative", "neutral"].includes(parsed.polarity) ? parsed.polarity : "neutral",
        comparative: typeof parsed.comparative === 'number' ? parsed.comparative : (parsed.score || 0), // Fallback
        positiveTokens: Array.isArray(parsed.positiveTokens) ? parsed.positiveTokens.map((t: any) => ({token: String(t.token || t), score: Number(t.score || 0)})) : [],
        negativeTokens: Array.isArray(parsed.negativeTokens) ? parsed.negativeTokens.map((t: any) => ({token: String(t.token || t), score: Number(t.score || 0)})) : [],
        neutralTokens: [], // LLM might not provide this granularity easily
        intensity: typeof parsed.intensity === 'number' ? parsed.intensity : Math.abs(parsed.score || 0),
      };
    } catch (e: any) {
      throw new Error(`Sentiment analysis failed: Could not parse LLM response. ${e.message}. Response: ${result.responseText}`);
    }
  }

  public async detectLanguage(text: string, options?: LanguageDetectionOptions): Promise<LanguageDetectionResult[]> {
    if (!this.isInitialized) throw new Error(`${this.utilityId} not initialized.`);
    const maxCandidates = options?.maxCandidates || 1;
    const systemPrompt = `Detect the language of the following text.
Respond with ONLY a JSON array of objects, each with "language" (ISO 639-1 code) and "confidence" (float 0-1), sorted by confidence. Limit to ${maxCandidates} result(s).`;

    const result = await this.service.processDirectPrompt({
      prompt: text.substring(0, 500), // Send a sample for language detection
      systemPrompt,
      modelId: this.getModel(options?.methodOptions?.modelId || this.config.languageDetectionModelId), // `methodOptions` for specific model from IUtilityAI
      providerId: this.getProvider(),
      completionOptions: { temperature: 0.1, response_format: {type: "json_object"}, ...(options?.methodOptions || {}) },
      taskHint: 'language_detection'
    });

    if (result.error || !result.responseText) {
      console.warn(`Language detection failed: ${result.error || 'No response text'}. Falling back to unknown.`);
      return [{ language: 'unknown', confidence: 0.1 }];
    }
    try {
      const parsed = JSON.parse(result.responseText);
      if (Array.isArray(parsed) && parsed.every(item => typeof item.language === 'string' && typeof item.confidence === 'number')) {
        return parsed.slice(0, maxCandidates);
      }
      throw new Error("Invalid JSON array format from LLM for language detection.");
    } catch (e: any) {
      console.warn(`Language detection failed: Could not parse LLM response. ${e.message}. Response: ${result.responseText}. Falling back to unknown.`);
      return [{ language: 'unknown', confidence: 0.1 }];
    }
  }


  // Methods that are typically statistical and not directly LLM-based.
  // These could either use basic JS implementations or throw "Not Supported by LLMUtilityAI".
  public async tokenize(text: string, options?: TokenizationOptions): Promise<string[]> {
    // Basic JS tokenization for LLMUtilityAI if needed, or rely on StatisticalUtilityAI for this.
    let processedText = text;
    if (options?.toLowerCase) processedText = processedText.toLowerCase();
    if (options?.removePunctuation) processedText = processedText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]]/g," ");

    if (options?.type === 'sentence') { // Very basic sentence split
      return processedText.split(/(?<=[.?!])\s+/).map(s => s.trim()).filter(Boolean);
    }
    return processedText.split(/\s+/).map(s => s.trim()).filter(Boolean); // Word tokenization
  }

  public async stemTokens(tokens: string[], _options?: StemmingOptions): Promise<string[]> {
    // Stemming is inherently algorithmic. LLMs don't "stem" in the traditional sense.
    console.warn("LLMUtilityAI.stemTokens: Stemming is not a primary LLM function. Returning original tokens.");
    return tokens; // Or could attempt to prompt an LLM to "find the root form", but that's unreliable.
  }

  public async calculateSimilarity(text1: string, text2: string, options?: SimilarityOptions): Promise<number> {
    if (!this.isInitialized) throw new Error(`${this.utilityId} not initialized.`);
    // Could use an LLM to semantically compare, but that's more complex than typical statistical similarity.
    // For now, let's prompt for a semantic similarity score.
    const systemPrompt = `Rate the semantic similarity of the following two texts on a scale of 0.0 to 1.0.
Text 1: "${text1.substring(0, 200)}..."
Text 2: "${text2.substring(0, 200)}..."
Respond with ONLY a JSON object: {"similarityScore": float_value}.`;

    const result = await this.service.processDirectPrompt({
        prompt: `Text 1: ${text1}\nText 2: ${text2}`, // Full texts in actual prompt
        systemPrompt,
        modelId: this.getModel(options?.methodOptions?.modelId),
        providerId: this.getProvider(),
        completionOptions: {temperature: 0.2, response_format: {type: "json_object"}, ...(options?.methodOptions || {})},
        taskHint: 'semantic_similarity'
    });
    if (result.error || !result.responseText) {
      throw new Error(`Similarity calculation failed: ${result.error || 'No response text'}`);
    }
    try {
        const parsed = JSON.parse(result.responseText);
        if (typeof parsed.similarityScore === 'number') {
            return Math.max(0, Math.min(1, parsed.similarityScore)); // Clamp to 0-1
        }
        throw new Error("LLM did not return a valid similarityScore.");
    } catch(e:any) {
        throw new Error(`Similarity calculation failed: ${e.message}. LLM Response: ${result.responseText}`);
    }
  }

  public async normalizeText(text: string, options?: TextNormalizationOptions): Promise<string> {
    // Many normalization steps are rule-based. An LLM could do it, but might be overkill or inconsistent.
    // For LLMUtilityAI, let's assume it prompts the LLM to normalize based on options.
    if (!this.isInitialized) throw new Error(`${this.utilityId} not initialized.`);
    let instruction = "Normalize the following text. ";
    if (options?.toLowerCase) instruction += "Convert to lowercase. ";
    if (options?.removePunctuation) instruction += "Remove all punctuation. ";
    if (options?.expandContractions) instruction += "Expand contractions. ";
    // Stop words, stemming are harder for LLM to do precisely like algorithms.

    const result = await this.service.processDirectPrompt({
        prompt: text,
        systemPrompt: instruction + "Return only the normalized text.",
        modelId: this.getModel(options?.language === 'en' ? this.config.defaultModelId : undefined), // Lang specific model?
        providerId: this.getProvider(),
        completionOptions: {temperature: 0.0},
        taskHint: 'text_normalization'
    });
    if (result.error || result.responseText === null) {
      throw new Error(`Text normalization failed: ${result.error || 'No response text'}`);
    }
    return result.responseText;
  }

  public async generateNGrams(tokens: string[], options: NGramOptions): Promise<Record<number, string[][]>> {
    // This is purely algorithmic. Not an LLM task.
    console.warn("LLMUtilityAI.generateNGrams: N-gram generation is algorithmic. Consider StatisticalUtilityAI.");
    const nValues = Array.isArray(options.n) ? options.n : [options.n];
    const result: Record<number, string[][]> = {};
    nValues.forEach(n => {
      if (n <= 0) { result[n] = []; return; }
      const ngrams = [];
      const limit = options.includePartial ? tokens.length -1 : tokens.length - n;
      for (let i = 0; i <= limit; i++) {
        const ngram = tokens.slice(i, i + n);
        if (!options.includePartial && ngram.length < n) continue;
        ngrams.push(ngram);
      }
      result[n] = ngrams;
    });
    return result;
  }

  public async calculateReadability(text: string, options: ReadabilityOptions): Promise<ReadabilityResult> {
    // Readability scores are formulaic. LLM could *estimate* or *explain* it, but not calculate directly by formula.
    if (!this.isInitialized) throw new Error(`${this.utilityId} not initialized.`);
    const systemPrompt = `Estimate the readability of the following text using the ${options.formula} concept.
Respond with ONLY a JSON object containing "score" (float), "interpretation" (string), and optionally "gradeLevel" (string, e.g., "Approx. Grade 8").
Text: "${text.substring(0,500)}..."`; // Send a sample

    const result = await this.service.processDirectPrompt({
        prompt: text, // Full text for actual estimation by LLM
        systemPrompt,
        modelId: this.getModel(this.config.defaultModelId),
        providerId: this.getProvider(),
        completionOptions: {temperature: 0.1, response_format: {type: "json_object"}},
        taskHint: 'readability_estimation'
    });
     if (result.error || !result.responseText) {
      throw new Error(`Readability estimation failed: ${result.error || 'No response text'}`);
    }
    try {
        const parsed = JSON.parse(result.responseText);
        return {
            score: Number(parsed.score || 0),
            interpretation: String(parsed.interpretation || "LLM estimation."),
            gradeLevel: String(parsed.gradeLevel || "N/A"),
        };
    } catch(e:any) {
        throw new Error(`Readability estimation failed: ${e.message}. LLM Response: ${result.responseText}`);
    }
  }

  public async isHealthy(): Promise<boolean | { error: string; }> {
    return this.isInitialized ? true : { error: `${this.utilityId} is not initialized.`};
  }

  // trainModel, saveTrainedModel, loadTrainedModel are typically not applicable for a pure LLM-based utility
  // unless it's about managing fine-tuned models, which is outside the scope of these direct utility calls.
  public async trainModel (
    _trainingData: Array<{text: string, label: string} | any>,
    _modelType: string,
    _trainingOptions?: Record<string, any>
  ): Promise<{success: boolean; message?: string; modelId?: string}> {
    return { success: false, message: "Training not supported by this LLMUtilityAI implementation."};
  }
  // ... stubs for save/load returning not supported.
}